const { redactSensitiveData } = require('../services/redactor');
const { analyzeRules } = require('../services/ruleEngine');
const { analyzeAllUrls } = require('../services/urlAnalyzer');
const { analyzeScam, isUnrelatedGeneralQuery } = require('../services/scamAnalyzer');

async function runTests() {
  console.log('🧪 Starting ScamSniff Automated Test Suite...\n');
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

  // Test 1: Sensitive Data Redaction
  console.log('[Suite 1: Sensitive Data Redactor]');
  const rawInput1 = "My OTP: 583921 and password secret123, card 4532-1100-2200-3300, PIN 4321";
  const redacted1 = redactSensitiveData(rawInput1);
  assert(!redacted1.includes('583921'), 'Redacts 6-digit OTP code');
  assert(!redacted1.includes('secret123'), 'Redacts plain password');
  assert(!redacted1.includes('4532-1100-2200-3300'), 'Redacts credit card number');

  // Test 2: Rule Engine Urgency & Payment Request
  console.log('\n[Suite 2: Rule Engine]');
  const rulesResult = analyzeRules("Pay ₹299 processing fee immediately to claim reward expires today");
  assert(rulesResult.indicators.includes('Urgency'), 'Detects Urgency rule');
  assert(rulesResult.indicators.includes('Advance Payment Request'), 'Detects Advance Payment Request rule');
  assert(rulesResult.score >= 40, 'Calculates non-zero risk score for scam keywords');

  // Test 3: URL Analyzer
  console.log('\n[Suite 3: URL Analyzer]');
  const urlResult = analyzeAllUrls("Check link http://secure-bank-login-verify.top/kyc");
  assert(urlResult.hasUrls === true, 'Extracts URL from text');
  assert(urlResult.allCharacteristics.some(c => c.includes('HTTP')), 'Flags non-HTTPS link');
  assert(urlResult.allCharacteristics.some(c => c.includes('top')), 'Flags suspicious .top TLD');

  // Test 4: Demo 1 - Prize Scam Detection
  console.log('\n[Suite 4: Prize Scam Detection]');
  const demo1 = await analyzeScam("Congratulations! You have been selected for a ₹50,000 government reward. Pay ₹299 processing fee immediately.", "AUTO");
  assert(demo1.result.riskLevel === 'HIGH', 'Classifies Prize Scam as HIGH risk');
  assert(demo1.result.riskScore >= 80, 'Score is >= 80 for Prize Scam');
  assert(demo1.result.category.toLowerCase().includes('prize') || demo1.result.category.toLowerCase().includes('payment'), 'Categorizes as Prize/Payment scam');

  // Test 5: Demo 2 - Internship Fee Scam
  console.log('\n[Suite 5: Internship Registration Fee Scam]');
  const demo2 = await analyzeScam("Your internship application has been shortlisted. Pay ₹1,500 registration fee to confirm your position.", "INTERNSHIP");
  assert(demo2.result.riskLevel === 'HIGH', 'Classifies Internship Fee request as HIGH risk');
  assert(demo2.result.category === 'Job/Internship Scam', 'Categorizes as Job/Internship Scam');

  // Test 6: Demo 3 - KYC Phishing
  console.log('\n[Suite 6: KYC Phishing]');
  const demo3 = await analyzeScam("Your bank KYC has expired. Click this link immediately to avoid account suspension: http://secure-bank-kyc.top/login", "LINK");
  assert(demo3.result.riskLevel === 'HIGH', 'Classifies KYC Phishing link as HIGH risk');

  // Test 7: Demo 4 - OTP Refund Request
  console.log('\n[Suite 7: OTP Request]');
  const demo4 = await analyzeScam("Someone is asking me for an OTP to process my refund.", "PAYMENT");
  assert(demo4.result.riskLevel === 'HIGH', 'Classifies OTP request as HIGH risk');

  // Test 8: Demo 5 - Safe Message
  console.log('\n[Suite 8: Safe Message]');
  const demo5 = await analyzeScam("Hi Team, please find attached the slide deck for our project presentation scheduled for tomorrow at 10 AM. Regards, Alex.", "AUTO");
  assert(demo5.result.riskLevel === 'LOW', 'Classifies normal corporate email as LOW risk');
  assert(demo5.result.riskScore <= 30, 'Risk score is <= 30 for safe message');

  // Test 9: Unrelated General Query Redirection
  console.log('\n[Suite 9: Unrelated Query Handler]');
  const isUnrelated = isUnrelatedGeneralQuery("What is the capital of France?");
  assert(isUnrelated === true, 'Identifies unrelated general question');

  // Test 10: Empty Input Handling
  console.log('\n[Suite 10: Empty Input Error Handling]');
  try {
    await analyzeScam("", "AUTO");
    assert(false, 'Throws error for empty input');
  } catch (e) {
    assert(true, 'Correctly throws error for empty input');
  }

  console.log(`\n======================================================`);
  console.log(`📊 Test Results: ${passed} PASSED, ${failed} FAILED out of ${passed + failed} assertions.`);
  console.log(`======================================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
