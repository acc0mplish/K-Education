# Repository Guidelines

## Project Structure & Module Organization

Team outputs live at the repo root under three folders (see `CLAUDE.md` for placement rules):

- `black_team/` — offensive/crack research. `attacks/<type>/` (PoC), `ghidra/scripts/` (Ghidra/analysis tools), `targets/` (binary samples), `evidence/` (findings).
- `red_team/` — red-team attack simulation (payloads, subscription mock, `red_team/redteam/run_redteam.py`).
- `blue_team/` — blue-team defense/validation analysis.
- `docs/` — project-wide reports and source designs.
- `education/` — legacy learning/annotation side-material (mostly gitignored). Its old subdirs (`attacks/`, `labs/`, `reports/`, `redteam/`) are **superseded** by the root team folders above; place new content in the team folder, not in `education/`.
- `KLIC-Aditus/` is a Bun + Rust workspace: `apps/desktop/` is React/Tauri, `packages/` holds shared TypeScript packages, `crates/` holds Rust libraries, and `server/` is the Rust backend.
- Treat `_work/`, `target/`, `dist/`, and `node_modules/` as generated or extracted artifacts.

**Rule (산출물 배정, never scatter):** every output must land in exactly one team folder per the 배정표 in `CLAUDE.md` — attack/PoC → `black_team/attacks/`, crypto analysis → `black_team/attacks/crack_license/`, Ghidra tools → `black_team/ghidra/scripts/`, red-team sim → `red_team/`, defense/validation → `blue_team/`, reports → `docs/`. Never scatter a single finding across multiple folders.

## Build, Test, and Development Commands

From the repository root:

- `python3 red_team/redteam/run_redteam.py <target> --i-own-this` runs registered PoCs against an owned/lab target and writes `evidence/<target>/red_findings.json`.

From `KLIC-Aditus/`:

- `bun install` installs workspace dependencies using `bun.lock`.
- `bun run dev` starts the desktop Vite development app.
- `bun run build` builds all Bun workspaces; `bun run typecheck` runs TypeScript checks.
- `bun run lint` runs Biome checks; `bun run format` applies Biome formatting.
- `bun run cargo:check`, `bun run cargo:test`, `bun run cargo:clippy`, and `bun run cargo:fmt` validate Rust.
- `bun run tauri:dev` and `bun run tauri:build` run or package the Tauri desktop app.

## Coding Style & Naming Conventions

Follow `KLIC-Aditus/.editorconfig`: UTF-8, LF, final newline, spaces only, 2-space indentation for TS/JS/JSON/CSS/HTML/Markdown/YAML, and 4-space indentation for Rust/TOML. Biome uses double quotes, optional semicolons, and a 100-column line width. Rust uses edition 2021 and `rustfmt.toml`.

Use descriptive lane IDs such as `S4` in red-team modules and keep report filenames explicit, for example `red_team_plan.md`. TypeScript packages use workspace names like `@klic-aditus/ui`.

## Testing Guidelines

Place Rust integration tests under crate `tests/` directories or focused `*_tests.rs` modules. Place TypeScript script tests as `*.test.ts` near the tested script, for example `apps/desktop/scripts/verify-axe.test.ts`. Run `bun run test` when package tests exist, plus relevant `cargo:*` checks for Rust changes.

## Commit & Pull Request Guidelines

Git history uses Conventional Commit style, for example `feat(cli): ...`, `fix(report): ...`, and `docs(education): ...`. Keep commits scoped and imperative.

Pull requests should include a concise summary, validation commands, linked issue or engagement context, and screenshots for UI changes. For red-team content, state owned-lab assumptions and include blue-team detection or mitigation notes.

## Security & Ethics

Red-team exercises are only for owned systems or intentionally vulnerable labs. Keep the `--i-own-this` guard intact. Do not add distributed/DoS tooling, phishing weaponization, keygens, broad patchers, secrets, customer data, or proprietary extracts.
