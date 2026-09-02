"""lief PE parse (report §4.3.3). Uses PE-specific path — NOT Mach-O (§13.3 fix)."""
from __future__ import annotations
import json

from plugins.base import register, _ok, _fail, _write_evidence


@register("t_lief")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")
    try:
        import lief
    except ImportError:
        return _fail(tool, "lief not installed")

    try:
        # Dispatch by magic — separate PE/ELF/Mach-O paths (report §13.3 fix:
        # never feed a PE through the Mach-O bridge).
        with open(target_path, "rb") as f:
            head = f.read(8)
        if head[:2] == b"MZ":
            binary = lief.PE.parse(target_path)
            fmt = "pe"
        elif head[:4] == b"\x7fELF":
            binary = lief.ELF.parse(target_path)
            fmt = "elf"
        elif int.from_bytes(head[:4], "big") in (0xFEEDFACE, 0xFEEDFACF) or \
             int.from_bytes(head[:4], "little") in (0xFEEDFACE, 0xFEEDFACF):
            binary = lief.MachO.parse(target_path)
            fmt = "macho"
        else:
            binary = lief.parse(target_path)
            fmt = "auto"
        if binary is None:
            return _fail(tool, "lief returned None (unsupported format)")
    except Exception as e:  # noqa: BLE001
        return _fail(tool, f"lief error: {e!r}")

    def _flag(name):
        v = getattr(binary, name, False)
        return bool(v() if callable(v) else v)

    report = {
        "format": fmt,
        "hasDebug": _flag("has_debug"),
        "hasResources": _flag("has_resources"),
        "hasSignature": _flag("has_signature"),
        "delayImports": [str(d) for d in getattr(binary, "delay_imports", [])][:64],
    }
    oh = getattr(binary, "optional_header", None)
    if oh is not None:
        report["imagebase"] = hex(getattr(oh, "imagebase", 0))
        report["isGui"] = getattr(oh, "subsystem", None) == 2
    out = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(tool, out, message="lief PE parse ok (PE path)")
