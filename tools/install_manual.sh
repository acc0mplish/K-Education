#!/usr/bin/env bash
# Manual downloads for heavy/standalone tools (report §6.3).
# These are large. Run on a machine with internet. No sudo required if DLDIR is writable.
# Usage: bash tools/install_manual.sh [ghidra|retdec|diec|capa_rules|all]
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
DLDIR="$ROOT/tools/downloads"
mkdir -p "$DLDIR"

# Edit these versions as needed. Pinned for reproducibility.
GHIDRA_VER="${GHIDRA_VER:-11.3.2}"
GHIDRA_DATE="${GHIDRA_DATE:-20250715}"
RETDEC_VER="${RETDEC_VER:-0.6.0}"

dl_ghidra() {
  local url="https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_${GHIDRA_VER}_build/ghidra_${GHIDRA_VER}_PUBLIC_${GHIDRA_DATE}.zip"
  echo ">> ghidra $GHIDRA_VER -> $DLDIR/ghidra.zip"
  curl -fSL -o "$DLDIR/ghidra.zip" "$url" || { echo "FAIL ghidra download"; return 1; }
  (cd "$DLDIR" && unzip -q -o ghidra.zip && ln -sfn ghidra_${GHIDRA_VER}_PUBLIC ghidra)
  echo ">> ghidra headless: $DLDIR/ghidra/support/analyzeHeadless"
}

dl_retdec() {
  local url="https://github.com/avast/retdec/releases/download/v${RETDEC_VER}/RetDec-v${RETDEC_VER}-Linux-Release.tar.xz"
  echo ">> retdec $RETDEC_VER -> $DLDIR/retdec.tar.xz"
  curl -fSL -o "$DLDIR/retdec.tar.xz" "$url" || { echo "FAIL retdec download"; return 1; }
  (cd "$DLDIR" && tar xf retdec.tar.xz && ln -sfn RetDec-v${RETDEC_VER}-Linux-Release retdec)
  echo ">> retdec: $DLDIR/retdec/bin/retdec-decompiler"
}

dl_diec() {
  echo ">> Detect It Easy (diec) -> $DLDIR/die"
  # DIE ships Linux release builds on github
  curl -fSL "https://github.com/horsicq/Detect-It-Easy/releases/download/v3.10/die_3.10_Linux_x86_64.tar.gz" \
       -o "$DLDIR/die.tar.gz" || { echo "FAIL diec download (check latest release tag)"; return 1; }
  (cd "$DLDIR" && mkdir -p die && tar xzf die.tar.gz -C die)
}

dl_capa_rules() {
  echo ">> capa rules -> $DLDIR/capa/rules"
  mkdir -p "$DLDIR/capa"
  if [ -d "$DLDIR/capa/rules/.git" ]; then
    git -C "$DLDIR/capa/rules" pull
  else
    git clone --depth 1 https://github.com/mandiant/capa-rules "$DLDIR/capa/rules" \
      || echo "FAIL capa-rules clone"
  fi
}

case "${1:-all}" in
  ghidra)     dl_ghidra ;;
  retdec)     dl_retdec ;;
  diec)       dl_diec ;;
  capa_rules) dl_capa_rules ;;
  all)        dl_ghidra; dl_diec; dl_capa_rules; echo ">> retdec: run 'bash tools/install_manual.sh retdec' (large)";;
  *)          echo "usage: install_manual.sh [ghidra|retdec|diec|capa_rules|all]"; exit 2 ;;
esac
echo ">> done: $1"
