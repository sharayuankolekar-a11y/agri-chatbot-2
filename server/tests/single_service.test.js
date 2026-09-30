const http = require('http');
const app = require('../server');

async function testSingleServiceDeployment() {
  console.log('🧪 Starting ScamSniff Single Web Service Deployment Test...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extraDetails = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${extraDetails}`);
      failed++;
    }
  }

  function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
      });
      req.on('error', err => reject(err));
      if (postData) req.write(postData);
      req.end();
    });
  }

  // Wait 1 second for app server setup
  await new Promise(r => setTimeout(r, 1000));

  const port = process.env.PORT || 5000;

  try {
    // 1. Test /api/health
    const healthRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/health',
      method: 'GET'
    });
    assert(healthRes.statusCode === 200, 'GET /api/health returns HTTP 200');
    assert(healthRes.body.includes('ScamSniff API Engine'), 'Health endpoint returns API status JSON');

    // 2. Test Root Frontend /
    const rootRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/',
      method: 'GET'
    });
    assert(rootRes.statusCode === 200, 'GET / returns HTTP 200 OK');
    assert(rootRes.body.includes('<title>ScamSniff'), 'Root path serves compiled React index.html');

    // 3. Test React SPA Client-Side Route (/dashboard)
    const dashRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/dashboard',
      method: 'GET'
    });
    assert(dashRes.statusCode === 200, 'GET /dashboard returns HTTP 200 OK (SPA fallback)');
    assert(dashRes.body.includes('<title>ScamSniff'), 'SPA fallback serves React index.html without 404 error');

    // 4. Test React SPA Client-Side Route (/history)
    const historyRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/history',
      method: 'GET'
    });
    assert(historyRes.statusCode === 200, 'GET /history returns HTTP 200 OK (SPA fallback)');

    // 5. Test API Analyze Endpoint
    const payload = JSON.stringify({ content: "Pay ₹1,500 registration fee to confirm your internship position.", mode: "INTERNSHIP" });
    const analyzeRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);

    assert(analyzeRes.statusCode === 200, 'POST /api/analyze returns HTTP 200 OK');
    assert(analyzeRes.body.includes('Job/Internship Scam') || analyzeRes.body.includes('HIGH'), 'API analyze processes scam request and returns JSON');

    console.log(`\n======================================================`);
    console.log(`📊 Deployment Verification: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} tests.`);
    console.log(`======================================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('❌ Error during HTTP tests:', err);
    process.exit(1);
  }
}

testSingleServiceDeployment();
