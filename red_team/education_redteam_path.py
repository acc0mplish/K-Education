import sys
from pathlib import Path

EDU = Path(__file__).resolve().parent.parent / "education"


def ensure():
    if str(EDU) not in sys.path:
        sys.path.insert(0, str(EDU))
