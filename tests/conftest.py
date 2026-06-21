"""Shared pytest config: put harness/ and repo root on sys.path."""
import sys, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
HARNESS = ROOT / "harness"
for p in (str(ROOT), str(HARNESS)):
    if p not in sys.path:
        sys.path.insert(0, p)


def make_zip_with_js(tmp_path: Path, name: str, members: dict[str, str]) -> Path:
    """Build a zip fixture whose members map filename -> JS/text content."""
    p = tmp_path / name
    with zipfile.ZipFile(p, "w", zipfile.ZIP_DEFLATED) as zf:
        for fname, body in members.items():
            zf.writestr(fname, body)
    return p
