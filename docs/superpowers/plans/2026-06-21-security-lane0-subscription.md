# Security Lane 0 — Subscription/License Bypass (Red/Blue) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a working end-to-end Lane 0 (subscription/license bypass) slice to the K-Education harness — a BLUE static detector, a RED proof-of-concept, a red→blue unified security report — producing a blue-team handoff artifact for the DAF Launcher target.

**Architecture:** Extends the existing harness plugin pattern (`base.py` registry + `tool_catalog.json` + in-process detectors like `electron_detect.py`). BLUE detector `t_vuln_subscription.py` scans zip/asar/pe/elf for S1–S8 static signals. RED PoC `s4_mock_endpoint.py` probes the DAF `/api/subscription/mock-set` endpoint on an owned target. `report_sec.py` merges `red_findings.json` + `vuln_subscription.out` into `security_report.html`. New CLI subcommand `sec-report`.

**Tech Stack:** Python 3.12.3 (venv `harness/.venv`), pytest, stdlib `zipfile`/`http.server`/`json`/`argparse`. No new external deps (RED PoC uses stdlib `urllib`, not `requests`).

**Spec:** `docs/superpowers/specs/2026-06-21-security-attacks-dual-perspective-design.md` (Lane 0 = S1–S8 red + D1–D6 blue).

## Global Constraints

- **Python**: 3.12.3 via `harness/.venv` (PEP 668 externally-managed → never `pip install` to system). Run python as `harness/.venv/bin/python`, tests as `harness/.venv/bin/pytest`.
- **Paths**: always absolute (harness Bash cwd can stick to `harness/node_tools`; relative paths fail). Repo root = `/mnt/d/DEV/K-Education`.
- **TDD**: write failing test → run-fail → minimal impl → run-pass → commit. 80% coverage floor (global testing rule).
- **Immutability**: never mutate inputs; build new dicts/lists (global coding-style).
- **File size**: 200–400 lines typical, 800 max. Focused single-responsibility files.
- **No `console.log`/debug prints** left in committed code.
- **Plugin contract**: `run(tool, target_path, runner, force_skip=False) -> RunResult` (see `harness/plugins/base.py`). In-process detectors write `<toolID>.out` into `runner.evidence` and return `base._ok(tool, stdout_bytes, message, **extra)`.
- **Ethics (HARD)**: RED PoCs target **owned or intentionally-vulnerable lab** only. Every RED entrypoint must refuse non-local targets unless `--i-own-this` is passed. No distributed/DoS capability, no distributable crack/keygen. Output is a findings report for blue-team hardening.
- **Commit style**: conventional commits (`feat:`, `test:`, `docs:`, `chore:`). Project is **not** a git repo yet — if `git` is unavailable, skip the commit step and note it; do not block on it.

---

## File Structure (Plan 1 — Lane 0 only)

```
K-Education/
├── tests/                                   # NEW — pytest root
│   ├── conftest.py                          # sys.path wiring + shared fixtures
│   ├── test_vuln_subscription.py            # BLUE detector tests
│   ├── test_red_orchestrator.py             # RED orchestrator tests
│   ├── test_s4_mock_endpoint.py             # RED PoC tests (local mock server)
│   └── test_report_sec.py                   # unified report tests
├── harness/
│   ├── plugins/
│   │   ├── t_vuln_subscription.py           # NEW — BLUE detector (S1-S8 static signals)
│   │   └── base.py                          # MODIFY — register new plugin import
│   ├── report_sec.py                        # NEW — unified red/blue security report
│   ├── report_docs.py                       # NEW — red/blue 계획서+결과서 generator
│   └── main.py                              # MODIFY — add `sec-report` + `engagement-report`
├── education/                               # NEW
│   ├── README.md                            # red/blue philosophy + ethics
│   ├── attacks/subscription/
│   │   └── 01_subscription_bypass.md        # Lane 0 doc (S1-S8 + D1-D6 + lab)
│   ├── labs/README.md                       # DVWA/Juice Shop/WebGoat docker
│   ├── reports/                             # NEW — formal engagement deliverables
│   │   ├── templates/                       # red/blue 계획서 + 결과서 templates
│   │   │   ├── red_team_plan.md  red_team_result.md
│   │   │   └── blue_team_plan.md  blue_team_result.md
│   │   └── engagements/                     # filled docs per engagement (generated)
│   └── redteam/
│       ├── run_redteam.py                   # NEW — RED orchestrator → red_findings.json
│       ├── payloads/subscription.json       # NEW — payload/pattern library
│       └── subscription/
│           └── s4_mock_endpoint.py          # NEW — RED PoC (S4 mock-endpoint abuse)
└── tool_catalog.json                        # MODIFY — +1 tier-7 row `vuln_subscription`
```

Lanes 1–3 (Electron/Tauri/binary detectors + PoCs) are **follow-up plans**, not this one.

---

### Task 1: Test infrastructure + education scaffolding

**Files:**
- Create: `tests/conftest.py`
- Create: `tests/__init__.py` (empty)
- Create: `education/README.md`, `education/labs/README.md`, `education/attacks/subscription/.gitkeep`, `education/redteam/subscription/.gitkeep`, `education/redteam/payloads/.gitkeep`

**Interfaces:**
- Produces: `tests/conftest.py` exposing `harness` on `sys.path` so later tasks can `from plugins.base import ...`.

- [ ] **Step 1: Ensure pytest in venv**

Run: `harness/.venv/bin/python -m pytest --version`
Expected: `pytest 8.x.x`. If `No module named pytest`, run `harness/.venv/bin/python -m pip install pytest` and re-check.

- [ ] **Step 2: Write conftest (sys.path wiring + tmp fixture)**

Create `tests/conftest.py`:
```python
"""Shared pytest config: put harness/ and repo root on sys.path."""
import sys, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
HARNESS = ROOT / "harness"
for p in (str(ROOT), str(HARNESS)):
    if p not in sys.path:
        sys.path.insert(0, p)


def make_zip_with_js(tmp_path: Path, name: str, members: dict[str, str]) -> Path:
    """Build a zip fixture whose members map filename -> JS/text content."""
    p = tmp_path / name
    with zipfile.ZipFile(p, "w", zipfile.ZIP_DEFLATED) as zf:
        for fname, body in members.items():
            zf.writestr(fname, body)
    return p
```

- [ ] **Step 3: Smoke test — harness imports resolve**

Create `tests/test_smoke.py`:
```python
def test_harness_imports():
    from catalog import ToolCatalog  # noqa: F401
    from plugins.base import get_plugin, register  # noqa: F401
    from runner import RunResult  # noqa: F401
```

- [ ] **Step 4: Run smoke test**

Run: `harness/.venv/bin/python -m pytest tests/test_smoke.py -v`
Expected: PASS (1 test).

- [ ] **Step 5: Create education scaffolding (dirs + minimal README)**

`education/README.md`:
```markdown
# K-Education — 보안 공격 교육 자료 (Red/Blue 듀얼 퍼스펙티브)

각 공격 벡터 = 🔴 Red(offensive) + 🔵 Blue(defensive) 동시 교육.
산출물 = `evidence/<target>/security_report.html` (blue-team 핸드오프).

## 윤리 가드레일 (HARD)
- RED 실습 = **본인 소유 앱 또는 의도적 취약 랩**(DVWA/Juice Shop/WebGoat)에만.
- 모든 RED 엔드포인트는 비-로컬 타겟 거부(`--i-own-this` 어설션 필요).
- **제공 거부**: 분산/DoS 공격 도구, 배포용 크랙/keygen/범용 패처, 실제 피싱 무기화.
- 타인 시스템·서비스 공격·저작물 복제 금지.

## 구조
- `attacks/<lane>/` — 벡터별 매핑 문서 (Red 원리/페이로드 + Blue 탐지/완화)
- `redteam/<lane>/` — RED PoC 스크립트 (own-lab 대상) + `payloads/`
- `redteam/run_redteam.py` — 오케스트레이터 → `evidence/<t>/red_findings.json`
- `labs/README.md` — 취약랩 로컬 Docker 구성

## 레인
- **Lane 0 — 구독/라이선스 우회** (S1-S8) 🔥 최우선, cross-cutting
- Lane 1 — Electron / Lane 2 — Tauri / Lane 3 — 일반 바이너리 (후속 plan)

스펙: `docs/superpowers/specs/2026-06-21-security-attacks-dual-perspective-design.md`
```

