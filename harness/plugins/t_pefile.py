"""PE structure via pefile (sections / imports / VersionInfo / DataDirectory / security).

Reproduces report §4.1 / §4.3.1. In-process; no shell-out.
"""
from __future__ import annotations
import json

from plugins.base import register, _ok, _fail, _write_evidence


@register("t_pefile")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")
    try:
        import pefile
    except ImportError:
        return _fail(tool, "pefile not installed in venv")

    try:
        pe = pefile.PE(target_path, fast_load=True)
        pe.parse_data_directories()
    except Exception as e:  # noqa: BLE001
        return _fail(tool, f"pefile parse error: {e!r}")

    sections = []
    for s in pe.sections:
        sections.append({
            "name": s.Name.rstrip(b"\x00").decode("latin1", "replace"),
            "vaddr": hex(s.VirtualAddress),
            "vsize": s.Misc_VirtualSize,
            "rawSize": s.SizeOfRawData,
            "entropy": round(s.get_entropy(), 3),
            "characteristics": hex(s.Characteristics),
        })

    imports = []
    if hasattr(pe, "DIRECTORY_ENTRY_IMPORT"):
        for entry in pe.DIRECTORY_ENTRY_IMPORT:
            dll = entry.dll.decode("latin1", "replace") if entry.dll else "?"
            funcs = [imp.name.decode("latin1", "replace") if imp.name else f"ord:{imp.ordinal}"
                     for imp in entry.imports]
            imports.append({"dll": dll, "imports": funcs})

    # VersionInfo / SquirrelAwareVersion (report §4.3.1)
    versioninfo = {}
    squirrel = None
    if hasattr(pe, "FileInfo"):
        for finfo in pe.FileInfo:
            for st in finfo:
                if hasattr(st, "StringTable"):
                    for tbl in st.StringTable:
                        for k, v in tbl.entries.items():
                            versioninfo[k.decode("latin1", "replace")] = v.decode("latin1", "replace")
                            if k.lower() == b"squirrelawareversion":
                                squirrel = v.decode("latin1", "replace")

    sec_dir = pe.OPTIONAL_HEADER.DATA_DIRECTORY[4] if pe.OPTIONAL_HEADER else None  # 4 = SECURITY
    report = {
        "machine": hex(pe.FILE_HEADER.Machine),
        "isPE32plus": pe.PE_TYPE == 0x20b,
        "subsystem": pe.OPTIONAL_HEADER.Subsystem if pe.OPTIONAL_HEADER else None,
        "numberOfSections": pe.FILE_HEADER.NumberOfSections,
        "dllCharacteristics": hex(pe.OPTIONAL_HEADER.DllCharacteristics) if pe.OPTIONAL_HEADER else None,
        "hasSignature": bool(sec_dir and sec_dir.VirtualAddress),
        "securityDirVA": hex(sec_dir.VirtualAddress) if sec_dir else None,
        "squirrelAwareVersion": squirrel,
        "versionInfo": versioninfo,
        "sections": sections,
        "imports": imports,
        "importDllCount": len(imports),
    }
    out = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, out)
    return _ok(tool, out, message=f"{len(sections)} sections, {len(imports)} import DLLs",
               sectionCount=len(sections), hasSignature=report["hasSignature"],
               squirrelAware=squirrel)
