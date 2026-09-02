"""readpe-style header dump (DosHeader / OptionalHeader / DataDirectory summary)."""
from __future__ import annotations
import json

from plugins.base import register, _ok, _fail, _write_evidence

# DataDirectory names (PE spec order)
DD_NAMES = [
    "EXPORT", "IMPORT", "RESOURCE", "EXCEPTION", "SECURITY", "BASERELOC",
    "DEBUG", "ARCHITECTURE", "GLOBALPTR", "TLS", "LOAD_CONFIG", "BOUND_IMPORT",
    "IAT", "DELAY_IMPORT", "CLR_RUNTIME", "RESERVED",
]


@register("t_readpe")
def run(tool, target_path, runner, force_skip=False):
    if force_skip:
        return _fail(tool, "skipped by strategy")
    try:
        import pefile
    except ImportError:
        return _fail(tool, "pefile not installed")

    try:
        pe = pefile.PE(target_path)
    except Exception as e:  # noqa: BLE001
        return _fail(tool, f"parse error: {e!r}")

    oh = pe.OPTIONAL_HEADER
    dd = []
    if oh:
        for i, d in enumerate(oh.DATA_DIRECTORY):
            name = DD_NAMES[i] if i < len(DD_NAMES) else f"DIR{i}"
            dd.append({"name": name, "va": hex(d.VirtualAddress), "size": d.Size})

    report = {
        "dos": {"e_lfanew": hex(pe.DOS_HEADER.e_lfanew)},
        "fileHeader": {
            "machine": hex(pe.FILE_HEADER.Machine),
            "numberOfSections": pe.FILE_HEADER.NumberOfSections,
            "timeDateStamp": hex(pe.FILE_HEADER.TimeDateStamp),
            "characteristics": hex(pe.FILE_HEADER.Characteristics),
        },
        "optionalHeader": {
            "imageBase": hex(oh.ImageOfData if False else oh.ImageBase) if oh else None,
            "sizeOfImage": hex(oh.SizeOfImage) if oh else None,
            "sizeOfHeaders": hex(oh.SizeOfHeaders) if oh else None,
            "sectionAlignment": hex(oh.SectionAlignment) if oh else None,
            "subsystem": oh.Subsystem if oh else None,
        },
        "dataDirectories": dd,
    }
    out = json.dumps(report, indent=2, ensure_ascii=False).encode("utf-8")
    _write_evidence(runner, tool, out, b"")
    return _ok(tool, out, message=f"{len(dd)} data directories")
