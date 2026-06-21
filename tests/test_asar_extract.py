"""Tests for asar header parser (scripts/asar_extract.py).

Covers the STANDARD Electron asar Pickle format (4×u32 prefix) which the
hand-crafted repo fixtures (3×u32, [0][0][jsonSize]) did not exercise, plus
regression on the existing fixtures.
"""
import io
import json
import struct
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))


def _build_standard_asar(files: dict) -> bytes:
    """Build a minimal STANDARD-format (4×u32 prefix) asar, like real Electron."""
    header = {"files": {}}
    offset = 0
    bodies = b""
    for name, content in files.items():
        header["files"][name] = {"size": len(content), "offset": str(offset)}
        pad = (4 - len(content) % 4) % 4
        bodies += content + b"\x00" * pad
        offset += len(content) + pad
    jb = json.dumps(header).encode("utf-8")
    jpad = (4 - len(jb) % 4) % 4
    buf = io.BytesIO()
    buf.write(struct.pack("<I", 4))                  # sizes_pickle = 4
    buf.write(struct.pack("<I", len(jb) + jpad + 8))  # headerStringSize
    buf.write(struct.pack("<I", len(jb) + jpad + 4))  # headerSize
    buf.write(struct.pack("<I", len(jb)))             # jsonSize (actual)
    buf.write(jb + b"\x00" * jpad)
    buf.write(struct.pack("<I", offset))              # body size field
    buf.write(bodies)
    return buf.getvalue()


def test_parse_standard_4u32_asar(tmp_path):
    import asar_extract
    marker = b"console.log('DAF_API_TOKEN=secret'); SUBSCRIPTION_STATUS;"
    blob = _build_standard_asar({"main.js": marker, "pkg.json": b'{"name":"x"}'})
    p = tmp_path / "app.asar"
    p.write_bytes(blob)

    header, body_offset, size, _ = asar_extract.parse_header(str(p))
    assert isinstance(body_offset, int), f"parse failed: {body_offset}"
    assert "files" in header
    entries = dict(asar_extract.walk(header))
    assert "main.js" in entries

    main_entry = entries["main.js"]
    with open(p, "rb") as f:
        f.seek(body_offset + int(main_entry["offset"]))
        content = f.read(int(main_entry["size"]))
    assert content == marker  # body_offset + entry offset resolves to real content


def test_legacy_fixture_format_still_parses():
    import asar_extract
    for p in ("targets/electron_fixture/app.asar",
              "targets/electron_pe_fixture/resources/app.asar"):
        header, body_offset, size, _ = asar_extract.parse_header(p)
        assert isinstance(body_offset, int), f"{p}: parse failed ({body_offset})"
        assert "files" in header, f"{p}: no files key"
