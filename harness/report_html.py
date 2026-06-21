#!/usr/bin/env python3
"""Interactive HTML coverage report (report §14.3 #5 + #7).

Reads evidence/<target>/coverage.json + per-tool .out and emits a
self-contained HTML dashboard:
  - coverage booleans (canClaimFullCoverage vs AllSucceeded)
  - collapsible tool checklist grouped by tier, color-coded status badges
  - collapsible per-tool evidence snippets
  - fixed 5 sections: 분석결론 / 앱개선 backlog / 보안리스크 / 재현명령 / 한계
"""
from __future__ import annotations
import json, html, os, re
from pathlib import Path
from collections import Counter, defaultdict

ROOT = Path(__file__).resolve().parent.parent

STATUS_COLOR = {
    "executed": "#16a34a", "target_not_applicable": "#9ca3af",
    "execution_failed": "#dc2626", "timeout_deferred_retry": "#ea580c",
    "install_failed": "#ca8a04", "manual_install": "#7c3aed",
    "bridge_unavailable": "#4b5563", "skipped": "#d1d5db",
}


def load_evidence(evdir: Path):
    cov = json.loads((evdir / "coverage.json").read_text(encoding="utf-8"))
    outs = {}
    for f in evdir.glob("*.out"):
        try:
            outs[f.stem] = f.read_text(encoding="utf-8", errors="replace")
        except OSError:
            pass
    return cov, outs


def risk_findings(cov, outs):
    """Scan electron_business / yara / codebase_audit outputs for risk signals."""
    risks = []
    eb = outs.get("electron_business", "")
    # DAF env exposure (token via process env)
    if "DAF_API_TOKEN" in eb or "API_TOKEN" in eb:
        risks.append(("[Med] 자격증명 환경변수 노출", "DAF_API_TOKEN 등이 자식 프로세스 환경변수로 전달 — 동일 사용자 권한 로컬 프로세스가 읽으면 토큰 유출 (report §12.6)"))
    if re.search(r"remote/devices/heartbeat|remote/commands/update|deviceSecret|enableRemote", eb):
        risks.append(("[Med] 광범위 원격 관리", "기기 등록/5s heartbeat/원격 명령/사진 업로드 — deviceSecret 유출 시 원격 제어 위험 (report §7)"))
    if re.search(r"ExecutionPolicy\s+Bypass|powershell|NoProfile|wscript\.shell", eb, re.I):
        risks.append(("[Med] 자동업데이트 PowerShell/VBS 숨김 실행", "서버 탈취 시 악성 업데이트 전파 가능 (sha256 검증은 있으나 서버가 매니페스트 제어, report §6)"))
    if re.search(r"\beval\s*\(|new\s+Function", eb):
        risks.append(("[Low] eval/Function 동적 실행", "입력 검증 미흡 시 코드 주입 가능"))
    yara = outs.get("yara", "")
    if "matchCount" in yara and re.search(r'"matchCount":\s*[1-9]', yara):
        risks.append(("[High] YARA 지표 매칭", "yara.out의 matchCount > 0 — 즉시 확인"))
    return risks


