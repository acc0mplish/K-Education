#!/usr/bin/env bash
# K-Education system-tool installer (apt + wine). Needs sudo.
# Usage:
#   sudo bash tools/install.sh apt        # apt packages (incl. wine64 + §17 red-team apt tools)
#   bash   tools/install.sh pip           # venv python packages (no sudo, incl. §17 bandit/semgrep/pip-audit/volatility3)
#   bash   tools/install.sh npm           # node asar tooling (no sudo, incl. §17 retire.js + wakaru + webcrack)
#   sudo bash tools/install.sh redteam    # §17 Go-binary tools from GitHub releases (nuclei/httpx/ffuf/gitleaks/trivy/grype)
#   bash   tools/install.sh depcheck      # §17 OWASP Dependency-Check tarball (JVM SCA; needs JDK from apt case)
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
# §17 red-team lane: system-packaged scanners / forensics / offline crackers.
# (sourced from yogsec/Hacking-Tools triage — active scanners run on AUTHORIZED
#  targets only; password crackers are OFFLINE against extracted hashes.)
apt_pkgs_redteam=(
  nmap
  nikto
  sqlmap
  john
  hashcat
  bulk-extractor
  whatweb
  gobuster
  default-jre
)
# Go-binary red-team tools pulled from GitHub releases (latest, linux amd64/arm64).
# slug=binary — see install_redteam_go below.
go_redteam_tools=(
  "projectdiscovery/nuclei=nuclei"
  "projectdiscovery/httpx=httpx"
  "ffuf/ffuf=ffuf"
  "gitleaks/gitleaks=gitleaks"
  "aquasecurity/trivy=trivy"
  "anchore/grype=grype"
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
  # §17 red-team apt tools (continue-on-fail, same as core)
  for pkg in "${apt_pkgs_redteam[@]}"; do
    if ! apt-get install -y --no-install-recommends "$pkg"; then
      echo "WARN: failed to install red-team pkg $pkg — recorded, continuing"
      failed+=("$pkg")
    fi
  done
  # gobuster wordlist: install dirb wordlists if missing (gobuster args reference it)
  [ -f /usr/share/wordlists/dirb/common.txt ] || apt-get install -y --no-install-recommends dirb >/dev/null 2>&1 || true
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
  # §17 red-team static-audit / forensics pip tools (CLIs land in venv/bin)
  "$VENV/bin/pip" install bandit semgrep pip-audit volatility3 \
    || echo "WARN: some red-team pip packages failed (ok — install individually)"
}

install_npm() {
  echo ">> npm asar tooling"
  mkdir -p "$ROOT/harness/node_tools"
  (cd "$ROOT/harness/node_tools" && npm init -y >/dev/null 2>&1 || true
   npm install @electron/asar adm-zip)
  # §17 red-team: retire.js CLI (known-vuln JS libs) + frontend deobfuscators
  #   retire.js       — known-vuln JS library detection
  #   @wakaru/cli     — webpack/esbuild/browserify bundle unpacker (Rust)
  #   webcrack        — obfuscator.io/webpack deobfuscator + unminifier
  (cd "$ROOT/harness/node_tools" && npm install retire @wakaru/cli webcrack) \
    || echo "WARN: some red-team npm packages failed (ok)"
}

