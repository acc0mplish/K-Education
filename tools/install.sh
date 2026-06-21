#!/usr/bin/env bash
# K-Education system-tool installer (apt + wine). Needs sudo.
# Usage:
#   sudo bash tools/install.sh apt        # apt packages (incl. wine64)
#   bash   tools/install.sh pip           # venv python packages (no sudo)
#   bash   tools/install.sh npm           # node asar tooling (no sudo)
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
VENV="$ROOT/harness/.venv"

apt_pkgs=(
  yara
  binwalk
  libimage-exiftool-perl
  ssdeep
  gdb
  foremost
  innoextract
  p7zip-full
  radare2
  osslsigncode
  binutils
  bsdmainutils
)
# rizin/rabin2 intentionally excluded: the RizinOrg OBS repo on this host has an
# EXPIRED GPG key (EXPKEYSIG B8E403CB8BC7DC50) and 404s on rizin 0.8.0, which
# aborts the whole apt transaction. radare2 (r2) covers the same analysis.
# To install rizin later: fix the OBS repo key, or build from source.

install_apt() {
  echo ">> apt-get update + install (sudo)"
  apt-get update -y || echo "WARN: apt-get update had warnings (e.g. expired 3rd-party repo keys) — continuing"
  # install one-by-one so a single missing/broken package does not abort the rest
  local failed=()
  for pkg in "${apt_pkgs[@]}"; do
    if ! apt-get install -y --no-install-recommends "$pkg"; then
      echo "WARN: failed to install $pkg — recorded, continuing"
      failed+=("$pkg")
    fi
  done
  # wine: separate (may need its own repo on Debian/Ubuntu)
  if ! command -v wine64 >/dev/null 2>&1; then
    apt-get install -y --no-install-recommends wine64 \
      || echo "WARN: wine64 install failed — see WORKFLOW_PLAN.md §10"
  fi
  wine64 --version 2>/dev/null || true
  if [ "${#failed[@]}" -gt 0 ]; then
    echo ">> packages that failed: ${failed[*]}"
  fi
}

install_pip() {
  echo ">> pip into venv $VENV"
  "$VENV/bin/pip" install --upgrade pip
  # NOTE: python 'ssdeep' wrapper removed — use apt 'ssdeep' CLI instead (pkg_resources build fail)
  "$VENV/bin/pip" install pefile capstone yara-python lief angr unicorn frida-tools
  # optional heavier / manual
  "$VENV/bin/pip" install miasm flare-capa floss || echo "WARN: some optional pip packages failed (ok)"
}

install_npm() {
  echo ">> npm asar tooling"
  mkdir -p "$ROOT/harness/node_tools"
  (cd "$ROOT/harness/node_tools" && npm init -y >/dev/null 2>&1 || true
   npm install @electron/asar adm-zip)
}

case "${1:-all}" in
  apt)  install_apt ;;
  pip)  install_pip ;;
  npm)  install_npm ;;
  all)  install_pip; install_npm; echo ">> run 'sudo bash tools/install.sh apt' for system tools";;
  *)    echo "usage: install.sh [apt|pip|npm|all]"; exit 2 ;;
esac
echo ">> done: $1"
