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


def test_render_handles_compound_remediation(tmp_path):
    from report_sec import render
    (tmp_path / "vuln_subscription.out").write_text(json.dumps({
        "findings": [{"id": "S1/S6", "signal": "client_subscription_check", "severity": "med",
                      "match": "isSubscribed", "file": "a.js", "remediation": "D1/D2"}],
        "summary": {"high": 0, "med": 1, "low": 0}}), encoding="utf-8")
    html = render("demo", tmp_path).read_text(encoding="utf-8")
    # both D1 and D2 titles/guides rendered (split on /)
    assert "D1" in html and "D2" in html
    assert "서버 권위 체크" in html      # D1 title from D_GUIDE
    assert "클라이언트 강화" in html     # D2 title from D_GUIDE


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
