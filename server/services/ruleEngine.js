/**
 * Rule-Based Scam Indicator Engine
 * Detects patterns for urgency, sensitive requests, advance payments, lottery/rewards,
 * internship fees, phishing triggers, and brand impersonation.
 */

const INDICATOR_RULES = [
  {
    key: 'URGENCY',
    category: 'Urgency',
    patterns: [
      /immediately/i, /urgent/i, /act now/i, /expires today/i, /last chance/i,
      /within \d+ minutes?/i, /within 24 hours?/i, /limited time/i, /account suspended/i,
      /immediate action/i, /hurry up/i, /before midnight/i
    ],
    title: 'Urgent pressures',
    description: 'The message pressures you to act quickly before thinking or verifying.',
    severity: 'HIGH',
    scoreImpact: 25
  },
  {
    key: 'SENSITIVE_INFO',
    category: 'Sensitive Information Request',
    patterns: [
      /\bOTP\b/i, /\bPIN\b/i, /\bCVV\b/i, /password/i, /card number/i,
      /banking credentials/i, /login credentials/i, /authentication code/i,
      /share.*otp/i, /send.*otp/i, /tell me.*otp/i, /bank details/i, /asking.*for.*otp/i
    ],
    title: 'Sensitive credential request',
    description: 'Asks for secrets like OTP, PIN, password, or card security details.',
    severity: 'HIGH',
    scoreImpact: 50
  },
  {
    key: 'ADVANCE_PAYMENT',
    category: 'Advance Payment Request',
    patterns: [
      /registration fee/i, /processing fee/i, /security deposit/i, /advance payment/i,
      /refundable fee/i, /pay ₹?\d+/i, /transfer ₹?\d+/i, /upi payment/i, /qr payment/i,
      /gift cards?/i, /training fee/i, /verification fee/i
    ],
    title: 'Upfront payment demanded',
    description: 'Asks you to send money upfront before receiving a reward, job, or service.',
    severity: 'HIGH',
    scoreImpact: 45
  },
  {
    key: 'UNREALISTIC_REWARD',
    category: 'Unrealistic Reward / Lottery',
    patterns: [
      /congratulations/i, /lottery/i, /you'?ve won/i, /prize/i, /cashback/i,
      /selected for reward/i, /claim your ₹?\d+/i, /lucky winner/i, /free gift/i,
      /bonus credit/i
    ],
    title: 'Unrealistic or unearned reward',
    description: 'Promises large sums of money, lottery wins, or prizes unexpectedly.',
    severity: 'HIGH',
    scoreImpact: 35
  },
  {
    key: 'JOB_INTERNSHIP_SCAM',
    category: 'Fake Job / Internship Scam',
    patterns: [
      /internship application.*shortlisted/i, /guaranteed job/i, /guaranteed salary/i,
      /unrealistic salary/i, /work from home.*earn ₹?\d+/i, /part-time job.*daily ₹/i,
      /pay.*confirm.*position/i, /pay.*registration fee/i, /pay.*offer letter/i,
      /telegram recruiter/i, /whatsapp recruiter/i, /shortlisted/i
    ],
    title: 'Suspicious job/internship offer terms',
    description: 'Requires payment for job offers, training certificates, or guarantees easy high income.',
    severity: 'HIGH',
    scoreImpact: 45
  },
  {
    key: 'PHISHING_SUSPENSION',
    category: 'Phishing & Account Takeover',
    patterns: [
      /kyc expired/i, /account blocked/i, /verify account/i, /login immediately/i,
      /suspicious login/i, /password reset required/i, /account suspension/i,
      /pan card link/i, /update details now/i, /click this link/i
    ],
    title: 'Phishing trap / Fake account suspension',
    description: 'Falsely claims an account or KYC has expired to force immediate login via a link.',
    severity: 'HIGH',
    scoreImpact: 45
  },
  {
    key: 'IMPERSONATION',
    category: 'Brand / Authority Impersonation',
    patterns: [
      /\b(HDFC|SBI|ICICI|Axis|Kotak)\s*Bank\b/i, /\bIncome Tax\b/i, /\bCustoms Department\b/i,
      /\bFedEx\b/i, /\bBlueDart\b/i, /\bDHL\b/i, /\bIndia Post\b/i, /\bAmazon Security\b/i,
      /\bFlipkart Support\b/i, /\bPaytm Security\b/i, /\bPhonePe Support\b/i, /\bGoogle Pay\b/i,
      /\bRBI\b/i, /\bPolice\b/i, /\bgovernment\b/i
    ],
    title: 'Brand / Authority reference',
    description: 'References trusted institutions (banks, government, couriers, payment apps) to build false trust.',
    severity: 'MEDIUM',
    scoreImpact: 15
  }
];

function analyzeRules(content) {
  if (!content) return { indicators: [], score: 0, redFlags: [] };

  const matchedIndicators = [];
  const redFlags = [];
  let totalScore = 0;

  for (const rule of INDICATOR_RULES) {
    let matched = false;
    for (const pattern of rule.patterns) {
      if (pattern.test(content)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      matchedIndicators.push(rule.category);
      redFlags.push({
        title: rule.title,
        description: rule.description,
        severity: rule.severity
      });
      totalScore += rule.scoreImpact;
    }
  }

  // Cap initial rule score at 98
  totalScore = Math.min(totalScore, 98);

  return {
    indicators: matchedIndicators,
    score: totalScore,
    redFlags
  };
}

module.exports = {
  analyzeRules,
  INDICATOR_RULES
};
