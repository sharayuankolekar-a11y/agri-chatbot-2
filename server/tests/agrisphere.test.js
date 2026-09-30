const http = require('http');
const { isUnrelatedQuery, GUARDRAIL_REJECTION_MESSAGE } = require('../services/agriClassifier');
const { analyzeAgriQuery, generateOfflineAgriAnalysis } = require('../services/agriAnalyzer');
const app = require('../server');

async function runAgriSphereTestSuite() {
  console.log('🧪 Starting AgriSphere Automated Test Suite...\n');

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

  // Suite 1: Domain Guardrail Rejection
  console.log('[Suite 1: Agriculture Domain Guardrails]');
  const isCodeUnrelated = isUnrelatedQuery('Write Java code');
  assert(isCodeUnrelated === true, 'Rejects "Write Java code" query');

  const isJokeUnrelated = isUnrelatedQuery('Tell me a joke');
  assert(isJokeUnrelated === true, 'Rejects "Tell me a joke" query');

  const isCropAllowed = isUnrelatedQuery('My tomato leaves are turning yellow. What should I do?');
  assert(isCropAllowed === false, 'Allows agriculture tomato disease query');

  // Suite 2: Guardrail Response Message Verification
  console.log('\n[Suite 2: Guardrail Rejection Handler]');
  const rejectionResult = await analyzeAgriQuery('What is the capital of France?');
  assert(rejectionResult.isUnrelated === true, 'Flags capital of France as unrelated');
  assert(rejectionResult.message === GUARDRAIL_REJECTION_MESSAGE, 'Returns exact AgriSphere guardrail message');

  // Suite 3: Crop Disease Analysis
  console.log('\n[Suite 3: Plant Disease Analysis]');
  const diseaseRes = await analyzeAgriQuery('My tomato leaves are turning yellow with dark spots', null, 'AUTO', 'en');
  assert(diseaseRes.isUnrelated === false, 'Processes tomato disease query');
  assert(diseaseRes.result.crop === 'Tomato', 'Identifies crop as Tomato');
  assert(diseaseRes.result.category === 'Plant Disease', 'Categorizes as Plant Disease');

  // Suite 4: Irrigation Advice
  console.log('\n[Suite 4: Irrigation Schedule Advice]');
  const waterRes = await analyzeAgriQuery('When should I irrigate my paddy rice field?', null, 'AUTO', 'kn');
  assert(waterRes.result.crop.includes('Rice'), 'Identifies crop as Rice');
  assert(waterRes.result.category === 'Irrigation Guidance', 'Categorizes as Irrigation Guidance');

  // Suite 5: Image Attachment Handling
  console.log('\n[Suite 5: Image Attachment Architecture]');
  const dummyImageBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD';
  const imgRes = await analyzeAgriQuery('Check this crop leaf', dummyImageBase64, 'AUTO', 'hi');
  assert(imgRes.hasImage === true, 'Registers image attachment payload');

  // Suite 6: User Exact Question Analysis Tests
  console.log('\n[Suite 6: Direct Question-to-Answer Intent Engine]');
  
  // Test 1: Greenhouse Farming
  const ghRes = await analyzeAgriQuery('Tell me about greenhouse farming.', null, 'AUTO', 'en');
  assert(ghRes.isUnrelated === false, 'Allows "Tell me about greenhouse farming" query');
  assert((ghRes.result.message || ghRes.result.assessment).toLowerCase().includes('greenhouse'), 'Returns direct Greenhouse response');
  assert(ghRes.result.title.includes('Greenhouse'), 'Title reflects Greenhouse Farming');

  // Test 2: How do I grow tomatoes?
  const tomGrow = await analyzeAgriQuery('How do I grow tomatoes?', null, 'AUTO', 'en');
  assert((tomGrow.result.message || tomGrow.result.assessment).toLowerCase().includes('tomato'), 'Answers tomato growing question directly');

  // Test 3: What fertilizer should I use for rice?
  const riceFert = await analyzeAgriQuery('What fertilizer should I use for rice?', null, 'AUTO', 'en');
  assert((riceFert.result.message || riceFert.result.assessment).includes('NPK') || (riceFert.result.message || riceFert.result.assessment).includes('Urea'), 'Answers rice fertilizer question directly');

  // Test 4: How often should I irrigate wheat?
  const wheatIrrig = await analyzeAgriQuery('How often should I irrigate wheat?', null, 'AUTO', 'en');
  assert((wheatIrrig.result.message || wheatIrrig.result.assessment).includes('Crown Root Initiation') || (wheatIrrig.result.message || wheatIrrig.result.assessment).includes('CRI'), 'Answers wheat irrigation stages directly');

  // Test 5: How can I control aphids on chilli plants?
  const aphidRes = await analyzeAgriQuery('How can I control aphids on chilli plants?', null, 'AUTO', 'en');
  assert((aphidRes.result.message || aphidRes.result.assessment).toLowerCase().includes('aphid') || (aphidRes.result.message || aphidRes.result.assessment).toLowerCase().includes('neem'), 'Answers aphid control question directly');

  // Test 6: What soil is suitable for onions?
  const onionSoil = await analyzeAgriQuery('What soil is suitable for onions?', null, 'AUTO', 'en');
  assert((onionSoil.result.message || onionSoil.result.assessment).toLowerCase().includes('sandy loam') || (onionSoil.result.message || onionSoil.result.assessment).toLowerCase().includes('onion'), 'Answers onion soil question directly');

  // Suite 7: Contextual Follow-up Guardrail Evaluation
  console.log('\n[Suite 7: Contextual Follow-up Guardrail Evaluation]');

  // Test A: Chilli yellow leaves -> How can I identify which nutrient is missing?
  const testA_history = [{ role: 'user', message: 'Why are my chilli leaves yellow?' }];
  const testA_res = await analyzeAgriQuery('How can I identify which nutrient is missing?', null, 'AUTO', 'en', testA_history);
  assert(testA_res.isUnrelated === false, 'Test A: Allows "How can I identify which nutrient is missing?" with chilli history');

  // Test B: Tomato white spots -> How should I treat them?
  const testB_history = [{ role: 'user', message: 'My tomato plants have white spots.' }];
  const testB_res = await analyzeAgriQuery('How should I treat them?', null, 'AUTO', 'en', testB_history);
  assert(testB_res.isUnrelated === false, 'Test B: Allows "How should I treat them?" with tomato white spots history');

  // Test C: Drip irrigation -> How often should I use it?
  const testC_history = [{ role: 'user', message: 'What is drip irrigation?' }];
  const testC_res = await analyzeAgriQuery('How often should I use it?', null, 'AUTO', 'en', testC_history);
  assert(testC_res.isUnrelated === false, 'Test C: Allows "How often should I use it?" with drip irrigation history');

  // Test D: Chilli farming -> Write a Java program (explicit non-agri intent)
  const testD_history = [{ role: 'user', message: 'Tell me about chilli farming.' }];
  const testD_res = await analyzeAgriQuery('Write a Java program.', null, 'AUTO', 'en', testD_history);
  assert(testD_res.isUnrelated === true, 'Test D: Blocks "Write a Java program." even with chilli farming history');

  // Test E: Crop yellow leaves -> What should I do?
  const testE_history = [{ role: 'user', message: 'My crop has yellow leaves.' }];
  const testE_res = await analyzeAgriQuery('What should I do?', null, 'AUTO', 'en', testE_history);
  assert(testE_res.isUnrelated === false, 'Test E: Allows "What should I do?" with crop yellow leaves history');

  // Suite 6: Single Service HTTP Endpoint Tests
  console.log('\n[Suite 6: Single Web Service Deployment Endpoints]');
  
  let testServer;
  let port;

  try {
    testServer = app.listen(0);
    port = testServer.address().port;
  } catch (e) {
    port = process.env.PORT || 5000;
  }

  try {
    // Health
    const healthRes = await makeRequest({ hostname: 'localhost', port, path: '/api/health', method: 'GET' });
    assert(healthRes.statusCode === 200, 'GET /api/health returns 200 OK');
    assert(healthRes.body.includes('AgriSphere AI Agriculture Engine'), 'Health returns AgriSphere service name');

    // Root SPA
    const rootRes = await makeRequest({ hostname: 'localhost', port, path: '/', method: 'GET' });
    assert(rootRes.statusCode === 200, 'GET / returns 200 OK HTML');
    assert(rootRes.body.includes('AgriSphere'), 'Root serves compiled AgriSphere React index.html');

    // SPA Routes
    const dashRes = await makeRequest({ hostname: 'localhost', port, path: '/dashboard', method: 'GET' });
    assert(dashRes.statusCode === 200, 'GET /dashboard returns 200 OK (SPA fallback)');

    const cropsRes = await makeRequest({ hostname: 'localhost', port, path: '/crops', method: 'GET' });
    assert(cropsRes.statusCode === 200, 'GET /crops returns 200 OK (SPA fallback)');

    const historyRes = await makeRequest({ hostname: 'localhost', port, path: '/consultations', method: 'GET' });
    assert(historyRes.statusCode === 200, 'GET /consultations returns 200 OK (SPA fallback)');

    // POST /api/analyze
    const payload = JSON.stringify({ queryText: 'What fertilizer is suitable for maize crop?', language: 'en' });
    const analyzeHttpRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);

    assert(analyzeHttpRes.statusCode === 200, 'POST /api/analyze returns 200 OK');
    assert(analyzeHttpRes.body.includes('Maize') || analyzeHttpRes.body.includes('Fertilizer'), 'API analyze returns agricultural assessment JSON');

  } catch (err) {
    console.error('❌ Error during HTTP tests:', err);
    failed++;
  } finally {
    if (testServer) testServer.close();
  }


  console.log(`\n======================================================`);
  console.log(`📊 AgriSphere Test Suite: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} assertions.`);
  console.log(`======================================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runAgriSphereTestSuite();
