"""Target profile classifier.

Maps a file/url to one of: zip, asar, pe, elf, mach_o, inno_setup,
archive, android, network, unknown.

Mirrors MacRE §13.1 fix: asar must NOT be misclassified as Mach-O just
because BinaryInfo exists. Header signature is authoritative.
"""
from __future__ import annotations
import subprocess
from dataclasses import dataclass
from pathlib import Path

MAGIC = {
    b"MZ": "pe",          # needs PE header confirm
    b"\x7fELF": "elf",
    b"PK\x03\x04": "zip",
    b"\x1f\x8b": "archive",
    b"Rar!": "archive",
    b"7z\xbc\xaf\x27\x1c": "archive",
    b"\xfd7zXZ": "archive",
}

MACHO_MAGICS = (0xFEEDFACE, 0xFEEDFACF, 0xCEFAEDFE, 0xCFFAEDFE, 0xCAFEBABE)


@dataclass(frozen=True)
class TargetInfo:
    path: str
    profile: str
    size: int
    magic_hex: str
    method: str  # how decided


def _u32le(b: bytes) -> int:
    return int.from_bytes(b[:4], "little")


def _u32be(b: bytes) -> int:
    return int.from_bytes(b[:4], "big")


def classify(path: str | Path) -> TargetInfo:
    p = str(path)
    size = Path(p).stat().st_size if Path(p).exists() else 0

    # network first
    if p.startswith(("http://", "https://")):
        return TargetInfo(p, "network", 0, "", "url_scheme")

    # read header
    head = b""
    try:
        with open(p, "rb") as f:
            head = f.read(512)
    except OSError:
        head = b""

    magic_hex = head[:8].hex()

    # asar: header starts with a Pickle dict. Heuristic: extension + JSON-ish payload
    if p.lower().endswith(".asar") or (head[:4] == b"\x04\x00\x00\x00" and b"header" in head[:64]):
        return TargetInfo(p, "asar", size, magic_hex, "asar_ext_header")

    # zip / android(apk is zip with classes.dex) / inno
    if head[:4] == b"PK\x03\x04":
        # APK heuristic: zip containing classes.dex or AndroidManifest
        try:
            out = subprocess.run(
                ["7z", "l", p], capture_output=True, text=True, timeout=30
            )
            listing = out.stdout + out.stderr
            if "classes.dex" in listing or "AndroidManifest.xml" in listing:
                return TargetInfo(p, "android", size, magic_hex, "zip_apk_content")
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        return TargetInfo(p, "zip", size, magic_hex, "magic_pk")

    # PE: MZ then check for PE\x00\x00
    if head[:2] == b"MZ":
        try:
            with open(p, "rb") as f:
                f.seek(0x3C)
                pe_off = int.from_bytes(f.read(4), "little")
                f.seek(pe_off)
                if f.read(4) == b"PE\x00\x00":
                    return TargetInfo(p, "pe", size, magic_hex, "mz_pe_sig")
        except OSError:
            pass
        return TargetInfo(p, "pe", size, magic_hex, "mz_only")

    # ELF
    if head[:4] == b"\x7fELF":
        return TargetInfo(p, "elf", size, magic_hex, "magic_elf")

    # Mach-O (fat + single)
    if len(head) >= 4:
        w32 = _u32be(head)
        w32l = _u32le(head)
        if w32 in MACHO_MAGICS or w32l in MACHO_MAGICS:
            return TargetInfo(p, "mach_o", size, magic_hex, "magic_macho")

    # generic archives
    if head[:2] == b"\x1f\x8b" or head[:3] == b"BZh" or head[:6] == b"7z\xbc\xaf\x27\x1c":
        return TargetInfo(p, "archive", size, magic_hex, "magic_archive")
    if head[:4] == b"Rar!":
        return TargetInfo(p, "archive", size, magic_hex, "magic_rar")

    # inno setup: fallback to innoextract probe
    if size > 0:
        try:
            r = subprocess.run(["innoextract", "-t", p], capture_output=True, timeout=30)
            if r.returncode == 0:
                return TargetInfo(p, "inno_setup", size, magic_hex, "innoextract_probe")
        except FileNotFoundError:
            pass

    return TargetInfo(p, "unknown", size, magic_hex, "fallback")
