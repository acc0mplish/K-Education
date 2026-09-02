/*
 * BlogGenius v0.4.0 — publish quota RPC 연결 정보 심층 분석
 * =======================================================
 * 목적: reserve_publish_quota → commit/release_publish_quota 의
 *       operation_id 상관(operation correlation) 메커니즘을 실제 RPC로 실증하고,
 *       operation_id 포맷이 예측 가능한지 분석한다.
 *
 * 근거:
 *   - src/license.js:337   callPublishQuotaRpc — RPC 파라미터/응답 처리
 *   - src/license.js:869   reservePublishQuota
 *   - src/license.js:886   commitPublishQuota / releasePublishQuota
 *   - src/publish-quota.js:12  createPublishOperationId (operation_id 포맷)
 *   - src/publish-quota.js:26  buildPublishQuotaPreflight (remaining===-1 = 무제한)
 *   - src/ui-runtime/content-actions-runtime.js:673  reserve 호출 (metadata 포함)
 *   - src/ui-runtime/content-actions-runtime.js:717  settle (commit/release 선택)
 *
 * 사용법:
 *   node bloggenius_quota_correlation.mjs                 # test 플랜으로 실증
 *   node bloggenius_quota_correlation.mjs --plan test     # 명시적 plan 지정
 */

import crypto from 'node:crypto';

const SUPABASE_URL = process.env.BLOGGENIUS_SUPABASE_URL || 'https://hocfjolcthvtgfaxjmse.supabase.co';
const SUPABASE_ANON = process.env.BLOGGENIUS_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_4DObqEWTXyZNRlmJdB3bqQ_BstyktIJ';
const PLAN = (process.argv.includes('--plan') ? process.argv[process.argv.indexOf('--plan') + 1] : 'test') || 'test';

const HTTP = 'https://hocfjolcthvtgfaxjmse.supabase.co';
// Supabase supabase.rpc()가 송신하는 동일 헤더 (content-profile: public 필수)
const rpc = async (name, params) => {
    const res = await fetch(`${HTTP}/rest/v1/rpc/${name}`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_ANON,
            Authorization: `Bearer ${SUPABASE_ANON}`,
            'content-profile': 'public',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok || !data || data.success === false) {
        return { ok: false, http: res.status, data, error: `${res.status} ${data?.message || res.statusText}` };
    }
    return { ok: true, data };
};

// operation_id 생성 (createPublishOperationId 재현) — src/publish-quota.js:12
const normalizeOperationPart = (v) => String(v ?? '')
    .trim().toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const createOperationId = ({ scope = 'publish', stableKey = '', postStatus = 'publish' } = {}) => {
    const s = normalizeOperationPart(scope) || 'publish';
    const st = normalizeOperationPart(postStatus) || 'publish';
    const k = normalizeOperationPart(stableKey);
    return k ? `${s}:${k}:${st}`.slice(0, 160) : `${s}:${crypto.randomUUID()}:${st}`;
};

// remaining===-1 = 무제한 (buildPublishQuotaPreflight, publish-quota.js:26-32)
const unlimited = (r) => Number(r) === -1;

const print = (label, res, extra = '') => {
    if (!res.ok) { console.log(`  ${label} ❌ ${res.error}${extra}`); return; }
    console.log(`  ${label} ✅ success=${res.data.success} remaining=${res.data.remaining} op=${res.data.operation_id ?? ''}${extra}`);
};

(async () => {
    console.log(`BlogGenius publish quota operation_id 상관 분석  (plan=${PLAN})`);
    console.log(`target: ${HTTP}\n`);

    // 1) 키 발급
    const issue = await rpc('issue_test_license', { p_hwid: `QUOTA-PLAN-${PLAN}-HWID` });
    if (!issue.ok) { console.log('issue 실패:', issue.error); process.exit(1); }
    const key = String(issue.data.license_key || '').trim();
    console.log(`[1] issue_test_license -> plan=${issue.data.plan_code} key=${key}\n`);

    // 2) operation_id 포맷 분석 — 결정적(stableKey) vs 무작위(uuid)
    console.log('[2] operation_id 포맷 (predictable? )');
    const det = createOperationId({ scope: 'blog-batch', stableKey: 'sheet-row-42', postStatus: 'publish' });
    const rnd = createOperationId({ scope: 'blog-batch', postStatus: 'publish' });
    console.log(`  stableKey 있으면 (결정적): ${det}`);
    console.log(`  stableKey 없으면 (UUID) : ${rnd}`);
    console.log(`  -> stableKey가 알려지면 operation_id를 예측/재사용 가능 (상관 약점)\n`);

    // 3) reserve — 결정적 operation_id로 예약
    const op = det;
    const metadata = { source: 'blog-batch', post_status: 'publish', targets: ['naver'] };
    const reserve = await rpc('reserve_publish_quota', {
        p_license_key: key, p_hwid: `QUOTA-PLAN-${PLAN}-HWID`, p_operation_id: op, p_metadata: metadata
    });
    print('  reserve_publish_quota', reserve, `  (op=${op})`);
    if (!reserve.ok) { console.log('\n결론: RPC 접속 실패 (서버 설정/RLS 확인)'); process.exit(1); }

    // 4) release — 예약 반환 (실패 시 사용)
    const release = await rpc('release_publish_quota', {
        p_license_key: key, p_hwid: `QUOTA-PLAN-${PLAN}-HWID`, p_operation_id: reserve.data.operation_id || op, p_metadata: metadata
    });
    print('  release_publish_quota', release, `  (잔여 반환)`);

    // 5) commit — 소비 확정 (다시 reserve 후 commit)
    const reserve2 = await rpc('reserve_publish_quota', {
        p_license_key: key, p_hwid: `QUOTA-PLAN-${PLAN}-HWID`, p_operation_id: op + '-commit', p_metadata: metadata
    });
    print('  reserve_publish_quota', reserve2);
    const commit = await rpc('commit_publish_quota', {
        p_license_key: key, p_hwid: `QUOTA-PLAN-${PLAN}-HWID`, p_operation_id: reserve2.data.operation_id || op, p_metadata: metadata
    });
    print('  commit_publish_quota', commit);

    console.log(`\n[결론] remaining=${reserve.data.remaining} (unlimited=${unlimited(reserve.data.remaining)}).`);
    console.log(reserve.data.remaining === 50 || reserve.data.remaining === -1
        ? '  test 플랜: 기능 잠금 없이 사용 가능 (hwid 무관)'
        : '  할당된 quota만큼만 사용 가능');
})();
