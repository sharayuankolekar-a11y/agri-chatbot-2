/**
 * Master Scam Analyzer Service
 * Orchestrates Redaction, Rule Engine, URL Inspection, LLM API calls, and Offline Fallback.
 */

const { redactSensitiveData } = require('./redactor');
const { analyzeRules } = require('./ruleEngine');
const { analyzeAllUrls } = require('./urlAnalyzer');
const { callLLM } = require('./llmService');

const UNRELATED_PATTERNS = [
  /^hi$/i, /^hello$/i, /^hey$/i, /^who are you\??$/i,
  /what is the weather/i, /write a (code|script|essay|story)/i,
  /capital of/i, /tell me a joke/i, /how to cook/i, /solve this math/i
];

function isUnrelatedGeneralQuery(text) {
  const trimmed = text.trim();
  if (UNRELATED_PATTERNS.some(regex => regex.test(trimmed))) {
    return true;
  }
  // Very short non-scam greetings
  if (trimmed.length < 15 && !/(scam|link|pay|fee|win|won|otp|bank|job|offer|http|www|\.com)/i.test(trimmed)) {
    return true;
  }
  return false;
}

async function analyzeScam(rawContent, requestedMode = 'AUTO') {
  if (!rawContent || rawContent.trim() === '') {
    throw new Error('Content to analyze cannot be empty.');
  }

  // 1. Check for unrelated generic queries
  if (isUnrelatedGeneralQuery(rawContent)) {
    return {
      isUnrelated: true,
      message: "I'm built specifically to sniff out scams. Paste the message, link, offer, or payment request you're concerned about and I'll check it.",
      result: null
    };
  }

  // 2. Redact sensitive input
  const sanitizedContent = redactSensitiveData(rawContent);

  // 3. Perform Rule Engine inspection
  const ruleResult = analyzeRules(sanitizedContent);

  // 4. Perform URL inspection
  const urlResult = analyzeAllUrls(sanitizedContent);

  // 5. Determine Mode if AUTO
  let effectiveMode = requestedMode;
  if (requestedMode === 'AUTO') {
    if (urlResult.hasUrls && sanitizedContent.length < 120) {
      effectiveMode = 'LINK';
    } else if (/(internship|job|recruiter|hiring|salary|stipend)/i.test(sanitizedContent)) {
      effectiveMode = 'INTERNSHIP';
    } else if (/(payment|pay|fee|upi|qr|deposit|transfer|refund|bank)/i.test(sanitizedContent)) {
      effectiveMode = 'PAYMENT';
    } else {
      effectiveMode = 'MESSAGE';
    }
  }

  // 6. Try LLM Call first
  let llmAnalysis = await callLLM(sanitizedContent, effectiveMode, ruleResult.indicators, urlResult);

  // 7. If LLM unavailable/failed, use Offline Fallback Engine
  if (!llmAnalysis) {
    llmAnalysis = generateOfflineAnalysis(sanitizedContent, effectiveMode, ruleResult, urlResult);
  }

  return {
    isUnrelated: false,
    sanitizedContent,
    result: {
      mode: effectiveMode,
      ...llmAnalysis
    }
  };
}

