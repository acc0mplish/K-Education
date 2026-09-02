#!/usr/bin/env python3
"""S6/S4 — rogue local backend bypass demonstration (owned target).

DAF Launcher reads subscription entitlement from GET /api/me on
DEFAULT_API_BASE = http://127.0.0.1:8787 (plain HTTP, no TLS/pinning on
localhost). By standing up a rogue server on 8787 that returns a premium
subscription, the UNMODIFIED launcher grants early_access — no app patching,
no real account. This proves the entitlement is client/backend-trusted, not
cryptographically bound to a verified server.

Owned/lab target only. Educational anti-tamper assessment.
"""
from __future__ import annotations
import argparse, json, sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PREMIUM_ME = {
    "id": "redteam-bypass", "email": "bypass@owned.lab",
    "subscription": {"plan": "early_access", "status": "active",
                     "expiresAt": "2099-12-31T00:00:00Z"},
    "programs": [],
}

ROUTES_POST = {"/api/subscription/mock-set", "/api/auth/login", "/api/remote/devices/register"}


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body):
        b = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path.startswith("/api/me"):
            return self._send(200, PREMIUM_ME)
        if self.path.startswith("/api/programs"):
            return self._send(200, [])
        if self.path.startswith("/api/launcher/release"):
            return self._send(200, {"version": "0.2.36", "skipUpdate": True})
        return self._send(200, {"ok": True, "path": self.path})

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        _body = self.rfile.read(length) if length else b""
        if self.path in ROUTES_POST:
            return self._send(200, {"ok": True, "applied": json.loads(_body or b"{}")})
        return self._send(200, {"ok": True, "path": self.path})

    def log_message(self, fmt, *a):
        sys.stderr.write(f"[mock] {self.address_string()} {self.command} {self.path}\n")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Rogue DAF backend bypass demo (owned/lab)")
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8787)
    ap.add_argument("--i-own-this", action="store_true",
                    help="assert this runs against an owned target on localhost")
    args = ap.parse_args(argv)
    if args.host not in ("127.0.0.1", "localhost", "0.0.0.0", "::1") and not args.i_own_this:
        print("refused: bind to localhost or pass --i-own-this", file=sys.stderr)
        return 2
    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"[mock] rogue DAF backend on http://{args.host}:{args.port} "
          f"(GET /api/me -> early_access). Ctrl-C to stop.", file=sys.stderr)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
