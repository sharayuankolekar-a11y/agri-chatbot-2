/**
 * URL Security Analysis Engine
 * Extracts and inspects URLs for suspicious domain structures, shorteners, HTTP usage, and lookalikes.
 */

const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy', 'is.gd', 'shorturl.at',
  'ow.ly', 'buff.ly', 'tiny.cc', 'bc.vc', 'adf.ly'
];

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.online', '.site', '.club', '.work', '.tech', '.vip',
  '.cc', '.fun', '.monster', '.icu', '.gq', '.ml', '.cf', '.tk', '.ga', '.rest'
];

const BRAND_KEYWORDS = [
  'bank', 'paytm', 'phonepe', 'gpay', 'sbi', 'hdfc', 'icici', 'axis',
  'amazon', 'flipkart', 'kyc', 'verify', 'secure', 'login', 'support', 'update'
];

function extractUrls(text) {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(?:xyz|top|online|site|com|net|org|in|co|info|biz)[^\s]*)/gi;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches));
}

function analyzeUrl(urlStr) {
  const result = {
    url: urlStr,
    hasUrl: true,
    isHttps: false,
    isShortened: false,
    hasIpHost: false,
    excessiveSubdomains: false,
    excessiveHyphens: false,
    suspiciousTld: false,
    hasBrandKeyword: false,
    isPunycode: false,
    suspiciousCharacteristics: [],
    riskScoreContribution: 0
  };

  try {
    let formattedUrl = urlStr;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'http://' + formattedUrl;
    }

    const parsed = new URL(formattedUrl);
    const hostname = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol.toLowerCase();

    // 1. Check HTTPS
    result.isHttps = protocol === 'https:';
    if (!result.isHttps) {
      result.suspiciousCharacteristics.push('Insecure connection (HTTP instead of HTTPS)');
      result.riskScoreContribution += 15;
    }

    // 2. IP Address check
    const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(hostname)) {
      result.hasIpHost = true;
      result.suspiciousCharacteristics.push('Direct IP address used as hostname instead of registered domain');
      result.riskScoreContribution += 30;
    }

    // 3. URL Shortener check
    if (URL_SHORTENERS.some(s => hostname.includes(s))) {
      result.isShortened = true;
      result.suspiciousCharacteristics.push('URL shortener hides actual destination domain');
      result.riskScoreContribution += 20;
    }

    // 4. Excessive Subdomains (e.g., paytm.security.verify.login.example.com)
    const parts = hostname.split('.');
    if (parts.length > 3) {
      result.excessiveSubdomains = true;
      result.suspiciousCharacteristics.push(`Multiple subdomains detected (${parts.length} levels)`);
      result.riskScoreContribution += 20;
    }

    // 5. Excessive Hyphens in domain (e.g., secure-bank-login-verify.com)
    const hyphenCount = (hostname.match(/-/g) || []).length;
    if (hyphenCount >= 2) {
      result.excessiveHyphens = true;
      result.suspiciousCharacteristics.push('Excessive hyphens in domain name (common lookalike phishing technique)');
      result.riskScoreContribution += 20;
    }

    // 6. Suspicious TLD check
    if (SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld))) {
      result.suspiciousTld = true;
      result.suspiciousCharacteristics.push(`Suspicious or high-risk top-level domain (${parts[parts.length - 1]})`);
      result.riskScoreContribution += 20;
    }

    // 7. Brand keyword in domain/path
    if (BRAND_KEYWORDS.some(kw => hostname.includes(kw) || parsed.pathname.includes(kw))) {
      result.hasBrandKeyword = true;
      result.suspiciousCharacteristics.push('Contains brand/security keywords (e.g. bank, kyc, verify, paytm, login)');
      result.riskScoreContribution += 15;
    }

    // 8. Punycode check
    if (hostname.includes('xn--')) {
      result.isPunycode = true;
      result.suspiciousCharacteristics.push('Punycode encoded domain (homograph attack risk)');
      result.riskScoreContribution += 25;
    }

  } catch (err) {
    result.suspiciousCharacteristics.push('Malformed or unparseable URL structure');
    result.riskScoreContribution += 10;
  }

  return result;
}

function analyzeAllUrls(text) {
  const urls = extractUrls(text);
  if (urls.length === 0) {
    return {
      hasUrls: false,
      urls: [],
      combinedScoreContribution: 0,
      allCharacteristics: []
    };
  }

  const urlAnalyses = urls.map(u => analyzeUrl(u));
  let combinedScore = 0;
  const allCharacteristics = [];

  for (const analysis of urlAnalyses) {
    combinedScore += analysis.riskScoreContribution;
    allCharacteristics.push(...analysis.suspiciousCharacteristics);
  }

  return {
    hasUrls: true,
    urls: urlAnalyses,
    combinedScoreContribution: Math.min(combinedScore, 40),
    allCharacteristics: Array.from(new Set(allCharacteristics))
  };
}

module.exports = {
  extractUrls,
  analyzeUrl,
  analyzeAllUrls
};
