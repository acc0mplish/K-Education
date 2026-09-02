#!/usr/bin/env bash
# reproduce_fastfind — FastFind.exe (Rust/Tauri) 정적 분석 + 디컴파일 (Ghidra analyzeHeadless)
# 🎓 교육용 · 본인 소유/취약랩 대상. 상용 소프트웨어 무면허 배포용이 아님.
#
# 사용:
#   ./reproduce_fastfind.sh <FastFind.exe> [ghidra_home]
# 예:
#   ./reproduce_fastfind.sh /path/to/FastFind.exe /opt/homebrew/opt/ghidra/libexec
#
# 산출물 (로컬에만 남음):
#   ghidra_proj/<proj>/fastfind_recovered.txt   — decompiled C + 소스 위치
#   ghidra_proj/<proj>/symbols.txt              — index: demangled_name addr file line
#
# 요구사항:
#   - macOS(ARM64) native decompiler 가 반드시 빌드돼 있어야 함
#     (build_natives_macos.sh 로 빌드). 미빌드 시 "Decompiler unavailable"로 실패.
set -euo pipefail

GHIDRA="${2:-}"
# 기본: homebrew openjdk@21 + Ghidra 경로 (없으면 오류)
if [ -z "$GHIDRA" ]; then
  if [ -d /opt/homebrew/opt/ghidra/libexec ]; then GHIDRA=/opt/homebrew/opt/ghidra/libexec; fi
  if [ -z "$GHIDRA" ] && [ -d /usr/local/opt/ghidra/libexec ]; then GHIDRA=/usr/local/opt/ghidra/libexec; fi
fi
PL="$PWD/ghidra_proj"
PROJ="${PROJ:-FastFind}"
BIN="${1:?usage: reproduce_fastfind.sh <FastFind.exe> [ghidra_home]}"

if [ ! -f "$BIN" ]; then echo "no such exe: $BIN"; exit 1; fi
[ -n "$GHIDRA" ] || { echo "GHIDRA not found. pass <ghidra_home> (e.g. /opt/homebrew/opt/ghidra/libexec)"; exit 1; }
mkdir -p "$PL"
cd "$(dirname "$0")"

export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@21}"
export GHIDRA_INSTALL_DIR="$GHIDRA"

# -import 은 한 번만 유효 (동일 바이너리 re-import 시 "conflicting program file" 실패).
# → 재분석/새 프롭은 항상 새 프로젝트 이름으로 -import. (이 Ghidra 버전은 -process 미지원)
#
# ⚠️ -noanalysis 필수:
#   이 Ghidra 12.1.x_public 에서 switch-decompiler 분석(Import 중)이 native
#   decompiler process를 dispose/재시작해서, postScript의 DecompInterface가
#   native process를 launch하지 못함 -> getC()가 null (decompiled=0).
#   -noanalysis 로 switch decompiler를 우회하면 postScript에서 native decompiler가
#   계속 ready 상태를 유지해 정상 디컴파일이 됨.
GHIDRA_INSTALL_DIR="$GHIDRA" "$GHIDRA/support/analyzeHeadless" "$PL" "$PROJ" \
  -noanalysis -import "$BIN" \
  -scriptPath "$PWD" -postScript "FastFindDecompile.java"
