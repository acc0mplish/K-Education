# BlogGenius v0.4.0 — `issue_test_license` hwid 우회 PoC

hwid이 실제 머신과 일치하지 않아도 **임시 라이선스 키를 발급받아 모든 기능을 활성화**하는지를 증명하는 PoC입니다.

## 결과 (검증 완료)
임의/합성 hwid 5개를 모두 동일하게 우회 성공:
- `issue_test_license` → `success:true`, `plan_code:test`, `license_key` 발급
- `check_license_status`에서 서버가 키를受理
- **10개 기능 전원 ON** (`cmd_pub`/`cmd_batch`/`cmd_trends`/`cmd_shopping`/`image_generation`/`max_blog_posts_per_run`/`enable_sns_distribution`/`max_shopping_posts_per_run`/`enable_trends_date_override`/`enable_related_posts_auto_link`)
- quota `remaining=50`

## 취약점 요지
1. **hwid 바인딩은 관례적** — `issue_test_license`는 `p_hwid` 1개로 키를 발급하며, 발급된 키와 hwid의 일치는 검증하지 않음 (`src/license.js:295-329`, 키 서식 `String().trim()` 외 검증 없음).
2. **"test" 플랜이 모든 기능 grant** — 발급된 키는 `plan_code:test`로, 서버에서 10개 feature를 모두 활성화.
3. **로컬 암호화 없음** — `src/config/secret.js`는 crypto 없는 placeholder. config는 평문 + env 오버라이드로 취급 (2차 분석 보고서 참조).

## PoC 실행
```bash
# 의존성: @supabase/supabase-js (이 앱이 실제 쓰는 클라이언트)
npm install @supabase/supabase-js

node bloggenius_hwid_bypass.mjs                 # 고정 POC hwid
node bloggenius_hwid_bypass.mjs --hwid <hwid>   # 임의 hwid
node bloggenius_hwid_bypass.mjs --synthetic-count 5  # 여러 hwid에서 재현
```

## PoC가 재현한 요청 (핵심 — 이 두 가지가 맞아야 성공)
- **URL**: `POST {SUPABASE_URL}/rest/v1/rpc/{rpc_name}`
  - ⚠️ `/rpc/{name}`이 아니라 `/rest/v1/rpc/` 접두사 필수. 안 보면 404 `{"error":"requested path is invalid"}`
- **헤더**: `apikey`, `Authorization: Bearer` (anon key), `content-profile: public`, `Content-Type: application/json`
  - ⚠️ `content-profile: public` 없으면 404
- **본인**: `{ "p_hwid": "<hwid>" }` (issue), `{ "p_license_key": "<key>", "p_hwid": "<hwid>" }` (check)

## 참고 사항
- 이 PoC는 **실제 생산 Supabase**에 RPC를 송신합니다 (공개 anon key 사용, `sb_publishable_*`).
- hwid 값은 임의로 변경 가능 (`--hwid`). 실제 `machineIdSync({original:true})`와 무관하게 동작함을 재현 목적으로 임의로 설정.
- 분석 근거: `src/license.js`, `src/license-feature-policy.js`, `src/publish-quota.js`, `src/environment/runtime-profile.js`, `src/config/secret.js`

## 연관 산출물
- 1차 소스 분석: `../../evidence/bloggenius/BlogGenius-source-analysis.md`
- 2차 license/secret/feature-gate 분석: `../../evidence/bloggenius/BlogGenius-2nd-analysis.md`
- 복원 소스: `../../targets/bloggenius/source/`