`education/labs/README.md`:
```markdown
# 취약 랩 로컬 구성 (실습용)

## DVWA (Damn Vulnerable Web App)
docker run -d -p 8080:80 --name dvwa vulnerables/web-dvwa
# http://localhost:8080 (기본 admin/password)

## OWASP Juice Shop
docker run -d -p 3000:3000 --name juice-shop bkimminich/juice-shop
# http://localhost:3000

## WebGoat
docker run -d -p 8081:8080 -p 9090:9090 --name webgoat webgoat/goatandwolf
# http://localhost:8081/WebGoat

> 모든 랩은 localhost 전용. 외부 노출 금지. RED PoC는 이 랩 또는 본인 소유 앱 대상.
```

Create empty `.gitkeep` files in the four new dirs so structure exists.

- [ ] **Step 6: Commit**

```bash
git add tests/ education/
git commit -m "chore: add test infra + education scaffolding (Lane 0)"
```
(If `git` not initialized, note "not a git repo — commit skipped".)

---

### Task 2: BLUE subscription detector core (t_vuln_subscription.py)

**Files:**
- Create: `harness/plugins/t_vuln_subscription.py`
- Test: `tests/test_vuln_subscription.py`

**Interfaces:**
- Produces: `scan(path: str) -> dict` returning `{"target","profile","scannedMembers","findings":[...],"summary":{...}}` where each finding = `{"id","signal","severity","match","file","remediation"}`. Also exposes `run(tool, target_path, runner, force_skip)` registered as `"t_vuln_subscription"`.
- Consumes: `base._ok`, `base._write_evidence`, `base.register_applicability_na`, `runner.RunResult`, `states.ExecutionStatus` (from Task 1's sys.path wiring).

- [ ] **Step 1: Write failing test for the scan function**

Create `tests/test_vuln_subscription.py`:
```python
from conftest import make_zip_with_js


def test_detects_mock_endpoint_and_client_check(tmp_path):
    from plugins.t_vuln_subscription import scan
    z = make_zip_with_js(tmp_path, "app.zip", {
        "resources/app.asar>main.js": (
            "const premium = SUBSCRIPTION_STATUS === 'active';\n"
            "fetch('/api/subscription/mock-set', {method:'POST', body:'{\"plan\":\"pro\"}'});\n"
            "function isSubscribed(){ return localStorage.subscription === 'pro'; }\n"
        ),
    })
    report = scan(str(z))
    sigs = {f["signal"] for f in report["findings"]}
    assert "mock_endpoint" in sigs
    assert "client_subscription_check" in sigs
    mock = next(f for f in report["findings"] if f["signal"] == "mock_endpoint")
    assert mock["severity"] == "high"
    assert mock["remediation"] == "D5"
    assert report["summary"]["high"] >= 1


def test_clean_input_has_no_findings(tmp_path):
    from plugins.t_vuln_subscription import scan
    z = make_zip_with_js(tmp_path, "clean.zip", {"main.js": "console.log('hello world');\n"})
    report = scan(str(z))
    assert report["findings"] == []
```

- [ ] **Step 2: Run test — verify it fails**

Run: `harness/.venv/bin/python -m pytest tests/test_vuln_subscription.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'plugins.t_vuln_subscription'`.

- [ ] **Step 3: Implement the detector**

Create `harness/plugins/t_vuln_subscription.py`:
```python
"""t_vuln_subscription — BLUE detector for subscription/license bypass (Lane 0, S1-S8).

Scans zip/asar/pe/elf for static signals that indicate a bypassable
subscription model. Reuses codebase_audit's scan shape (regex PATTERNS over
member/raw bytes) but with subscription-specific patterns.

Finding schema:
  {"id","signal","severity","match","file","remediation"}
"""
from __future__ import annotations
import re, zipfile
from pathlib import Path

# signal -> (regex, severity, S-vector id, D-remediation id)
_PATTERNS = [
    ("mock_endpoint", re.compile(rb"/api/subscription/mock-set", re.I),
     "high", "S4", "D5"),
    ("client_subscription_check",
     re.compile(rb"\b(?:SUBSCRIPTION_STATUS|SUBSCRIPTION_PLAN|isSubscribed|isPremium|hasSubscription|subscriptionActive)\b"),
     "med", "S1/S6", "D1"),
    ("client_license_check",
     re.compile(rb"\b(?:isLicensed|licenseValid|checkLicense|verifySubscription|isProUser)\b"),
     "med", "S1", "D1/D2"),
    ("plaintext_subscription_store",
     re.compile(rb"\b(?:subscription|premium|license|isPro)\s*[:=]\s*['\"]?(?:true|active|pro|1|premium)['\"]?", re.I),
     "med", "S3", "D3"),
    ("trial_expiry", re.compile(rb"\b(?:trialExpiresAt|trialEnd|freeTrial|trialDays)\b"),
     "low", "S7", "D3"),
    ("remote_subscription_endpoint",
     re.compile(rb"/api/(?:me|subscription/[\w-]+)", re.I),
     "low", "S4", "D4"),
]

MAX_MATCHES_PER_SIGNAL = 50


def _scan_bytes(name: str, data: bytes) -> list[dict]:
    out = []
    for signal, rx, sev, sid, did in _PATTERNS:
        hits = rx.findall(data)
        if not hits:
            continue
        seen, uniq = set(), []
        for h in hits[:MAX_MATCHES_PER_SIGNAL]:
            s = h.decode("latin1", "replace") if isinstance(h, (bytes, bytearray)) else h
            if s not in seen:
                seen.add(s)
                uniq.append(s)
        for m in uniq:
            out.append({"id": sid, "signal": signal, "severity": sev,
                        "match": m, "file": name, "remediation": did})
    return out


def _is_textish(data: bytes) -> bool:
    if data.lstrip().startswith((b"{", b"<", b"import", b"function", b"const", b"var", b"let", b"//")):
        return True
    return data.count(b"\x00") <= len(data) * 0.10


def scan(path: str) -> dict:
    p = Path(path)
    findings: list[dict] = []
    scanned = 0
    if zipfile.is_zipfile(p):
        with zipfile.ZipFile(p) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                try:
                    data = zf.read(info)
                except (RuntimeError, zipfile.BadZipFile, OSError):
                    continue
                if not _is_textish(data):
                    continue
                scanned += 1
                findings.extend(_scan_bytes(info.filename, data[: 8 * 1024 * 1024]))
    else:
        with open(p, "rb") as f:
            data = f.read(64 * 1024 * 1024)
        if _is_textish(data):
            scanned = 1
            findings.extend(_scan_bytes(str(p), data))
    summary = {"high": 0, "med": 0, "low": 0}
    for f in findings:
        summary[f["severity"]] = summary.get(f["severity"], 0) + 1
    return {"target": str(p), "scannedMembers": scanned,
            "findings": findings, "summary": summary}
```

- [ ] **Step 4: Run test — verify it passes**

Run: `harness/.venv/bin/python -m pytest tests/test_vuln_subscription.py -v`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add harness/plugins/t_vuln_subscription.py tests/test_vuln_subscription.py
git commit -m "feat(blue): add t_vuln_subscription static detector (Lane 0 S1-S8)"
```

---

### Task 3: Wire detector into harness (register + catalog row)

**Files:**
- Modify: `harness/plugins/base.py` (add import line in the side-effect block)
- Modify: `tool_catalog.json` (add 1 row)
- Test: `tests/test_vuln_subscription.py` (append harness-integration test)

**Interfaces:**
- Produces: catalog tool `vuln_subscription` (tier 7) wired to plugin `t_vuln_subscription`, applicable to `zip,asar,pe,elf`.
- Consumes: `main.py`'s analyze loop calls `get_plugin(tool.plugin)` → must resolve `t_vuln_subscription`.

- [ ] **Step 1: Append integration test**

Append to `tests/test_vuln_subscription.py`:
```python
def test_plugin_registered_and_runs(tmp_path):
    from catalog import Tool
    from plugins.base import get_plugin
    import json
    z = make_zip_with_js(tmp_path, "t.zip", {"a.js": "fetch('/api/subscription/mock-set');\n"})
    tool = Tool(toolID="vuln_subscription", tier=7, install_method="harness",
                install_status="present", command="python", args=[],
                target_profiles=["zip"], timeout=120, plugin="t_vuln_subscription")

    class FakeRunner:
        def __init__(self, d): self.evidence = str(d)
    import os
    ev = tmp_path / "ev"; ev.mkdir()
    runner = FakeRunner(ev)
    plugin = get_plugin("t_vuln_subscription")
    assert plugin is not None
    res = plugin(tool, str(z), runner, force_skip=False)
    assert res.status.value == "executed"
    out = json.loads((ev / "vuln_subscription.out").read_text(encoding="utf-8"))
    assert out["summary"]["high"] >= 1
```

- [ ] **Step 2: Run — verify fail (plugin not registered / no run())**

Run: `harness/.venv/bin/python -m pytest tests/test_vuln_subscription.py::test_plugin_registered_and_runs -v`
Expected: FAIL — `get_plugin("t_vuln_subscription")` returns None (not registered, and `run` not defined yet).

- [ ] **Step 3: Add `run()` + register to the detector**

Append to `harness/plugins/t_vuln_subscription.py`:
```python
from plugins.base import register, _ok, _write_evidence, register_applicability_na  # noqa: E402
from states import ExecutionStatus  # noqa: E402
from runner import RunResult  # noqa: E402

_APPLICABLE = {"zip", "asar", "pe", "elf", "mach_o"}


@register("t_vuln_subscription")
def run(tool, target_path, runner, force_skip=False):
    if tool.target_profiles and not any(
        p in _APPLICABLE for p in tool.target_profiles
    ):
        return register_applicability_na(tool)
    import json
    report = scan(target_path)
    stdout = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, stdout)
    return _ok(tool, stdout,
               message=f"vuln_subscription: {len(report['findings'])} findings "
                       f"(high={report['summary']['high']}, med={report['summary']['med']}, "
                       f"low={report['summary']['low']})",
               findingsCount=len(report["findings"]),
               findingsSummary=report["summary"])
