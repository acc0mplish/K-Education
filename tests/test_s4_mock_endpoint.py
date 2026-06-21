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