# §17 red-team: download single-binary Go tools from GitHub releases.
# Resolves latest tag, picks the linux amd64/arm64 asset, extracts it.
# Needs write access to BINDIR (defaults to /usr/local/bin — run apt case as root).
install_redteam_go() {
  local bindir="${REDTEAM_BINDIR:-/usr/local/bin}"
  mkdir -p "$bindir" 2>/dev/null || { echo "ERR: cannot write $bindir (run as root or set REDTEAM_BINDIR=~/.local/bin)"; return 1; }
  local arch os
  case "$(uname -m)" in x86_64) arch=amd64;; aarch64|arm64) arch=arm64;; *) arch=amd64;; esac
  os="linux"
  command -v curl >/dev/null 2>&1 || { echo "ERR: curl required for red-team Go downloads"; return 1; }
  local failed=()
  for entry in "${go_redteam_tools[@]}"; do
    local slug="${entry%=*}" bin="${entry#*=}"
    local tag asset url
    tag="$(curl -fsSL "https://api.github.com/repos/$slug/releases/latest" 2>/dev/null \
           | grep -m1 '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')"
    [ -n "$tag" ] || { echo "WARN: $slug — could not resolve latest tag"; failed+=("$bin"); continue; }
    # pick asset: must contain both 'linux' and the arch token
    asset="$(curl -fsSL "https://api.github.com/repos/$slug/releases/latest" 2>/dev/null \
             | grep '"browser_download_url"' | grep -iE "linux.*$arch|$arch.*linux" \
             | grep -oE 'https://[^"]+' | head -1)"
    [ -n "$asset" ] || { echo "WARN: $slug ($tag) — no linux $arch asset found"; failed+=("$bin"); continue; }
    local tmp; tmp="$(mktemp -d)"
    echo ">> $bin: $slug $tag -> $bindir/$bin"
    if curl -fsSL "$asset" -o "$tmp/dl"; then
      # most ship .tar.gz; a few ship a raw stripped binary. try tar first, else treat as raw.
      if tar -C "$tmp" -xzf "$tmp/dl" 2>/dev/null; then
        install -m 0755 "$(find "$tmp" -type f -name "$bin" -o -type f -name "${bin}_"\* | head -1)" "$bindir/$bin" \
          || cp "$(find "$tmp" -type f | head -1)" "$bindir/$bin"
      else
        install -m 0755 "$tmp/dl" "$bindir/$bin"
      fi
    else
      echo "WARN: $bin download failed"; failed+=("$bin")
    fi
    rm -rf "$tmp"
  done
  if [ "${#failed[@]}" -gt 0 ]; then
    echo ">> red-team Go tools that failed: ${failed[*]}"
  fi
}

# §17 red-team: OWASP Dependency-Check (Java SCA, complements retirejs for
# Maven/Gradle/JAR). Not a single Go binary — download the release tarball,
# extract under redteam_tools/, symlink the .sh launcher into BINDIR.
# Requires JDK (default-jre in apt_pkgs_redteam). First run downloads the NVD
# CVE cache (~hundreds of MB; slow on cold start).
install_redteam_depcheck() {
  local bindir="${REDTEAM_BINDIR:-/usr/local/bin}"
  local dest="$ROOT/harness/redteam_tools"
  mkdir -p "$dest" "$bindir" 2>/dev/null || { echo "ERR: cannot write $dest/$bindir (run as root or set REDTEAM_BINDIR)"; return 1; }
  command -v curl >/dev/null 2>&1 || { echo "ERR: curl required for dependency-check download"; return 1; }
  command -v unzip >/dev/null 2>&1 || { echo "ERR: unzip required for dependency-check"; return 1; }
  local slug="dependency-check/DependencyCheck"
  # resolve latest tag via the /releases/latest redirect (NOT the api.github.com
  # JSON endpoint — that 403s under GitHub's 60/hr unauthenticated rate limit).
  local redir tag ver
  redir="$(curl -fsSL -o /dev/null -w '%{url_effective}' "https://github.com/$slug/releases/latest" 2>/dev/null)" \
    || { echo "WARN: dependency-check — could not resolve latest release"; return 1; }
  tag="${redir##*/}"                       # e.g. v12.2.2
  ver="${tag#v}"                           # e.g. 12.2.2
  [ -n "$ver" ] || { echo "WARN: dependency-check — could not parse version from $redir"; return 1; }
  local url="https://github.com/$slug/releases/download/${tag}/dependency-check-${ver}-release.zip"
  local tmp; tmp="$(mktemp -d)"
  echo ">> dependency-check: $slug $tag -> $dest"
  if curl -fsSL "$url" -o "$tmp/dc.zip" && unzip -q -o "$tmp/dc.zip" -d "$dest"; then
    # launcher lands at $dest/dependency-check/bin/dependency-check.sh
    local launch="$dest/dependency-check/bin/dependency-check.sh"
    if [ -f "$launch" ]; then
      chmod +x "$launch"
      ln -sf "$launch" "$bindir/dependency-check"
      echo ">> dependency-check symlinked: $bindir/dependency-check -> $launch"
    else
      echo "WARN: dependency-check launcher not found at expected path ($launch)"
    fi
  else
    echo "WARN: dependency-check download/extract failed"
  fi
  rm -rf "$tmp"
}

case "${1:-all}" in
  apt)        install_apt ;;
  pip)        install_pip ;;
  npm)        install_npm ;;
  redteam)    install_redteam_go ;;
  depcheck)   install_redteam_depcheck ;;
  all)        install_pip; install_npm; install_redteam_go; install_redteam_depcheck; echo ">> run 'sudo bash tools/install.sh apt' for system tools (incl. red-team apt pkgs + default-jre)";;
  *)          echo "usage: install.sh [apt|pip|npm|redteam|depcheck|all]"; exit 2 ;;
esac
echo ">> done: $1"
