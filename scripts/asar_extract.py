#!/usr/bin/env python3
"""Standalone asar header parser + extractor (report §4.4).

asar layout (Electron Pickle):
  [4 bytes uint32 LE: header_size_of_this_pickle]
  [4 bytes uint32 LE: payload_size_of_header_string ... actually header len]
  [4 bytes uint32 LE: header_string_len]
  [header_string_len bytes: JSON header]
  [4 bytes uint32 LE: file_body_len]
  [file bodies...]

This implements the common variant: 8-byte prefix then 4-byte JSON len then JSON.
Usage: python3 scripts/asar_extract.py <app.asar> <out_dir>
"""
from __future__ import annotations
import json
import os
import struct
import sys
from pathlib import Path


def read_u32(f):
    return struct.unpack("<I", f.read(4))[0]


def parse_header(path: str):
    size = os.path.getsize(path)
    with open(path, "rb") as f:
        # Electron asar: u32 sizes_header_pickle, u32 size_of_header, u32 size_of_json, then json
        _sizes_pickle = read_u32(f)
        _size_header = read_u32(f)
        size_json = read_u32(f)
        header_bytes = f.read(size_json)
        # align to 4
        if size_json % 4:
            f.read(4 - (size_json % 4))
        body_offset = f.tell() + 4  # skip the 4-byte file_size field
    try:
        header = json.loads(header_bytes.decode("utf-8"))
    except Exception as e:  # noqa: BLE001
        return None, f"header parse failed: {e!r}", size, 0
    return header, body_offset, size, body_offset


def walk(header, prefix=""):
    """Yield (path, entry) for every file in the header tree."""
    files = header.get("files", {})
    for name, entry in files.items():
        full = f"{prefix}/{name}" if prefix else name
        if "files" in entry:
            yield from walk(entry, full)
        else:
            yield full, entry


def main(asar_path: str, out_dir: str) -> int:
    header, body_offset_or_err, size, body_offset = parse_header(asar_path)
    if isinstance(body_offset_or_err, str):
        print(json.dumps({"error": body_offset_or_err, "size": size}, indent=2))
        return 1
    body_offset = body_offset_or_err  # parse_header returns (header, body_offset, size, body_offset)

    files = list(walk(header))
    manifest = {
        "asar": asar_path, "size": size, "bodyOffset": body_offset,
        "fileCount": len(files),
        "files": [
            {"path": p,
             "offset": int(e.get("offset", 0)),
             "size": e.get("size"),
             "unpacked": e.get("unpacked", False)}
            for p, e in files
        ],
    }
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    (Path(out_dir) / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    # extract files
    extracted = 0
    with open(asar_path, "rb") as f:
        for p, e in files:
            if e.get("unpacked"):
                continue
            try:
                off = body_offset + int(e["offset"])
                f.seek(off)
                data = f.read(int(e["size"]))
            except (KeyError, ValueError, OSError):
                continue
            op = Path(out_dir) / "files" / p
            op.parent.mkdir(parents=True, exist_ok=True)
            op.write_bytes(data)
            extracted += 1

    print(json.dumps({"asar": asar_path, "fileCount": len(files),
                      "extracted": extracted, "outDir": out_dir,
                      "manifest": str(Path(out_dir) / "manifest.json")},
                     indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("usage: asar_extract.py <app.asar> <out_dir>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1], sys.argv[2]))
