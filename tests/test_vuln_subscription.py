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
