#!/usr/bin/env python3
"""K-Education RE harness CLI.

Usage:
  python harness/main.py tool-check
  python harness/main.py profile <target>
  python harness/main.py analyze <target> [--strategy full|quick]
  python harness/main.py coverage <target>

Strategy:
  full  - run all applicable tools (47 catalog closed), record failures/timeouts
  quick - run Tier 1-2 only + light Tier 3 (pefile/objdump/capstone)
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

# allow running both as module and as script
HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

ROOT = HERE.parent
CATALOG_PATH = ROOT / "tool_catalog.json"

from catalog import ToolCatalog  # noqa: E402
from coverage import CoverageManifest  # noqa: E402
from plugins.base import get_plugin, register_applicability_na  # noqa: E402
from runner import ToolRunner  # noqa: E402
from states import ExecutionStatus  # noqa: E402
from target_profile import classify  # noqa: E402


def _probe_tool(tool) -> str:
    """Probe actual availability by install method (self-correcting)."""
    import os as _os, shutil as _sh, subprocess as _sp
    if tool.install_status in ("manual", "deprecated"):
        return tool.install_status
    if tool.install_method == "harness":
        return "present"  # scripts shipped with repo
    if tool.install_method == "pip":
        # venv import check (toolID == module name for these)
        venv_py = str(HERE / ".venv" / "bin" / "python")
        if _os.path.exists(venv_py):
            r = _sp.run([venv_py, "-c", f"import {tool.toolID}"], capture_output=True)
            return "present" if r.returncode == 0 else "missing"
        return "missing"
    # apt / download / coreutils → PATH + fallback dirs
    if _sh.which(tool.command):
        return "present"
    for d in ("/usr/lib/wine",):
        if _os.path.exists(_os.path.join(d, tool.command)):
            return "present"
    return "missing"


def cmd_tool_check(args):
    cat = ToolCatalog(CATALOG_PATH)
    rows = []
    for t in cat.tools:
        actual = _probe_tool(t)
        rows.append({
            "toolID": t.toolID,
            "tier": t.tier,
            "installMethod": t.install_method,
            "catalogStatus": t.install_status,
            "installStatus": actual,
            "command": t.command,
        })
    from collections import Counter
    by_status = Counter(r["installStatus"] for r in rows)
    report = {
        "fullRequiredTools": len(cat.tools),
        "totalKnownTools": len(cat.tools) + len(cat.deprecated),
        "missingCore": sum(1 for r in rows if r["installStatus"] == "missing" and r["tier"] <= 3),
        "missingOptional": [r["toolID"] for r in rows if r["installStatus"] == "manual"],
        "missingDeprecated": cat.deprecated,
        "byInstallStatus": dict(by_status),
        "tools": sorted(rows, key=lambda r: (r["tier"], r["toolID"])),
    }
    out = ROOT / "tools" / "tool_check_report.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"=== tool-check ===")
    print(f"full required tools : {report['fullRequiredTools']}")
    print(f"missing core        : {report['missingCore']}")
    print(f"missing optional    : {report['missingOptional']}")
    print(f"missing deprecated  : {report['missingDeprecated']}")
    print(f"by install status   : {report['byInstallStatus']}")
    print(f"report -> {out}")


def cmd_profile(args):
    info = classify(args.target)
    print(json.dumps({
        "path": info.path, "profile": info.profile,
        "size": info.size, "magic_hex": info.magic_hex, "method": info.method,
    }, indent=2, ensure_ascii=False))


def cmd_analyze(args):
    cat = ToolCatalog(CATALOG_PATH)
    target = classify(args.target)
    evdir = ROOT / "evidence" / Path(args.target).name
    runner = ToolRunner(ROOT, evdir)
    cov = CoverageManifest(target, cat)

    # Electron lane: if this is an Electron PE (V8 shell), heavy PE decompilers
    # are deferred — business logic lives in app.asar (t_electron lane). Report §10.
    import electron_detect as _ed
    heavy_defer = {"ghidra", "ghidra_script", "retdec", "angr"}
    is_electron_pe = (target.profile == "pe" and _ed.is_electron_pe(target.path))

    quick_tiers = {0, 1, 2}
    quick_plugins = {"t_pefile", "t_capstone", "generic_cli", "t_entropy", "t_readpe", "t_lief"}

    # record not-applicable first (catalog preflight — §13.1)
    for tool in cat.tools:
        if not tool.applies_to(target.profile):
            cov.add(tool, register_applicability_na(tool))
        else:
            plugin = get_plugin(tool.plugin)
            if plugin is None:
                cov.add(tool, _bridge_unavailable(tool))
                continue
            skip = args.strategy == "quick" and (
                tool.tier not in quick_tiers and tool.plugin not in quick_plugins
            )
            if skip:
                from runner import RunResult
                cov.add(tool, RunResult(
                    tool.toolID, ExecutionStatus.SKIPPED, None, "", 0, 0, 0.0,
                    message="skipped by quick strategy (run --strategy full)"))
                continue
            # Electron lane: defer heavy PE decompilers (business logic is in asar)
            if is_electron_pe and tool.toolID in heavy_defer:
                from runner import RunResult
                cov.add(tool, RunResult(
                    tool.toolID, ExecutionStatus.EXECUTION_FAILED, None, "", 0, 0, 0.0,
                    message="DEFERRED: Electron V8 shell — business logic in app.asar; "
                            "full PE decompile not run (report §10). See electron_business lane."))
                continue
            result = plugin(tool, target.path, runner, force_skip=False)
            cov.add(tool, result)

    cov.write(evdir / "coverage.json")
    agg = cov.aggregate()
    print(f"\n=== analyze: {Path(args.target).name} (profile={target.profile}, strategy={args.strategy}) ===")
    print(f"canClaimFullCoverage      : {agg['canClaimFullCoverage']}")
    print(f"canClaimAllToolsSucceeded : {agg['canClaimAllToolsSucceeded']}")
    print(f"executed={agg['executedCount']}  notApplicable={agg['notApplicableCount']}  "
          f"failed={agg['failedCount']}  timeout={agg['timeoutCount']}  "
          f"manualInstall={agg['manualInstallCount']}")
    if agg["failedToolIDs"]:
        print(f"failedToolIDs   : {agg['failedToolIDs']}")
    if agg["timeoutToolIDs"]:
        print(f"timeoutToolIDs  : {agg['timeoutToolIDs']}")
    print(f"coverage -> {evdir / 'coverage.json'}")


def _bridge_unavailable(tool):
    from runner import RunResult
    return RunResult(tool.toolID, ExecutionStatus.BRIDGE_UNAVAILABLE, None, "", 0, 0, 0.0,
                     message=f"no plugin registered for '{tool.plugin}'")


def cmd_coverage(args):
    evdir = ROOT / "evidence" / Path(args.target).name / "coverage.json"
    if not evdir.exists():
        print(f"no coverage.json at {evdir}. run analyze first.")
        sys.exit(1)
    data = json.loads(evdir.read_text(encoding="utf-8"))
    print(json.dumps({k: data[k] for k in
                      ["canClaimFullCoverage", "canClaimAllToolsSucceeded",
                       "totals", "executedCount", "notApplicableCount",
                       "failedCount", "timeoutCount", "failedToolIDs", "timeoutToolIDs"]
                      }, indent=2, ensure_ascii=False))


def cmd_report(args):
    import report_html
    name = Path(args.target).name
    evdir = ROOT / "evidence" / name
    if not (evdir / "coverage.json").exists():
        print(f"no coverage.json at {evdir}. run analyze first.")
        sys.exit(1)
    out = report_html.render(name, evdir)
    print(f"report -> {out}")


def cmd_sec_report(args):
    import report_sec
    name = Path(args.target).name
    evdir = ROOT / "evidence" / name
    if not (evdir / "vuln_subscription.out").exists() and not (evdir / "red_findings.json").exists():
        print(f"no BLUE/RED artifacts at {evdir}. run analyze + redteam first.")
        sys.exit(1)
    out = report_sec.render(name, evdir)
    print(f"security report -> {out}")


def cmd_dynamic(args):
    import subprocess
    script = ROOT / "scripts" / "dynamic_windows.py"
    cmd = [sys.executable, str(script), args.target, "--seconds", str(args.seconds)]
    if args.run:
        cmd.append("--run")
    subprocess.run(cmd)


def main():
    ap = argparse.ArgumentParser(prog="re-harness")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("tool-check", help="list catalog + install status").set_defaults(func=cmd_tool_check)
    p_prof = sub.add_parser("profile", help="classify target")
    p_prof.add_argument("target"); p_prof.set_defaults(func=cmd_profile)
    p_an = sub.add_parser("analyze", help="run full/quick analysis")
    p_an.add_argument("target")
    p_an.add_argument("--strategy", choices=["full", "quick"], default="full")
    p_an.set_defaults(func=cmd_analyze)
    p_cov = sub.add_parser("coverage", help="show coverage summary")
    p_cov.add_argument("target"); p_cov.set_defaults(func=cmd_coverage)
    p_rep = sub.add_parser("report", help="render interactive HTML report")
    p_rep.add_argument("target"); p_rep.set_defaults(func=cmd_report)
    p_sec = sub.add_parser("sec-report", help="render red/blue security handoff report")
    p_sec.add_argument("target"); p_sec.set_defaults(func=cmd_sec_report)
    p_dyn = sub.add_parser("dynamic", help="WSL Windows-interop dynamic run (proc tree + network)")
    p_dyn.add_argument("target")
    p_dyn.add_argument("--run", action="store_true", help="actually spawn the PE (default dry-run)")
    p_dyn.add_argument("--seconds", type=int, default=4)
    p_dyn.set_defaults(func=cmd_dynamic)
    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
