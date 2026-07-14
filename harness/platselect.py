"""Platform detection: select the right catalog and gate platform-specific lanes.

Darwin  -> tool_catalog.macos.json  (otool/lipo/dwarfdump/codesign; no Wine)
Linux   -> tool_catalog.json        (objdump/readelf; Wine + WSL Windows-interop)
"""
from __future__ import annotations
import os
import platform as _pf
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def is_macos() -> bool:
    return _pf.system() == "Darwin"


def is_linux() -> bool:
    return _pf.system() == "Linux"


def catalog_path() -> str:
    mac = ROOT / "tool_catalog.macos.json"
    if is_macos() and mac.exists():
        return str(mac)
    return str(ROOT / "tool_catalog.json")


def catalog_label() -> str:
    return "macos" if is_macos() else "linux"


def dynamic_windows_available() -> bool:
    """WSL Windows-interop (powershell.exe) — only on Linux/WSL2, not macOS."""
    return is_linux() and os.path.exists(
        "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe")


def platform_note() -> str:
    if is_macos():
        return ("macOS: Mach-O via otool/lipo/dwarfdump/codesign; "
                "Windows PE dynamic exec NOT available (no Wine) — static+emulation only")
    return "Linux/WSL2: ELF/PE static + Wine + WSL Windows-interop dynamic"