def render(target_name: str, evdir: Path) -> Path:
    cov, outs = load_evidence(evdir)
    meta = cov["meta"]["target"]
    rows = cov["rows"]
    by_status = Counter(r["executionStatus"] for r in rows)
    by_tier = defaultdict(list)
    for r in rows:
        by_tier[r["tier"]].append(r)

    def badge(status):
        c = STATUS_COLOR.get(status, "#6b7280")
        return f'<span class="badge" style="background:{c}">{html.escape(status)}</span>'

    # tool checklist (collapsible per tier)
    checklist = []
    for tier in sorted(by_tier):
        checklist.append(f'<details class="tier" open><summary>Tier {tier} ({len(by_tier[tier])})</summary>')
        for r in sorted(by_tier[tier], key=lambda x: x["toolID"]):
            ev = outs.get(r["toolID"], "")
            snip = html.escape(ev[:600]) if ev else ""
            has_ev = "evlink" if snip else ""
            checklist.append(
                f'<details class="tool {has_ev}"><summary>{html.escape(r["toolID"])} '
                f'{badge(r["executionStatus"])} <span class="dur">{r.get("durationS","")}s</span>'
                f'<span class="msg">{html.escape((r.get("message") or "")[:90])}</span></summary>'
                f'<pre class="ev">{snip}</pre></details>')
        checklist.append('</details>')
    checklist_html = "".join(checklist)

    # fixed 5 sections
    risks = risk_findings(cov, outs)
    risk_html = "".join(f"<li><b>{html.escape(t)}</b><br>{html.escape(d)}</li>" for t, d in risks) or "<li>자동 감지된 고위험 신호 없음</li>"
    eb_head = ""
    if "electron_business" in outs:
        try:
            eb = json.loads(outs["electron_business"])
            eb_head = eb.get("headline", {})
        except json.JSONDecodeError:
            pass

    conclusion = (
        f"타겟: <code>{html.escape(meta['path'])}</code> (profile={meta['profile']}, {meta['size']}B)<br>"
        f"coverage: 전체사용={cov['canClaimFullCoverage']} / 전체성공={cov['canClaimAllToolsSucceeded']}<br>"
        f"executed={cov['executedCount']} notApplicable={cov['notApplicableCount']} "
        f"failed={cov['failedCount']} timeout={cov['timeoutCount']}<br>"
        + (f"Electron 레인 헤드라인: {html.escape(json.dumps(eb_head, ensure_ascii=False))}" if eb_head else "")
    )
    backlog_items = []
    if cov.get("timeoutToolIDs"):
        backlog_items.append("timeout 도구 probe-first → artifact-only fallback 재시도: " + ", ".join(cov["timeoutToolIDs"]))
    if cov.get("failedToolIDs"):
        backlog_items.append("실패 도구 원인 분석/수정: " + ", ".join(cov["failedToolIDs"]))
    backlog_items += [
        "lief PE/ELF/Mach-O path 분리 유지 (#1)",
        "capa rules 경로 고정·검증 (#2)",
        "retdec probe-first + 함수단위 디컴파일 (#3)",
        "Windows dynamic runner executor 분리 (#4)",
    ]
    backlog_html = "".join(f"<li>{html.escape(x)}</li>" for x in backlog_items)
    repro = (
        f"<code>harness/.venv/bin/python harness/main.py analyze {html.escape(meta['path'])} --strategy full</code><br>"
        f"<code>harness/.venv/bin/python harness/main.py coverage {html.escape(meta['path'])}</code><br>"
        f"증거 디렉토리: <code>evidence/{html.escape(target_name)}/</code>"
    )
    limits = "".join(f"<li>{html.escape(x)}</li>" for x in [
        f"install_failed/manual 도구는 coverage에 종결 상태로 기록 (숨기지 않음)",
        f"target_not_applicable {cov['notApplicableCount']}건은 profile 불일치 (정상)",
        f"osslsigncode 체인 검증 실패 시 파일 변조 탐지는 가능하나 공개 신뢰체인 검증은 호스트 CA 의존",
        f"동적 분석(heartbeat/updater 실동작)은 Wine/Windows executor 필요",
    ])

    css = """
body{font-family:sans-serif;margin:18px;background:#fafafa;color:#222}
h1{font-size:20px}h2{margin-top:26px;border-bottom:2px solid #333;padding-bottom:4px}
.kpi{display:flex;gap:12px;flex-wrap:wrap;margin:10px 0}
.kpi div{background:#fff;border:1px solid #ddd;border-radius:6px;padding:8px 12px;font-size:13px}
.bool{font-weight:bold}.t{color:#16a34a}.f{color:#dc2626}
details{margin:4px 0}
summary{cursor:pointer;padding:4px 0;font-size:14px}
.tier>summary{font-weight:bold;font-size:15px;margin-top:10px}
.tool>summary{padding-left:16px}
.badge{color:#fff;border-radius:10px;padding:1px 8px;font-size:11px;margin-left:6px}
.dur{color:#888;font-size:11px;margin-left:8px}
.msg{color:#555;font-size:11px;margin-left:8px}
pre.ev{background:#1e1e1e;color:#eee;padding:8px;border-radius:4px;font-size:11px;max-height:240px;overflow:auto;white-space:pre-wrap}
ul{line-height:1.7}code{background:#eee;padding:1px 5px;border-radius:3px}
.section{background:#fff;border:1px solid #ddd;border-radius:6px;padding:12px 16px;margin:10px 0}
"""
    js = """
document.querySelectorAll('.tool').forEach(d=>{if(!d.classList.contains('evlink'))d.querySelector('summary').style.listStyle='none';});
"""

    html_doc = f"""<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<title>RE Report - {html.escape(target_name)}</title><style>{css}</style></head><body>
<h1>역공학 리포트 — {html.escape(target_name)}</h1>
<div class="kpi">
 <div>전체사용: <b class="{'t' if cov['canClaimFullCoverage'] else 'f'}">{cov['canClaimFullCoverage']}</b></div>
 <div>전체성공: <b class="{'t' if cov['canClaimAllToolsSucceeded'] else 'f'}">{cov['canClaimAllToolsSucceeded']}</b></div>
 <div>executed: {cov['executedCount']}</div>
 <div>notApplicable: {cov['notApplicableCount']}</div>
 <div>failed: {cov['failedCount']}</div>
 <div>timeout: {cov['timeoutCount']}</div>
</div>

<h2>📑 도구 목차 체크리스트</h2>
{checklist_html}

<h2>분석 결론</h2><div class="section">{conclusion}</div>
<h2>앱 개선 backlog</h2><div class="section"><ul>{backlog_html}</ul></div>
<h2>🔒 보안 리스크</h2><div class="section"><ul>{risk_html}</ul></div>
<h2>재현 명령</h2><div class="section">{repro}</div>
<h2>한계</h2><div class="section"><ul>{limits}</ul></div>
<script>{js}</script>
</body></html>"""
    out = evdir / "report.html"
    out.write_text(html_doc, encoding="utf-8")
    return out
