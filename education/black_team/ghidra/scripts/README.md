# Ghidra scripts & analysis tools

Ghidra (12.1.x / 13.x) headless analysis artifacts for the crack-license engagement.
This is the canonical home for Ghidra scripts and Ghidra-analysis tooling per the
`산출물 배정표` in `CLAUDE.md` (**Ghidra 도구 → `black_team/ghidra/scripts/`**).

## Layout

- `scripts/` — `.java` `GhidraScript`/`AbstractAnalyzer` sources (analyzeHeadless `-postScript`, `-process` import hooks).
- `analysis/` — standalone analysis helpers and the `.claude/`/`config/` runtime dirs.

## Naming

- Keep script class names PascalCase and unique (e.g. `DecompileSearchLicense`, `FFCapture`).
- Pair a `.java` script with a short `.md` notes file when it encodes a non-obvious
  Ghidra OSGi/ClassSearcher/parallel-decompiler gotcha.

## Notes

- Ghidra 12.1.3 is a Felix OSGi install: `ClassSearcher` only scans installed feature
  bundles, and a class compiled into the transient `-scriptPath` bundle is NOT discovered.
  Ship an analyzer in a **permanent feature bundle** to make it discoverable at `-import`.
- Parallel decompiler: the default GUI configurer calls `toggleCCode(false)`, which
  suppresses Clang markup. Use a `DecompileConfigure` that calls `toggleCCode(true)`
  so `DecompileResults.getCCodeMarkup()` is non-null.
