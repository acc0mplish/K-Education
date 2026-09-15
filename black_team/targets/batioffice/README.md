# BatiOffice v0.9.8 — 분석 타겟 (Electron)

- 원본: `BatiOffice-Setup-0.9.8-x64.exe` (141.7 MiB, NSIS self-extracting)
- 배포: `https://bati.ai` ·productName `BatiOffice` · `@genoffice/shell` v0.9.8
- 라이선스: Apache-2.0 기반 **GenOffice 커스트** (MODIFICATIONS.txt 참조)

## 포맷 체인 (오체분해 순서)

1. `7z` 로 NSIS 패키지 열람 → `$PLUGINSDIR/app-64.7z` (실제 Electron app) 발견
2. `7z x` 로 app-64.7z 압축 해제 → `resources/app.asar` 추출
3. `asar extract resources/app.asar ./app-unpacked` → 소스 코드 복원

도구: brew `p7zip` + 전역 `asar` (Node v25).

## 구조 (`app-unpacked/`)

```
out/main/      Electron main (index.js 7.4MB, bundle) + chunks
out/preload/   contextBridge exposes: aiOffice / aiOfficeProject / aiOfficeTabs / batiofficeAccount
out/renderer/  WebUI (index.html, assets/ bundle)
```

## license 모델 (핵심)

**로컬 시rial/activation 키 없음.** v0.9.8는 서버·크레딧 기반:

- 채널: `batioffice:account:{summary,profile,credits,login,logout,restore,changed}`
- `credits` 응답에 `trial.remaining / trial.expiresAt` 포함 → 체험 크레딧 만료 제어
- activation = cloud account + credits (로컬 bypass 대상이 아님)

업데이터: `provider: generic · url: https://updates.bati.ai/batioffice · channel: beta`.

## 관련 파일

- `app/README.md` — extraction 스크립트
- `app/resources/MODIFICATIONS.txt` — GenOffice 커스트 내용
- `app/resources/app-update.yml` — updater config

## 재구현: `bunch` (Tauri v2 + React + TypeScript)

BatiOffice의 **로컬 기능**을 Bati 클라우드/계정/AI 크레딧/텔레메트리를 제거한
채로 재구현한 앱. 이름 `bati` → `bunch`.

- 위치: [`bunch/`](bunch/) — Tauri v2.11 + Rust backend + React(44 modules) 프론트엔드
- 빌드: `bunch` 디렉토리에서 `node_modules/.bin/tauri build` → release 번들 생성
- 인증 완료: `.app` + `.dmg` 번들 생성, 실행 확인 (다크 테마, 홈/프로젝트/설정 UI 정상)
- 특징: 로컬 SQLite 저장소(recents/starred/projects/timeline), PDF/마크다운/Office(외부 앱) 뷰어,
  설정(다크/라이트 시스템 테마, 언어), 시스템 앱 열기
