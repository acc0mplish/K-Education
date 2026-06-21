"""Plugin registry + shared helpers.

Each plugin exposes: run(tool, target_path, runner, force_skip=False) -> RunResult
Plugins that wrap a CLI delegate to runner.run(). Plugins that do in-process
analysis write their own <toolID>.out/.err into runner.evidence and return a
RunResult with a computed stdout_sha256.
"""
from __future__ import annotations
import hashlib
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE.parent))

from runner import RunResult  # noqa: E402
from states import ExecutionStatus  # noqa: E402

# plugin-name -> run function (filled by register() below)
_REGISTRY: dict[str, callable] = {}


def register(name: str):
    def deco(fn):
        _REGISTRY[name] = fn
        return fn
    return deco


def get_plugin(name: str):
    return _REGISTRY.get(name)


def register_applicability_na(tool) -> RunResult:
    return RunResult(
        tool.toolID, ExecutionStatus.TARGET_NOT_APPLICABLE, None, "", 0, 0, 0.0,
        message=f"profile {tool.toolID} not applicable for this target",
    )


def _ok(tool, stdout: bytes, message: str = "in-process analysis ok", **extra) -> RunResult:
    digest = hashlib.sha256(stdout).hexdigest()
    return RunResult(
        tool.toolID, ExecutionStatus.EXECUTED, 0, digest, len(stdout), 0, 0.0,
        message=message, extra=extra,
    )


def _fail(tool, message: str, **extra) -> RunResult:
    return RunResult(
        tool.toolID, ExecutionStatus.EXECUTION_FAILED, 1, "", 0, 0, 0.0,
        message=message, extra=extra,
    )


def _write_evidence(runner, tool, stdout: bytes, stderr: bytes = b""):
    p = Path(runner.evidence)
    (p / f"{tool.toolID}.out").write_bytes(stdout)
    (p / f"{tool.toolID}.err").write_bytes(stderr)


# ---- generic CLI bridge (most Tier-1/2/3 tools) ----
@register("generic_cli")
def generic_cli(tool, target_path, runner, force_skip=False):
    res = runner.run(tool, target_path, force_skip=force_skip)
    # honor optional head truncation (e.g. hexdump)
    if tool.head and res.status == ExecutionStatus.EXECUTED:
        out = Path(runner.evidence) / f"{tool.toolID}.out"
        data = out.read_bytes()[: tool.head * 16]
        out.write_bytes(data)
    return res


# ---- stub: optional/GUI tools not implemented in scaffold ----
@register("stub")
def stub(tool, target_path, runner, force_skip=False):
    return RunResult(
        tool.toolID, ExecutionStatus.BRIDGE_UNAVAILABLE, None, "", 0, 0, 0.0,
        message=f"stub plugin: '{tool.toolID}' not implemented in scaffold "
                f"({tool.note or 'optional'}). Run manually or extend plugin.",
    )


# import side-effect registers the rest
from plugins import (  # noqa: E402,F401
    t_file, t_strings, t_pefile, t_readpe, t_capstone, t_lief,
    t_diec, t_entropy, t_asar, t_yara, t_osslsigncode, t_radare2,
    t_angr, t_ghidra, t_retdec, t_wine, t_frida, t_opus, t_electron,
)