```

- [ ] **Step 4: Register import in base.py**

In `harness/plugins/base.py`, change the side-effect import block (currently ends with `t_electron,`) to also import `t_vuln_subscription`:
```python
from plugins import (  # noqa: E402,F401
    t_file, t_strings, t_pefile, t_readpe, t_capstone, t_lief,
    t_diec, t_entropy, t_asar, t_yara, t_osslsigncode, t_radare2,
    t_angr, t_ghidra, t_retdec, t_wine, t_frida, t_opus, t_electron,
    t_vuln_subscription,
)
```

- [ ] **Step 5: Add catalog row**

In `tool_catalog.json`, insert before the `mobsf` row (inside the `tools` array):
```json
    {"toolID": "vuln_subscription", "tier": 7, "install": {"method": "harness", "status": "present"}, "command": "python", "args": ["-c","import plugins.t_vuln_subscription"], "targetProfiles": ["zip","asar","pe","elf"], "timeout": 180, "plugin": "t_vuln_subscription", "note": "Lane 0 BLUE: subscription/license bypass static detector (S1-S8)"},
```

- [ ] **Step 6: Run full detector test suite**

Run: `harness/.venv/bin/python -m pytest tests/test_vuln_subscription.py -v`
Expected: PASS (3 tests).

- [ ] **Step 7: Verify end-to-end via CLI on existing fixture**

Run: `harness/.venv/bin/python harness/main.py analyze targets/electron_fixture --strategy quick`
Expected: completes; `vuln_subscription` appears in `evidence/electron_fixture/coverage.json` `rows` with `executionStatus: executed` (or `target_not_applicable` if that fixture's profile isn't in the list — acceptable). If `targets/electron_fixture` is a dir not a file, use `evidence/sample_pe.exe` instead:
`harness/.venv/bin/python harness/main.py analyze evidence/sample_pe.exe --strategy quick`

- [ ] **Step 8: Commit**

```bash
git add harness/plugins/t_vuln_subscription.py harness/plugins/base.py tool_catalog.json tests/test_vuln_subscription.py
git commit -m "feat(blue): wire vuln_subscription into catalog + plugin registry"
```

---

### Task 4: RED S4 mock-endpoint PoC (s4_mock_endpoint.py)

**Files:**
- Create: `education/redteam/subscription/s4_mock_endpoint.py`
- Create: `education/redteam/payloads/subscription.json`
- Test: `tests/test_s4_mock_endpoint.py`

**Interfaces:**
- Produces: `probe(target_url: str, *, i_own_this: bool, timeout: float) -> dict` returning a finding dict `{"id":"S4","vector","severity","confirmed":bool,"evidence","target","remediation":"D5"}`. CLI entry `main()` parses args and prints JSON.
- Consumes: stdlib `urllib.request`, `urllib.parse`.

- [ ] **Step 1: Create payload library**

`education/redteam/payloads/subscription.json`:
```json
{
  "mock_endpoints": ["/api/subscription/mock-set", "/api/subscription/mock"],
  "spoof_bodies": ["{\"plan\":\"pro\",\"status\":\"active\"}", "{\"subscriptionStatus\":\"premium\"}"],
  "_ethics": "own-lab / owned target only. --i-own-this required for non-localhost."
}
```

- [ ] **Step 2: Write failing test (local mock server)**

Create `tests/test_s4_mock_endpoint.py`:
```python
import http.server, json, socketserver, threading
from education_redteam_path import ensure  # helper added in Step 3


def _serve(handler, port):
    srv = socketserver.TCPServer(("127.0.0.1", port), handler)
    srv.allow_reuse_address = True
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    return srv


def test_probe_flags_mock_endpoint_on_owned_lab():
    ensure()  # adds education/ to sys.path
    from redteam.subscription.s4_mock_endpoint import probe

    class H(http.server.BaseHTTPRequestHandler):
        def do_POST(self):
            self.send_response(200); self.end_headers(); self.wfile.write(b'{"ok":true}')
        def log_message(self, *a): pass

    srv = _serve(H, 18099)
    try:
        finding = probe("http://127.0.0.1:18099", i_own_this=True, timeout=3)
        assert finding["id"] == "S4"
        assert finding["confirmed"] is True
        assert finding["severity"] == "high"
        assert finding["remediation"] == "D5"
    finally:
        srv.shutdown()


def test_probe_refuses_nonlocal_without_assertion():
    ensure()
    from redteam.subscription.s4_mock_endpoint import probe
    finding = probe("http://example.com", i_own_this=False, timeout=3)
    assert finding["confirmed"] is False
    assert "refused" in finding["evidence"].lower() or "own" in finding["evidence"].lower()
