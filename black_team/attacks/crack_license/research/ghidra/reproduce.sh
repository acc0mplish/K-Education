#!/usr/bin/env bash
# reproduce — Seafile Pro 13.0.27 seaf-server 정적 분석 (Ghidra analyzeHeadless)
# 🎓 교육용 · 본인 소유/취약랩 대상. 배포용 크랙 아님.
#
# 사용:
#   ./reproduce.sh <seaf-server-ELF> [ghidra_home]
# 예:
#   ./reproduce.sh /path/to/seafile-pro-server_13.0.27_x86-64/.../seaf-server
#
# 산출물: ghidra_proj/<proj>/  (프로젝트 DB, 로컬에만 남음)
set -euo pipefail

GHIDRA="${2:-/opt/homebrew/opt/ghidra/libexec}"
PL="$PWD/ghidra_proj"
PROJ="${PROJ:-SeaRPC}"
BIN="${1:?usage: reproduce.sh <seaf-server-ELF> [ghidra_home]}"

if [ ! -f "$BIN" ]; then echo "no such ELF: $BIN"; exit 1; fi
cd "$(dirname "$0")"

GHIDRA_INSTALL_DIR="$GHIDRA" "$GHIDRA/support/analyzeHeadless" "$PL" "$PROJ" \
  -import "$BIN" \
  -scriptPath "$PWD" -postScript "${SCRIPT:-FullTraceProbe}"
