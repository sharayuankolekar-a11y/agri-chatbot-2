/**
 * Sensitive Data Redactor Service
 * Redacts OTPs, PINs, passwords, card numbers, and credentials before processing or saving.
 */

function redactSensitiveData(text) {
  if (!text || typeof text !== 'string') return '';

  let sanitized = text;

  // 1. Redact OTPs (e.g., OTP: 583921, OTP 123456, code is 492019, 6-digit standalone OTPs with OTP context)
  sanitized = sanitized.replace(/(OTP\s*[:=\-]?\s*)(\d{4,8})/gi, '$1[REDACTED_OTP]');
  sanitized = sanitized.replace(/(verification code\s*[:=\-]?\s*)(\d{4,8})/gi, '$1[REDACTED_CODE]');
  sanitized = sanitized.replace(/(code is\s*[:=\-]?\s*)(\d{4,8})/gi, '$1[REDACTED_CODE]');

  // 2. Redact Credit / Debit Card numbers (13-19 digits, spaced or hyphenated)
  sanitized = sanitized.replace(/\b(?:\d[ -]*?){13,19}\b/g, (match) => {
    // Only replace if looks like a card number pattern
    const digitsOnly = match.replace(/[\s-]/g, '');
    if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
      return '[REDACTED_CARD_NUMBER]';
    }
    return match;
  });

  // 3. Redact CVV / CVC numbers
  sanitized = sanitized.replace(/(CVV\d?|CVC\d?|security code)\s*[:=\-]?\s*(\d{3,4})/gi, '$1: [REDACTED_CVV]');

  // 4. Redact PIN numbers
  sanitized = sanitized.replace(/(ATM PIN|UPI PIN|security PIN|PIN)\s*[:=\-]?\s*(\d{4,6})/gi, '$1: [REDACTED_PIN]');

  // 5. Redact Passwords
  sanitized = sanitized.replace(/(password|passwd|pwd)\s*[:=\-]?\s*([^\s,;]+)/gi, '$1: [REDACTED_PASSWORD]');

  return sanitized;
}

module.exports = {
  redactSensitiveData
};