```

- [ ] **Step 3: Add sys.path helper for redteam import**

Create `tests/education_redteam_path.py`:
```python
import sys
from pathlib import Path

EDU = Path(__file__).resolve().parent.parent / "education"


def ensure():
    if str(EDU) not in sys.path:
        sys.path.insert(0, str(EDU))
```

- [ ] **Step 4: Run — verify fail**

Run: `harness/.venv/bin/python -m pytest tests/test_s4_mock_endpoint.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'redteam.subscription.s4_mock_endpoint'`.

- [ ] **Step 5: Implement the PoC**

Create `education/redteam/subscription/__init__.py` (empty) and `education/redteam/__init__.py` (empty), then `education/redteam/subscription/s4_mock_endpoint.py`:
```python
#!/usr/bin/env python3
"""S4 — RED PoC: abuse /api/subscription/mock-set if present on an OWNED target.

Educational anti-tamper assessment. Refuses non-local targets unless
--i-own-this is asserted. Output is a finding dict for the blue-team report.
"""
from __future__ import annotations
import argparse, json, sys
from urllib import request, error

MOCK_PATHS = ("/api/subscription/mock-set", "/api/subscription/mock")
SPOOF_BODY = '{"plan":"pro","status":"active"}'


def _is_local(url: str) -> bool:
    low = url.lower()
    return any(h in low for h in ("127.0.0.1", "localhost", "0.0.0.0", "[::1]"))


