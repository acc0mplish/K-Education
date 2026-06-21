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
