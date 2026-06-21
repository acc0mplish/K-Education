#!/usr/bin/env bash
# Public API probe (report §5). Educational/observational — GET only, no auth.
# Usage: bash scripts/api_probe.sh [https://host]
# Output: JSON-ish responses per endpoint -> stdout; evidence saved by caller.
set -u
BASE="${1:-https://daehanaifactory.com}"
OUT="${OUTDIR:-./evidence/api_probe}"
mkdir -p "$OUT"

echo "=== api_probe base=$BASE ==="
endpoints=(
  "/api/runtime"
  "/api/notices"
  "/api/programs"
  "/api/launcher/release"
)
for ep in "${endpoints[@]}"; do
  echo "--- GET $ep ---"
  curl -sS -m 20 -H "X-DAF-Client: launcher" \
       -w "\n[http_code=%{http_code} time=%{time_total}s size=%{size_download}B]\n" \
       "$BASE$ep" | tee "$OUT/$(echo "$ep" | tr '/' '_').json"
  echo
done
echo "=== api_probe done -> $OUT ==="
