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


def test_hardening_status_splits_compound(tmp_path):
    import report_docs as RD
    blue = {"findings": [{"id": "S1/S6", "signal": "client_subscription_check",
                          "severity": "med", "file": "a.js", "remediation": "D1/D2"}],
            "summary": {"high": 0, "med": 1, "low": 0}}
    ev = tmp_path / "ev"; ev.mkdir()
    (ev / "vuln_subscription.out").write_text(json.dumps(blue), encoding="utf-8")
    out = RD.render_engagement(tmp_path / "eng", ev, "demo", "2026-06-21")
    br = out["blue_result"].read_text(encoding="utf-8")
    # both D1 and D2 marked as needed (필요) — split on /
    d1_line = [l for l in br.splitlines() if l.startswith("- **D1")][0]
    d2_line = [l for l in br.splitlines() if l.startswith("- **D2")][0]
    assert "필요" in d1_line and "필요" in d2_line


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
