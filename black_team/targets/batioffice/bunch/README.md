# bunch

BatiOffice v0.9.8의 **로컬 기능**을 Bati 클라우드/계정/AI/크레딧/텔레메트리를
제거한 채로 재구현한 데스크톱 문서 셸. 소프트웨어 이름 `bati` → `bunch`.

- 스택: **Tauri v2.11** + Rust backend + React 18 (TypeScript, Vite)
- BatiOffice 원본: `../README.md` (Electron 분석 타겟)

## 로컬 기능 (재구현)

| 영역 | 내용 |
|------|------|
| 저장소 | 로컬 SQLite (`bunch_store.db`, `src-tauri/src/db.rs`) |
| 홈 | 최근 문서(recents), 즐겨찾기(starred), 통계, 문서 삭제 |
| 프로젝트 | 목록/파일/생성/이름변경/삭제/이동/타임라인 |
| 뷰어 | PDF, 마크다운, Office(docx/xlsx/pptx) — 시스템 앱으로 외부 열기 |
| 설정 | 다크/라이트/시스템 테마, 19개 언어 |
| 기타 | 최근 항목 삭제, 문서 생성, 기본 저장 위치 |

Bati 요소(클라우드 동기화, 계정 인증, AI, 크레딧, 텔레메트리는 제거).

## 프로젝트 구조

```
bunch/
├── index.html
├── src/              React 프론트엔드 (App, components, lib/tauri.ts)
├── src-tauri/        Rust 백엔드 (commands.rs, db.rs, files.rs, main.rs)
│   ├── capabilities/main.json
│   ├── tauri.conf.json
│   └── icons/
├── dist/             Vite 빌드 산출물 (tauri build 시 생성)
└── node_modules/
```

## 빌드

```bash
cd bunch
npm install
node_modules/.bin/tauri build
```

출력: `release/bundle/macos/bunch.app` 및 `release/bundle/dmg/bunch_*.dmg`.

## 실행 (개발)

```bash
node_modules/.bin/tauri dev
```

## 참고

- `tauri.conf.json` — 앱 식별자 `ai.bati.bunch`, productName `bunch`, CSP, 윈도우 설정
- `capabilities/main.json` — 권한 (fs:default 등)
- IPC 채널은 `src-tauri/src/commands.rs`에서 정의, `src/lib/tauri.ts`에서 호출
