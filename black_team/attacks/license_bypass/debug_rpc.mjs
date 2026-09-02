const URL = 'https://hocfjolcthvtgfaxjmse.supabase.co';
const ANON = 'sb_publishable_4DObqEWTXyZNRlmJdB3bqQ_BstyktIJ';

const call = async (path, body, extraHeaders = {}) => {
  try {
    const q = new URLSearchParams({ apikey: ANON });
    const r = await fetch(URL + path + '?' + q.toString(), {
      method: 'POST',
      headers: {
        apikey: ANON,
        Authorization: 'Bearer ' + ANON,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.supabase.v1+json',
        ...extraHeaders,
      },
      body: JSON.stringify(body),
    });
    const ct = r.headers.get('content-type');
    const t = await r.text();
    console.log(`${path} -> HTTP ${r.status} CT=${ct}\n   ${t.slice(0, 500)}`);
  } catch (e) {
    console.log(`${path} -> ERR ${e.message}`);
  }
};

const p = { p_hwid: 'POC-DBG-XYZ' };
await call('/rpc/issue_test_license', p);
await call('/rpc/issue_test_license', { hwid: 'POC-DBG-XYZ' });
await call('/rpc/issue_test_license', []); // positional arg
console.log('--- health ---');
try { const h = await fetch(URL + '/health'); console.log('health', h.status, (await h.text()).slice(0, 120)); } catch (e) { console.log('health ERR', e.message); }
