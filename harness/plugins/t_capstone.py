"""Capstone entry-point disassembly (report §4.3.1 MSVC stub check).

Disassembles first N bytes at AddressOfEntryPoint.
"""
from __future__ import annotations

from plugins.base import register, _ok, _fail, _write_evidence


@register("t_capstone")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")
    try:
        import pefile
        from capstone import Cs, CS_ARCH_X86, CS_MODE_64, CS_MODE_32
    except ImportError as e:
        return _fail(tool, f"deps missing: {e!r}")

    try:
        pe = pefile.PE(target_path, fast_load=True)
    except Exception as e:  # noqa: BLE001
        return _fail(tool, f"parse error: {e!r}")

    ep = pe.OPTIONAL_HEADER.AddressOfEntryPoint if pe.OPTIONAL_HEADER else None
    if not ep:
        return _fail(tool, "no AddressOfEntryPoint")

    data = pe.get_data(ep, 64)
    mode = CS_MODE_64 if pe.PE_TYPE == 0x20b else CS_MODE_32
    md = Cs(CS_ARCH_X86, mode)
    lines = []
    for ins in md.disasm(data, ep):
        lines.append(f"0x{ins.address:x}  {ins.mnemonic} {ins.op_str}")
    out = ("\n".join(lines) + "\n").encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(tool, out, message=f"entry=0x{ep:x}, {len(lines)} insns",
               entryPoint=hex(ep))
