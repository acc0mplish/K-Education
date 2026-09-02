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
