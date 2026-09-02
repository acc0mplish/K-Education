# BlogGenius — 복원된 소스 (restored source)

BlogGenius **v0.4.0** ("Google Gemini AI 기반 네이버博客 자동 포스팅 솔루션", `blog-genius`)의
프로젝트 소스입니다. 상용 Electron 바이너리에서 역압축하여 복원했습니다.

## 복원 경로
```
BlogGenius-linux-x64.zip
  └─ BlogGenius-v0.4.0-linux-x64/lib/resources/app.asar
         └─ (asar 추출) → 이 디렉토리
```
- 복원 스크립트: `../extract_source.mjs` (asar `readFileSync`/`getFile` 기반, `node_modules` 제외)
- 검증 스크립트: `../verify_extract.mjs` — **asar source 항목 680 / disk missing 0 (검증 완료)**

## 분석 산출물
- 1차 분석: `../../evidence/bloggenius/BlogGenius-source-analysis.md`
- 2차 분석(license/secret/feature-gate): `../../evidence/bloggenius/BlogGenius-2nd-analysis.md`

## 구조 (핵심)
| 경로 | 설명 |
|------|------|
| `src/` | 앱 본소스 (468개 JS/TS). auth/license/ai/naver/publish 등 |
| `src/gui/electron-main.js` | electron 진입점 (main.js 아님) |
| `src/ui-server.js` | localhost HTTP UI 서버 |
| `src/ui-runtime/` | UI 동작 실행 로직 (publish/content/auto-cycle) |
| `src/api/` | UI↔백엔드 컨트롤러·라우트·서비스 |
| `src/core.js` | 포스팅 핵심 로직 (`publishToBlog` 등) |
| `src/license.js`, `license-feature-policy.js`, `publish-quota.js` | 라이선스/기능잠금/할당 |
| `src/naver-auth-flow.js`, `auth-session.js` | 네이버 로그인·세션 |
| `src/ai-model-catalog.js`, `ai/` | AI provider 라우팅 |
| `shared/` | electron main·renderer 공통 라이브 |
| `ui/` | 프롣엔드 HTML/CSS/JS |
| `bin/`, `scripts/` | CLI·빌드·배포 스크립트 |
| `.github/workflows/` | CI 빌드 파이프라인 |

## 참고
- `node_modules`는 제외됨 — `npm install`으로 복원 가능 (`package.json` 유지).
- `kuzu`(로컬 벡터DB) native 데이터는 이 release에 미포함(asar 참조만 존재). 앱 본소스와 무관.
