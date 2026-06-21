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
