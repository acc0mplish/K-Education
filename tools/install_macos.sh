#!/usr/bin/env bash
# macOS installer for the RE harness (§16.a CLI port).
# Run ON a Mac (not WSL). Xcode Command Line Tools provide otool/lipo/nm/dwarfdump/
# codesign/xattr/strings/file/shasum/hexdump/lldb.
#
#   bash tools/install_macos.sh clt    # Xcode CLT (system tools) — requires sudo
#   bash tools/install_macos.sh brew   # brew packages (no sudo)
#   bash tools/install_macos.sh pip    # venv python packages (no sudo)
#   bash tools/install_macos.sh npm    # node asar tooling (no sudo)
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
VENV="$ROOT/harness/.venv"

brew_pkgs=(yara binwalk exiftool ssdeep radare2 rizin osslsigncode p7zip foremost innoextract binutils dependency-check)

install_clt() {
  echo ">> Xcode Command Line Tools (otool/lipo/nm/dwarfdump/codesign/xattr/lldb)"
  xcode-select -p >/dev/null 2>&1 || xcode-select --install
}

install_brew() {
  if ! command -v brew >/dev/null 2>&1; then
    echo ">> installing Homebrew"; /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
  echo ">> brew install ${brew_pkgs[*]}"
  brew install "${brew_pkgs[@]}" || echo "WARN: some brew packages failed"
}

install_pip() {
  echo ">> venv $VENV"
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install --upgrade pip
  "$VENV/bin/pip" install pefile capstone yara-python lief angr unicorn frida-tools
  "$VENV/bin/pip" install flare-capa floss miasm || echo "WARN: some optional pip packages failed"
}

install_npm() {
  mkdir -p "$ROOT/harness/node_tools"
  (cd "$ROOT/harness/node_tools" && npm init -y >/dev/null 2>&1 || true
   npm install @electron/asar adm-zip)
  # §17 red-team: frontend deobfuscators (wakaru = Rust bundle unpacker; webcrack = deobfuscator)
  (cd "$ROOT/harness/node_tools" && npm install @wakaru/cli webcrack) \
    || echo "WARN: red-team frontend-deobf npm packages failed (ok)"
}

case "${1:-all}" in
  clt)  install_clt ;;
  brew) install_brew ;;
  pip)  install_pip ;;
  npm)  install_npm ;;
  all)  install_clt; install_brew; install_pip; install_npm ;;
  *)    echo "usage: install_macos.sh [clt|brew|pip|npm|all]"; exit 2 ;;
esac
echo ">> done: $1"
echo ">> macOS catalog auto-selected on Darwin (tool_catalog.macos.json)"
echo ">> ghidra/retdec/diec: download manually (install_manual.sh works on mac too)"
