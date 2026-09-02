#!/usr/bin/env python3
"""Standalone per-section entropy (report §4.3.1).

Usage: python3 scripts/entropy.py <binary>
Prints JSON: whole-file entropy (non-PE) or per-section entropy (PE).
Flags regions >= 7.8 as packed-heuristic candidates.
"""
from __future__ import annotations
import json
import math
import sys


def entropy(data: bytes) -> float:
    if not data:
        return 0.0
    counts = [0] * 256
    for b in data:
        counts[b] += 1
    n = len(data)
    e = 0.0
    for c in counts:
        if c:
            p = c / n
            e -= p * math.log2(p)
    return round(e, 3)


def main(path: str) -> int:
    try:
        import pefile
        pe = pefile.PE(path, fast_load=True)
    except Exception:  # noqa: BLE001
        raw = open(path, "rb").read(64 * 1024 * 1024)
        print(json.dumps({"wholeFileSampleEntropy": entropy(raw),
                          "note": "non-PE, sampled 64MB"}, indent=2))
        return 0

    sections = []
    for s in pe.sections:
        raw = s.get_data()[: 16 * 1024 * 1024]
        e = entropy(raw)
        sections.append({
            "name": s.Name.rstrip(b"\x00").decode("latin1", "replace"),
            "entropy": e, "rawSize": s.SizeOfRawData,
            "packedHeuristic": e >= 7.8,
        })
    print(json.dumps({"sections": sections,
                      "anyPackedHeuristic": any(x["packedHeuristic"] for x in sections),
                      "note": ">=7.8 raises packed heuristic; verify with DIE/imports"},
                     indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: entropy.py <binary>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
