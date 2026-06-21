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
    if not rid:
        return ""
    parts = []
    for comp in rid.split("/"):
        title, guide = D_GUIDE.get(comp, (comp, ""))
        parts.append(f"<b>{html.escape(comp)}</b> {html.escape(title)} — {html.escape(guide)}")
    return "; ".join(parts)


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
