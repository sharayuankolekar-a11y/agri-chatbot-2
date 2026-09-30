const axios = require('axios');

const SYSTEM_PROMPT = `You are ScamSniff, a specialized scam detection assistant.

Your ONLY purpose is to assess potentially fraudulent or suspicious messages, emails, URLs, job offers, internship offers, payment requests, social-media messages, and related online interactions.

You are NOT a generic assistant.

Analyze the supplied content carefully.

Identify:
- confirmed indicators
- suspicious indicators
- unknown/unverified information

Never claim something is definitely safe unless sufficient evidence exists.
Never claim a person or organization is definitely fraudulent without sufficient evidence.

Never request:
- passwords
- OTPs
- PINs
- CVV
- full card numbers
- banking credentials
- authentication tokens

Explain your reasoning in simple language suitable for non-technical users and students.
Provide practical safety actions.

Return ONLY valid JSON matching the following strict schema:
{
  "riskLevel": "LOW" | "SUSPICIOUS" | "HIGH",
  "riskScore": number (0 to 100),
  "category": "Phishing" | "Job/Internship Scam" | "Banking Scam" | "UPI/Payment Scam" | "Shopping Scam" | "Investment Scam" | "Social Media Scam" | "Government Impersonation" | "Prize/Lottery Scam" | "Fake Customer Support" | "Other Suspicious Activity",
  "confidence": number (0.0 to 1.0),
  "redFlags": [
    {
      "title": "string",
      "description": "string",
      "severity": "LOW" | "MEDIUM" | "HIGH"
    }
  ],
  "confirmedIndicators": ["string"],
  "suspiciousIndicators": ["string"],
  "unknownInformation": ["string"],
  "explanation": "string",
  "recommendedActions": ["string"]
}`;

async function callLLM(sanitizedContent, mode, ruleIndicators, urlAnalysis) {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null; // Triggers offline fallback analyzer
  }

  const model = process.env.LLM_MODEL || 'gpt-3.5-turbo';
  const baseUrl = (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');

  const userPrompt = `Analysis Request:
Mode: ${mode}
Content to inspect: "${sanitizedContent}"
Pre-screened Rule Indicators: ${JSON.stringify(ruleIndicators)}
Pre-screened URL Characteristics: ${JSON.stringify(urlAnalysis.allCharacteristics || [])}

Perform scam detection and return the result strictly as a JSON object adhering to the schema.`;

  try {
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      {
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 12000
      }
    );

    const jsonStr = response.data?.choices?.[0]?.message?.content;
    if (!jsonStr) return null;

    const parsed = JSON.parse(jsonStr);
    return validateAndCleanLLMResponse(parsed);
  } catch (err) {
    console.warn(`⚠️ LLM API call failed or timed out: ${err.message}. Using rule-based fallback analyzer.`);
    return null;
  }
}

function validateAndCleanLLMResponse(data) {
  if (!data || typeof data !== 'object') return null;

  // Validate riskLevel
  const validLevels = ['LOW', 'SUSPICIOUS', 'HIGH'];
  let riskLevel = (data.riskLevel || '').toUpperCase();
  if (!validLevels.includes(riskLevel)) {
    riskLevel = data.riskScore >= 66 ? 'HIGH' : data.riskScore >= 31 ? 'SUSPICIOUS' : 'LOW';
  }

  // Validate riskScore
  let riskScore = Number(data.riskScore);
  if (isNaN(riskScore) || riskScore < 0 || riskScore > 100) {
    riskScore = riskLevel === 'HIGH' ? 85 : riskLevel === 'SUSPICIOUS' ? 50 : 15;
  }

  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    category: data.category || 'Other Suspicious Activity',
    confidence: Math.min(Math.max(Number(data.confidence) || 0.85, 0), 1),
    redFlags: Array.isArray(data.redFlags) ? data.redFlags : [],
    confirmedIndicators: Array.isArray(data.confirmedIndicators) ? data.confirmedIndicators : [],
    suspiciousIndicators: Array.isArray(data.suspiciousIndicators) ? data.suspiciousIndicators : [],
    unknownInformation: Array.isArray(data.unknownInformation) ? data.unknownInformation : [],
    explanation: data.explanation || 'Content analysis completed.',
    recommendedActions: Array.isArray(data.recommendedActions) && data.recommendedActions.length > 0
      ? data.recommendedActions
      : ["Do not share passwords or OTPs.", "Verify sender details independently."]
  };
}

module.exports = {
  callLLM,
  SYSTEM_PROMPT
};