function generateOfflineAnalysis(content, mode, ruleResult, urlResult) {
  let riskScore = ruleResult.score + urlResult.combinedScoreContribution;
  const redFlags = [...ruleResult.redFlags];
  const confirmedIndicators = [];
  const suspiciousIndicators = [];
  const unknownInformation = [];

  // Add URL characteristics to red flags
  if (urlResult.hasUrls) {
    for (const char of urlResult.allCharacteristics) {
      redFlags.push({
        title: 'Suspicious URL characteristic',
        description: char,
        severity: 'HIGH'
      });
      suspiciousIndicators.push(char);
    }
  }

  // Check for OTP / Credential requests for refunds or payments (Demo 4)
  if (/(otp|pin|password|cvv)/i.test(content)) {
    confirmedIndicators.push('Sensitive authentication credential requested');
    if (/(refund|transfer|receive|pay|bank|upi)/i.test(content)) {
      if (!redFlags.some(rf => rf.title.toLowerCase().includes('otp') || rf.title.toLowerCase().includes('credential'))) {
        redFlags.push({
          title: 'OTP / Credential requested for transaction or refund',
          description: 'You NEVER need to share an OTP or PIN to receive money or refunds. Sharing OTPs causes immediate account takeover.',
          severity: 'HIGH'
        });
      }
      riskScore += 40;
    }
  }

  // Mode specific checks for internships (Demo 2)
  if (mode === 'INTERNSHIP' && /(fee|deposit|registration|pay)/i.test(content)) {
    if (!redFlags.some(rf => rf.title.toLowerCase().includes('internship'))) {
      redFlags.push({
        title: 'Upfront registration fee required for internship',
        description: 'Legitimate employers and internship providers do not charge applicants fees.',
        severity: 'HIGH'
      });
    }
    riskScore += 30;
  }

  // Determine final risk level & category
  riskScore = Math.min(Math.max(riskScore, 0), 99);

  let riskLevel = 'LOW';
  if (riskScore >= 66) {
    riskLevel = 'HIGH';
  } else if (riskScore >= 31) {
    riskLevel = 'SUSPICIOUS';
  } else {
    // Clean message
    riskScore = Math.max(riskScore, 10);
  }

  // Infer Category
  let category = 'Other Suspicious Activity';
  if (ruleResult.indicators.includes('Fake Job / Internship Scam') || mode === 'INTERNSHIP') {
    category = 'Job/Internship Scam';
  } else if (ruleResult.indicators.includes('Unrealistic Reward / Lottery')) {
    category = 'Prize/Lottery Scam';
  } else if (ruleResult.indicators.includes('Phishing & Account Takeover') || urlResult.hasUrls) {
    category = 'Phishing';
  } else if (ruleResult.indicators.includes('Sensitive Information Request') && /(otp|pin|password)/i.test(content)) {
    category = 'UPI/Payment Scam';
  } else if (ruleResult.indicators.includes('Advance Payment Request') || mode === 'PAYMENT') {
    category = 'UPI/Payment Scam';
  } else if (ruleResult.indicators.includes('Brand / Authority Impersonation')) {
    category = 'Government Impersonation';
  }

  // Generate simple language explanation
  let explanation = '';
  if (riskLevel === 'HIGH') {
    explanation = 'This content exhibits multiple classic scam indicators, including pressure tactics, payment requests, or suspicious links. Exercise extreme caution.';
  } else if (riskLevel === 'SUSPICIOUS') {
    explanation = 'Some warning signs were detected in this message. While not conclusively a scam, independent verification is strongly recommended before taking any action.';
  } else {
    explanation = 'No obvious scam indicators were identified based on the provided text. However, always exercise care when interacting with unknown senders.';
  }

  // Practical safety actions
  const recommendedActions = [];
  if (riskLevel === 'HIGH' || riskLevel === 'SUSPICIOUS') {
    if (urlResult.hasUrls) recommendedActions.push("Do not click any embedded links.");
    if (/(fee|pay|deposit|money|upi)/i.test(content)) recommendedActions.push("Do not transfer money or pay registration fees.");
    if (/(otp|pin|password)/i.test(content)) recommendedActions.push("Never share OTPs, PINs, or passwords with anyone.");
    recommendedActions.push("Verify the sender by visiting their official organization website directly.");
    recommendedActions.push("Block and report the suspicious sender if appropriate.");
  } else {
    recommendedActions.push("Double-check the sender's email address or phone number.");
    recommendedActions.push("Do not share personal financial details over text or chat.");
  }

  if (unknownInformation.length === 0) {
    unknownInformation.push("Sender identity and official domain registration details could not be independently verified.");
  }

  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    category,
    confidence: 0.88,
    redFlags,
    confirmedIndicators,
    suspiciousIndicators,
    unknownInformation,
    explanation,
    recommendedActions
  };
}

module.exports = {
  analyzeScam,
  generateOfflineAnalysis,
  isUnrelatedGeneralQuery
};