def probe(target_url: str, *, i_own_this: bool, timeout: float = 5.0) -> dict:
    base = target_url.rstrip("/")
    finding = {"id": "S4", "vector": "mock-endpoint subscription abuse",
               "severity": "high", "confirmed": False,
               "evidence": "", "target": base, "remediation": "D5"}
    if not _is_local(base) and not i_own_this:
        finding["evidence"] = ("refused: non-local target requires --i-own-this "
                               "(owned/lab only per ethics guardrail)")
        return finding
    for path in MOCK_PATHS:
        url = base + path
        req = request.Request(url, data=SPOOF_BODY.encode(),
                              method="POST",
                              headers={"Content-Type": "application/json"})
        try:
            with request.urlopen(req, timeout=timeout) as r:
                body = r.read(512).decode("latin1", "replace")
                finding["confirmed"] = True
                finding["evidence"] = f"{url} -> HTTP {r.status}: {body}"
                return finding
        except error.HTTPError as e:
            if e.code in (404, 405):
                continue  # endpoint not present — try next
            finding["evidence"] = f"{url} -> HTTP {e.code}"
            return finding
        except (error.URLError, TimeoutError, OSError) as e:
            finding["evidence"] = f"{url} -> connect error: {e!r}"
            return finding
    finding["evidence"] = "no mock subscription endpoint responded (likely not present)"
    return finding


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="S4 RED PoC (owned/lab target only)")
    ap.add_argument("target", help="base URL, e.g. http://127.0.0.1:8080")
    ap.add_argument("--i-own-this", action="store_true",
                    help="assert target is owned/intentionally vulnerable")
    ap.add_argument("--timeout", type=float, default=5.0)
    args = ap.parse_args(argv)
    print(json.dumps(probe(args.target, i_own_this=args.i_own_this,
                           timeout=args.timeout), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 6: Run — verify pass**

Run: `harness/.venv/bin/python -m pytest tests/test_s4_mock_endpoint.py -v`
Expected: PASS (2 tests).

- [ ] **Step 7: Commit**

```bash
git add education/redteam/ tests/test_s4_mock_endpoint.py tests/education_redteam_path.py
git commit -m "feat(red): S4 mock-endpoint subscription bypass PoC (owned/lab)"
```

---

### Task 5: RED orchestrator (run_redteam.py)

**Files:**
- Create: `education/redteam/run_redteam.py`
- Test: `tests/test_red_orchestrator.py`

**Interfaces:**
- Produces: `run(target: str, *, i_own_this: bool, evidence_dir: Path) -> Path` writing `evidence_dir/red_findings.json` = `{"target","findings":[...],"generatedVia"}`. Each registered RED module is a callable returning one finding dict.
- Consumes: `s4_mock_endpoint.probe` from Task 4.

- [ ] **Step 1: Write failing test**

Create `tests/test_red_orchestrator.py`:
```python
import json
from education_redteam_path import ensure


def test_orchestrator_writes_red_findings(tmp_path):
    ensure()
    from redteam.run_redteam import run
    out = run("http://127.0.0.1:1", i_own_this=True, evidence_dir=tmp_path)
    data = json.loads(out.read_text(encoding="utf-8"))
    assert data["target"] == "http://127.0.0.1:1"
    assert isinstance(data["findings"], list)
    assert any(f["id"] == "S4" for f in data["findings"])
```

- [ ] **Step 2: Run — verify fail**

Run: `harness/.venv/bin/python -m pytest tests/test_red_orchestrator.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'redteam.run_redteam'`.

- [ ] **Step 3: Implement orchestrator**

Create `education/redteam/run_redteam.py`:
```python
#!/usr/bin/env python3
"""RED orchestrator — runs registered RED PoCs against an owned target and
writes evidence/<target>/red_findings.json for the unified security report.

Ethics: owned / intentionally-vulnerable lab only. Passes i_own_this through.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path

EDU = Path(__file__).resolve().parent.parent  # education/
if str(EDU) not in sys.path:
    sys.path.insert(0, str(EDU))

from redteam.subscription.s4_mock_endpoint import probe as s4_probe

# Registry of (id, callable(target, i_own_this, timeout) -> finding dict)
RED_MODULES = [
    ("S4", s4_probe),
]


def run(target: str, *, i_own_this: bool, evidence_dir: Path,
        timeout: float = 5.0) -> Path:
    findings = []
    for _id, fn in RED_MODULES:
        try:
            f = fn(target, i_own_this=i_own_this, timeout=timeout)
            if isinstance(f, dict):
                findings.append(f)
        except Exception as e:  # one PoC failing must not abort the run
            findings.append({"id": _id, "confirmed": False,
                             "evidence": f"runner error: {e!r}", "severity": "info"})
    evidence_dir = Path(evidence_dir)
    evidence_dir.mkdir(parents=True, exist_ok=True)
    out = evidence_dir / "red_findings.json"
    out.write_text(json.dumps(
        {"target": target, "findings": findings, "generatedVia": "run_redteam"},
        indent=2, ensure_ascii=False), encoding="utf-8")
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="RED orchestrator (owned/lab target)")
    ap.add_argument("target", help="base URL or path of owned target")
    ap.add_argument("--evidence-dir", default=None,
                    help="output dir (default: evidence/<safe-name>/)")
    ap.add_argument("--i-own-this", action="store_true")
    ap.add_argument("--timeout", type=float, default=5.0)
    args = ap.parse_args(argv)
    ev = Path(args.evidence_dir) if args.evidence_dir else (
        Path(__file__).resolve().parents[2] / "evidence" /
        args.target.replace("/", "_").replace(":", "_")[:80])
    out = run(args.target, i_own_this=args.i_own_this,
              evidence_dir=ev, timeout=args.timeout)
    print(f"red findings -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Run — verify pass**

Run: `harness/.venv/bin/python -m pytest tests/test_red_orchestrator.py -v`
Expected: PASS (1 test). Note: S4 against port 1 returns `confirmed=False` with a connect-error finding — that's the expected clean-target path.

- [ ] **Step 5: Commit**

```bash
git add education/redteam/run_redteam.py tests/test_red_orchestrator.py
git commit -m "feat(red): run_redteam orchestrator -> red_findings.json"
```

---

### Task 6: Unified security report (report_sec.py)

**Files:**
- Create: `harness/report_sec.py`
- Test: `tests/test_report_sec.py`

**Interfaces:**
- Produces: `render(target_name: str, evdir: Path) -> Path` writing `evdir/security_report.html`. Reads `vuln_subscription.out` (BLUE) + `red_findings.json` (RED) from `evdir`.
- Consumes: stdlib `json`, `html`. Mirrors `report_html.render` signature.

- [ ] **Step 1: Write failing test**

Create `tests/test_report_sec.py`:
```python
import json
from pathlib import Path


def test_render_merges_red_and_blue(tmp_path):
    from report_sec import render
    # BLUE artifact
    (tmp_path / "vuln_subscription.out").write_text(json.dumps({
        "findings": [{"id": "S4", "signal": "mock_endpoint", "severity": "high",
                      "match": "/api/subscription/mock-set", "file": "a.js",
                      "remediation": "D5"}],
        "summary": {"high": 1, "med": 0, "low": 0}
    }), encoding="utf-8")
    # RED artifact
    (tmp_path / "red_findings.json").write_text(json.dumps({
        "target": "http://127.0.0.1:8080",
        "findings": [{"id": "S4", "vector": "mock-endpoint abuse",
                      "severity": "high", "confirmed": True,
                      "evidence": "HTTP 200", "target": "http://127.0.0.1:8080",
                      "remediation": "D5"}]
    }), encoding="utf-8")
    out = render("demo", tmp_path)
    html = out.read_text(encoding="utf-8")
    assert out.name == "security_report.html"
    assert "mock_endpoint" in html          # blue finding present
    assert "mock-endpoint abuse" in html    # red finding present
    assert "D5" in html                      # remediation mapped


def test_render_with_no_artifacts(tmp_path):
    from report_sec import render
    out = render("empty", tmp_path)
    html = out.read_text(encoding="utf-8")
    assert "구독 우회" in html or "subscription" in html.lower()
    assert "no findings" in html.lower() or "발견 없음" in html
```

- [ ] **Step 2: Run — verify fail**

Run: `harness/.venv/bin/python -m pytest tests/test_report_sec.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'report_sec'`.

- [ ] **Step 3: Implement report_sec**

Create `harness/report_sec.py`:
```python
#!/usr/bin/env python3
"""Unified red/blue security report (Lane 0 subscription).

Merges BLUE static detection (vuln_subscription.out) with RED exploitation
evidence (red_findings.json) into a self-contained HTML handoff artifact for
the blue team. Each finding links a confirmed exploitation (red) to a static
detection (blue) and a remediation id (D1-D6).
"""
from __future__ import annotations
import html, json
from pathlib import Path

SEV_COLOR = {"high": "#dc2626", "med": "#ea580c", "low": "#ca8a04", "info": "#6b7280"}

# remediation id -> (title, guidance)
D_GUIDE = {
    "D1": ("서버 권위 체크", "클라이언트 구독상태를 신뢰 금지. 프리미엄 기능을 서버에서 게이트."),
    "D2": ("클라이언트 강화", "asar/바이너리 무결성 체크섬, 난독화, 안티디버그/안티태퍼."),
    "D3": ("서명/암호화 상태 저장", "구독상태 평문 저장 금지. 서명 검증."),
    "D4": ("TLS pinning + 응답 서명", "서버 응답 서명, 클라이언트 검증."),
    "D5": ("디버그 엔드포인트 제거", "/api/subscription/mock-set 프로덕션 금지."),
    "D6": ("변조 감지", "asar/binary 수정시 실행 거부, frida/디버거 감지."),
}


def _load(evdir: Path):
    blue, red = None, None
    bp = evdir / "vuln_subscription.out"
    if bp.exists():
        try:
            blue = json.loads(bp.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    rp = evdir / "red_findings.json"
    if rp.exists():
        try:
            red = json.loads(rp.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return blue, red


def _remediation_html(rid: str) -> str:
    title, guide = D_GUIDE.get(rid, (rid, ""))
    return f"<b>{html.escape(title)}</b> — {html.escape(guide)}"


def render(target_name: str, evdir: Path) -> Path:
    blue, red = _load(evdir)
    blue_findings = (blue or {}).get("findings", [])
    red_findings = (red or {}).get("findings", [])
    has_any = bool(blue_findings or red_findings)

    def row(f, kind):
        sev = f.get("severity", "info")
        color = SEV_COLOR.get(sev, "#6b7280")
        cells = [
            f"<td>{kind}</td>",
            f'<td><span class="badge" style="background:{color}">{html.escape(sev)}</span></td>',
            f"<td>{html.escape(str(f.get('id', '')))}</td>",
            f"<td>{html.escape(str(f.get('signal') or f.get('vector', '')))}</td>",
            f"<td>{html.escape(str(f.get('confirmed', ''))) if kind=='RED' else html.escape(str(f.get('file','')))}</td>",
            f"<td>{html.escape((f.get('evidence') or f.get('match') or '')[:160])}</td>",
            f"<td>{_remediation_html(str(f.get('remediation', '')))}</td>",
        ]
        return "<tr>" + "".join(cells) + "</tr>"

    rows = "".join(row(f, "RED") for f in red_findings) + \
           "".join(row(f, "BLUE") for f in blue_findings)
    if not rows:
        rows = '<tr><td colspan="7">발견 없음 / no findings</td></tr>'

    blue_summary = (blue or {}).get("summary", {})
    css = """
    body{font-family:sans-serif;margin:18px;background:#fafafa;color:#222}
    h1{font-size:20px}h2{margin-top:22px;border-bottom:2px solid #333;padding-bottom:4px}
    table{border-collapse:collapse;width:100%;background:#fff;font-size:13px}
    th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top}
    th{background:#f3f4f6}
    .badge{color:#fff;border-radius:10px;padding:1px 7px;font-size:11px}
    .kpi{display:flex;gap:12px;margin:10px 0}
    .kpi div{background:#fff;border:1px solid #ddd;border-radius:6px;padding:8px 12px;font-size:13px}
    .ethics{background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:10px;margin:10px 0;font-size:13px}
    code{background:#eee;padding:1px 5px;border-radius:3px}
    """
    html_doc = f"""<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<title>Security Report - {html.escape(target_name)}</title><style>{css}</style></head><body>
<h1>🔒 보안 리포트 (Red/Blue 핸드오프) — {html.escape(target_name)}</h1>
<div class="ethics">🔴 RED = 익스플로잇 증명(owned/lab) · 🔵 BLUE = 정적 탐지 · 본 리포트는 blue-team 강화용.
배포용 크랙/keygen/DoS 도구 미포함 (윤리 가드레일).</div>
<div class="kpi">
 <div>BLUE 발견: <b>{len(blue_findings)}</b></div>
 <div>RED 확정: <b>{sum(1 for f in red_findings if f.get('confirmed'))}</b></div>
 <div>BLUE 요약: high={blue_summary.get('high',0)} med={blue_summary.get('med',0)} low={blue_summary.get('low',0)}</div>
</div>
<h2>Findings (RED + BLUE)</h2>
<table>
<tr><th>관점</th><th>심각도</th><th>벡터ID</th><th>신호/벡터</th><th>대상/파일</th><th>증거</th><th>완화</th></tr>
{rows}
</table>
<h2>완화 가이드 (D1-D6)</h2>
<ul>{''.join(f'<li>{_remediation_html(d)}</li>' for d in sorted(D_GUIDE))}</ul>
</body></html>"""
    out = evdir / "security_report.html"
    out.write_text(html_doc, encoding="utf-8")
    return out
```

- [ ] **Step 4: Run — verify pass**

Run: `harness/.venv/bin/python -m pytest tests/test_report_sec.py -v`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add harness/report_sec.py tests/test_report_sec.py
git commit -m "feat(report): unified red/blue security_report.html (Lane 0)"
```

---

### Task 7: CLI integration (sec-report command)

**Files:**
- Modify: `harness/main.py` (add subparser + handler)
- Test: `tests/test_report_sec.py` (append CLI smoke)

**Interfaces:**
- Produces: CLI `python harness/main.py sec-report <target>` → `evidence/<name>/security_report.html`.

- [ ] **Step 1: Append CLI test**

Append to `tests/test_report_sec.py`:
```python
def test_cmd_sec_report_writes_html(tmp_path, monkeypatch):
    import main as M
    name = "demo"
    ev = tmp_path / "evidence" / name
    ev.mkdir(parents=True)
    (ev / "vuln_subscription.out").write_text('{"findings":[],"summary":{}}', encoding="utf-8")
    monkeypatch.setattr(M, "ROOT", tmp_path)

    class A:
        target = name

    M.cmd_sec_report(A())
    assert (ev / "security_report.html").exists()
```

- [ ] **Step 2: Run — verify fail (cmd_sec_report not defined yet)**

Run: `harness/.venv/bin/python -m pytest tests/test_report_sec.py::test_cmd_sec_report_writes_html -v`
Expected: FAIL — `AttributeError: module 'main' has no attribute 'cmd_sec_report'`.

- [ ] **Step 3: Add subcommand to main.py**

In `harness/main.py`, add a handler after `cmd_report`:
```python
def cmd_sec_report(args):
    import report_sec
    name = Path(args.target).name
    evdir = ROOT / "evidence" / name
    if not (evdir / "vuln_subscription.out").exists() and not (evdir / "red_findings.json").exists():
        print(f"no BLUE/RED artifacts at {evdir}. run analyze + redteam first.")
        sys.exit(1)
    out = report_sec.render(name, evdir)
    print(f"security report -> {out}")
```

And in `main()`, after the `report` subparser block, add:
```python
    p_sec = sub.add_parser("sec-report", help="render red/blue security handoff report")
    p_sec.add_argument("target"); p_sec.set_defaults(func=cmd_sec_report)
```

- [ ] **Step 4: Run full suite + verify CLI**

Run: `harness/.venv/bin/python -m pytest tests/ -v`
Expected: PASS (all tests).

Then verify CLI wiring:
```bash
harness/.venv/bin/python harness/main.py --help
```
Expected: help lists `sec-report`.

- [ ] **Step 5: Commit**

```bash
git add harness/main.py tests/test_report_sec.py
git commit -m "feat(cli): add sec-report subcommand for red/blue handoff"
```

---

### Task 8: Lane 0 education document

**Files:**
- Create: `education/attacks/subscription/01_subscription_bypass.md`

(No test — documentation. Verify markdown renders + cross-references resolve.)

- [ ] **Step 1: Write the Lane 0 doc**

Create `education/attacks/subscription/01_subscription_bypass.md`:
```markdown
# Lane 0 — 구독/라이선스 우회 (Subscription Bypass)

DAF 타겟-직결 최우선 벡터. asar JS + 바이너리 + API + 토큰에 걸침.
듀얼 퍼스펙티브: 🔴 어떻게 뚫리는가 / 🔵 어떻게 막는가.

## 🔴 RED — 우회 전술

| ID | 전술 | 도구/스크립트 |
|----|------|--------------|
| S1 | 정적 패치 — `SUBSCRIPTION_STATUS` 체크 플립, asar JS `isSubscribed()→true` | (후속: binary patch PoC) |
| S2 | 런타임 패치 — frida로 구독체크 후킹 | (후속: frida script) |
| S3 | 로컬 상태 변조 — 캐시 구독상태 위조 | (후속: store tamper PoC) |
| S4 | 응답 스푸핑 — `/api/subscription/mock-set` 직접 타격 | `redteam/subscription/s4_mock_endpoint.py` ✅ |
| S5 | 토큰/세션 위조 — premium 토큰 탈취 (A3 결합) | (후속) |
| S6 | 클라이언트 피처게이트 우회 — 로컬 플래그 플립 | (후속) |
| S7 | 시간조작 — 트라이얼 만료 클락 회전 | (후속) |
| S8 | 다운그레이드/리플레이 — 구버전/유효 응답 재생 | (후속) |

**S4 실습 (owned lab)**:
```bash
# 1) 로컬 취약랩 실행 (education/labs/README.md)
docker run -d -p 8080:80 --name dvwa vulnerables/web-dvwa
# 2) PoC 실행 (mock 엔드포인트 존재 확인)
python education/redteam/subscription/s4_mock_endpoint.py http://127.0.0.1:8080 --i-own-this
# 3) 통합 리포트 생성
harness/.venv/bin/python harness/main.py sec-report <target>
```

## 🔵 BLUE — 탐지/완화

| ID | 방어 | 정적 탐지 |
|----|------|-----------|
| D1 | 서버 권위 체크 — 클라이언트 상태 신뢰 금지 | 클라이언트-only 검증 패턴 (t_vuln_subscription) |
| D2 | 클라이언트 강화 — 무결성 체크섬/난독화/안티태퍼 | 무결성 검증 부재 |
| D3 | 서명/암호화 상태 저장 | 평문 SUBSCRIPTION 저장 |
| D4 | TLS pinning + 응답 서명 | pinning/cert 검증 부재 |
| D5 | 디버그 엔드포인트 제거 — `/api/subscription/mock-set` 금지 | mock 엔드포인트 strings ✅ |
| D6 | 변조 감지 — asar/binary 수정시 거부, frida 감지 | 변조감지 루틴 부재 |

**BLUE 실행**:
```bash
harness/.venv/bin/python harness/main.py analyze targets/<your.zip> --strategy full
# → evidence/<t>/vuln_subscription.out
```

## 산출물 흐름
```
RED: s4_mock_endpoint.py ─┐
                          ├─→ run_redteam.py → red_findings.json ─┐
BLUE: t_vuln_subscription ─→ vuln_subscription.out ────────────────┤
                                                                    ▼
                                              report_sec.py → security_report.html
                                                                    (blue-team 핸드오프)
```

## 윤리
본 문서/PoC = 안티태퍼 평가(소프트웨어 보호). 본인 소유 앱·취약랩 대상.
배포용 크랙/keygen/범용패처·DoS 도구 미제공. 타인 시스템 공격 금지.
```

- [ ] **Step 2: Verify references resolve**

Run: `ls education/redteam/subscription/s4_mock_endpoint.py harness/report_sec.py harness/plugins/t_vuln_subscription.py`
Expected: all three paths exist (no "No such file").

- [ ] **Step 3: Commit**

```bash
git add education/attacks/subscription/01_subscription_bypass.md
git commit -m "docs(education): Lane 0 subscription bypass red/blue mapping"
```

---

### Task 9: Report document templates + generator (report_docs.py)

**Files:**
- Create: `education/reports/templates/red_team_plan.md`, `red_team_result.md`, `blue_team_plan.md`, `blue_team_result.md`
- Create: `harness/report_docs.py`
- Test: `tests/test_report_docs.py`

**Interfaces:**
- Produces: `render_engagement(engagement_dir, evidence_dir, target_name, date) -> dict[str,Path]` writing 4 docs. Also `build_red_result(red, meta)`, `build_blue_result(blue, meta)`, `fill_plan(kind, meta)`.
- Consumes: `red_findings.json` + `vuln_subscription.out` from an evidence dir (Tasks 4-6).

- [ ] **Step 1: Create the 4 templates (with `{{PLACEHOLDER}}` markers)**

`education/reports/templates/red_team_plan.md`:
```markdown
# Red Team 계획서 (Engagement Plan)

- **대상(Target)**: {{TARGET}}
- **일자(Date)**: {{DATE}}
- **범위(Scope)**: {{SCOPE}}
- **교전 규칙(RoE)**: {{ROE}}

## 테스트 벡터 (Lane 0 — S1-S8)
| ID | 전술 |
|----|------|
| S1 | 정적 패치 (구독체크 플립) |
| S2 | 런타임 패치 (frida 후킹) |
| S3 | 로컬 상태 변조 |
| S4 | mock 엔드포인트 응답 스푸핑 |
| S5 | 토큰/세션 위조 |
| S6 | 클라이언트 피처게이트 우회 |
| S7 | 시간조작 (트라이얼) |
| S8 | 다운그레이드/리플레이 |

## 방법론
1. 정적 분석(t_vuln_subscription)으로 우회 지점 식별
2. RED PoC(s4_mock_endpoint 등)로 익스플로잇 증명 (owned/lab)
3. 결과 → red_team_result.md + security_report.html

## 성공 기준
- 구독 상태를 클라이언트 단독으로 우회 가능함을 증명
- blue-team 핸드오프 리포트 산출

## 윤리
본인 소유 앱·취약랩 대상. 비파괴. 크랙/keygen/DoS 도구 미사용.
```

`education/reports/templates/red_team_result.md`:
```markdown
# Red Team 결과서 (Result)

- **대상**: {{TARGET}}
- **일자**: {{DATE}}

## Executive Summary
{{EXEC_SUMMARY}}

## Findings
{{FINDINGS_TABLE}}

## 권고사항 (→ Blue Team)
{{RECOMMENDATIONS}}

> 산출 근거: red_findings.json + security_report.html
```

`education/reports/templates/blue_team_plan.md`:
```markdown
# Blue Team 계획서 (Defense Plan)

- **대상**: {{TARGET}}
- **일자**: {{DATE}}

## 탐지 전략
- 정적 감지기(t_vuln_subscription)로 S1-S8 신호 탐지
- coverage manifest에 탐지/비탐지 투명 기록 (실패 숨기지 않음)

## 강화 로드맵 (D1-D6)
| ID | 조치 |
|----|------|
| D1 | 서버 권위 체크 (클라이언트 상태 신뢰 금지) |
| D2 | 클라이언트 강화 (무결성/난독화/안티태퍼) |
| D3 | 서명/암호화 상태 저장 |
| D4 | TLS pinning + 응답 서명 |
| D5 | 디버그 엔드포인트 제거 |
| D6 | 변조 감지 |

## 성공 기준
- 모든 클라이언트 우회 경로 서버 검증으로 폐쇄
```

`education/reports/templates/blue_team_result.md`:
```markdown
# Blue Team 결과서 (Result)

- **대상**: {{TARGET}}
- **일자**: {{DATE}}

## 탐지 현황
{{DETECTION_TABLE}}

## 강화 적용 상태
{{HARDENING_STATUS}}

## 잔여 리스크
{{RESIDUAL_RISK}}
```

- [ ] **Step 2: Write failing test**

Create `tests/test_report_docs.py`:
```python
import json


def test_render_engagement_fills_all_four(tmp_path):
    import report_docs as RD
    red = {"findings": [{"id": "S4", "vector": "mock abuse", "severity": "high",
                         "confirmed": True, "evidence": "HTTP 200 ok", "remediation": "D5"}]}
    blue = {"findings": [{"id": "S4", "signal": "mock_endpoint", "severity": "high",
                          "file": "a.js", "remediation": "D5"}], "summary": {"high": 1}}
    ev = tmp_path / "ev"; ev.mkdir()
    (ev / "red_findings.json").write_text(json.dumps(red), encoding="utf-8")
    (ev / "vuln_subscription.out").write_text(json.dumps(blue), encoding="utf-8")
    eng = tmp_path / "eng"
    out = RD.render_engagement(eng, ev, "demo", "2026-06-21")
    assert set(out.keys()) == {"red_plan", "red_result", "blue_plan", "blue_result"}
    rr = out["red_result"].read_text(encoding="utf-8")
    assert "mock abuse" in rr and "✅" in rr          # red finding + confirmed marker
    assert "D5" in rr                                   # recommendation mapped
    br = out["blue_result"].read_text(encoding="utf-8")
    assert "mock_endpoint" in br and "D5" in br and "필요" in br  # detection + hardening-needed


def test_render_engagement_handles_missing_artifacts(tmp_path):
    import report_docs as RD
    ev = tmp_path / "ev"; ev.mkdir()  # no artifacts
    eng = tmp_path / "eng"
    out = RD.render_engagement(eng, ev, "clean", "2026-06-21")
    rr = out["red_result"].read_text(encoding="utf-8")
    assert "확정된 익스플로잇 없음" in rr or "no red findings" in rr.lower()
```

- [ ] **Step 3: Run — verify fail**

Run: `harness/.venv/bin/python -m pytest tests/test_report_docs.py -v`
Expected: FAIL — `ModuleNotFoundError: No module named 'report_docs'`.

- [ ] **Step 4: Implement report_docs.py**

Create `harness/report_docs.py`:
```python
#!/usr/bin/env python3
"""Red/Blue engagement document generator.

Fills red_team_plan/result + blue_team_plan/result templates from the
technical artifacts (red_findings.json, vuln_subscription.out) to produce
formal assessment deliverables. Stdlib only — {{PLACEHOLDER}} substitution.
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = ROOT / "education" / "reports" / "templates"

_D = {  # remediation titles (shared with report_sec)
    "D1": "서버 권위 체크", "D2": "클라이언트 강화", "D3": "서명/암호화 상태 저장",
    "D4": "TLS pinning + 응답 서명", "D5": "디버그 엔드포인트 제거", "D6": "변조 감지",
}


def _sub(text: str, mapping: dict) -> str:
    for k, v in mapping.items():
        text = text.replace("{{" + k + "}}", str(v))
    return text


def _red_table(red: dict) -> str:
    rows = ["| ID | 벡터 | 심각도 | 확정 | 증거 |", "|---|---|---|---|---|"]
    for f in red.get("findings", []):
        rows.append("| {} | {} | {} | {} | {} |".format(
            f.get("id", ""), f.get("vector", ""), f.get("severity", ""),
            "✅" if f.get("confirmed") else "—",
            (f.get("evidence", "") or "")[:120].replace("|", "\\|")))
    return "\n".join(rows) if len(rows) > 2 else "| — | (no red findings) | | | |"


def _blue_table(blue: dict) -> str:
    rows = ["| ID | 신호 | 심각도 | 파일 | 완화 |", "|---|---|---|---|---|"]
    for f in blue.get("findings", []):
        rows.append("| {} | {} | {} | {} | {} |".format(
            f.get("id", ""), f.get("signal", ""), f.get("severity", ""),
            (f.get("file", "") or "")[:60].replace("|", "\\|"),
            f.get("remediation", "")))
    return "\n".join(rows) if len(rows) > 2 else "| — | (no blue findings) | | | |"


def _hardening_status(blue: dict) -> str:
    needed = {f.get("remediation", "") for f in blue.get("findings", []) if f.get("remediation", "") in _D}
    lines = []
    for did, title in sorted(_D.items()):
        status = "🔴 필요" if did in needed else "⚪ 해당/선택"
        lines.append(f"- **{did} {title}** — {status}")
    return "\n".join(lines)


def build_red_result(red: dict, meta: dict) -> str:
    tmpl = (TEMPLATES / "red_team_result.md").read_text(encoding="utf-8")
    findings = red.get("findings", [])
    confirmed = sum(1 for f in findings if f.get("confirmed"))
    summary = f"총 {len(findings)}건 중 {confirmed}건 익스플로잇 확정."
    recs = "\n".join(
        f"- **{f.get('remediation', '')}** ({_D.get(f.get('remediation', ''), '?')}): {f.get('vector', '')}"
        for f in findings if f.get("confirmed"))
    return _sub(tmpl, {
        "TARGET": meta["target"], "DATE": meta["date"],
        "EXEC_SUMMARY": summary, "FINDINGS_TABLE": _red_table(red),
        "RECOMMENDATIONS": recs or "- (확정된 익스플로잇 없음)",
    })


def build_blue_result(blue: dict, meta: dict) -> str:
    tmpl = (TEMPLATES / "blue_team_result.md").read_text(encoding="utf-8")
    findings = blue.get("findings", [])
    residual = "탐지된 취약 신호 미존재." if not findings else \
               f"{len(findings)}건 탐지 — 완화(D1-D6) 적용 전."
    return _sub(tmpl, {
        "TARGET": meta["target"], "DATE": meta["date"],
        "DETECTION_TABLE": _blue_table(blue),
        "HARDENING_STATUS": _hardening_status(blue),
        "RESIDUAL_RISK": residual,
    })


def fill_plan(kind: str, meta: dict) -> str:
    tmpl = (TEMPLATES / f"{kind}_plan.md").read_text(encoding="utf-8")
    return _sub(tmpl, {
        "TARGET": meta["target"], "DATE": meta["date"],
        "SCOPE": meta.get("scope", "본인 소유 앱 / 취약랩"),
        "ROE": meta.get("roe", "owned/lab only, non-destructive"),
    })


def render_engagement(engagement_dir, evidence_dir, target_name: str, date: str) -> dict:
    meta = {"target": target_name, "date": date}
    engagement_dir = Path(engagement_dir)
    engagement_dir.mkdir(parents=True, exist_ok=True)
    evidence_dir = Path(evidence_dir)
    red = {"findings": []}
    rp = evidence_dir / "red_findings.json"
    if rp.exists():
        red = json.loads(rp.read_text(encoding="utf-8"))
    blue = {"findings": []}
    bp = evidence_dir / "vuln_subscription.out"
    if bp.exists():
        blue = json.loads(bp.read_text(encoding="utf-8"))
    out = {}
    out["red_plan"] = engagement_dir / "red_team_plan.md"
    out["red_plan"].write_text(fill_plan("red_team", meta), encoding="utf-8")
    out["red_result"] = engagement_dir / "red_team_result.md"
    out["red_result"].write_text(build_red_result(red, meta), encoding="utf-8")
    out["blue_plan"] = engagement_dir / "blue_team_plan.md"
    out["blue_plan"].write_text(fill_plan("blue_team", meta), encoding="utf-8")
    out["blue_result"] = engagement_dir / "blue_team_result.md"
    out["blue_result"].write_text(build_blue_result(blue, meta), encoding="utf-8")
    return out
```

- [ ] **Step 5: Run — verify pass**

Run: `harness/.venv/bin/python -m pytest tests/test_report_docs.py -v`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add education/reports/templates/ harness/report_docs.py tests/test_report_docs.py
git commit -m "feat(report): red/blue 계획서+결과서 generator (report_docs)"
```

---

### Task 10: CLI engagement-report + sample engagement

**Files:**
- Modify: `harness/main.py` (add `engagement-report` subparser + handler)
- Test: `tests/test_report_docs.py` (append CLI test)

**Interfaces:**
- Produces: CLI `python harness/main.py engagement-report <target> [--date YYYY-MM-DD]` → `education/reports/engagements/<date>-<name>/{red,blue}_team_{plan,result}.md`.

- [ ] **Step 1: Append CLI test**

Append to `tests/test_report_docs.py`:
```python
def test_cmd_engagement_report_writes_four_docs(tmp_path, monkeypatch):
    import main as M
    name = "demo"
    ev = tmp_path / "evidence" / name
    ev.mkdir(parents=True)
    (ev / "red_findings.json").write_text('{"findings":[]}', encoding="utf-8")
    (ev / "vuln_subscription.out").write_text('{"findings":[]}', encoding="utf-8")
    monkeypatch.setattr(M, "ROOT", tmp_path)

    class A:
        target = name
        date = "2026-06-21"

    M.cmd_engagement_report(A())
    eng = tmp_path / "education" / "reports" / "engagements" / "2026-06-21-demo"
    for f in ("red_team_plan.md", "red_team_result.md", "blue_team_plan.md", "blue_team_result.md"):
        assert (eng / f).exists()
```

- [ ] **Step 2: Run — verify fail**

Run: `harness/.venv/bin/python -m pytest tests/test_report_docs.py::test_cmd_engagement_report_writes_four_docs -v`
Expected: FAIL — `AttributeError: module 'main' has no attribute 'cmd_engagement_report'`.

- [ ] **Step 3: Add handler + subparser to main.py**

In `harness/main.py`, add after `cmd_sec_report`:
```python
def cmd_engagement_report(args):
    import report_docs
    import datetime
    name = Path(args.target).name
    evdir = ROOT / "evidence" / name
    date = args.date or datetime.date.today().isoformat()
    eng = ROOT / "education" / "reports" / "engagements" / f"{date}-{name}"
    out = report_docs.render_engagement(eng, evdir, name, date)
    for k, p in out.items():
        print(f"{k} -> {p}")
```

In `main()`, after the `sec-report` subparser block, add:
```python
    p_eng = sub.add_parser("engagement-report", help="render red/blue 계획서+결과서")
    p_eng.add_argument("target")
    p_eng.add_argument("--date", default=None, help="YYYY-MM-DD (default: today)")
    p_eng.set_defaults(func=cmd_engagement_report)
```

- [ ] **Step 4: Run full suite + verify CLI**

Run: `harness/.venv/bin/python -m pytest tests/ -v`
Expected: PASS (all).

Run: `harness/.venv/bin/python harness/main.py --help`
Expected: help lists both `sec-report` and `engagement-report`.

- [ ] **Step 5: Commit**

```bash
git add harness/main.py tests/test_report_docs.py
git commit -m "feat(cli): engagement-report subcommand (red/blue 계획서+결과서)"
```

---

## Verification (whole plan)

After all 10 tasks:
- [ ] `harness/.venv/bin/python -m pytest tests/ -v --cov=harness --cov=education/redteam` → all PASS, coverage ≥ 80% on new modules.
- [ ] `harness/.venv/bin/python harness/main.py tool-check` → `vuln_subscription` listed, installStatus `present`.
- [ ] End-to-end on a real DAF zip (if available): `analyze` → `vuln_subscription.out`; `run_redteam.py` against owned endpoint → `red_findings.json`; `sec-report` → `security_report.html` with RED+BLUE findings.
- [ ] `engagement-report <target>` → `education/reports/engagements/<date>-<name>/` contains 4 filled docs (red/blue × 계획서/결과서); red 결과서 lists confirmed exploits, blue 결과서 lists detections + D1-D6 hardening status.

## Out of scope (follow-up plans)
- Lane 1 (Electron A1-A5), Lane 2 (Tauri TA1-TA9), Lane 3 (binary B1-B4) detectors + PoCs.
- Deep asar member-walk (current detector scans zip members + raw bytes; full asar header parse via `electron_detect.scan_asar` integration = follow-up).
- RED PoCs for S1/S2/S3/S5-S8 (only S4 implemented here).
- Tauri v1/v2 + latest CVE dual-perspective web-search verification (spec §8).
```
