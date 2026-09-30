/**
 * AgriSphere Agriculture Domain Guardrail Classifier
 * Strictly enforces that AgriSphere only responds to agriculture, crop, soil, farming,
 * pest, disease, weather, and livestock related queries.
 * Supports conversational context evaluation for follow-up messages.
 */

const UNRELATED_PATTERNS = [
  /write.*code/i, /java\b/i, /python\b/i, /javascript\b/i, /c\+\+/i, /html\b/i, /program\b/i,
  /tell me a joke/i, /who won/i, /football/i, /cricket match/i, /movie/i,
  /capital of/i, /write.*resume/i, /write.*essay/i, /math problem/i,
  /stock market/i, /crypto\b/i, /bitcoin/i, /relationship advice/i,
  /recipe for pizza/i, /who is the president/i, /who is prime minister/i
];

const AGRI_KEYWORDS = [
  'crop', 'soil', 'irrigation', 'water', 'fertilizer', 'pest', 'disease', 'blight',
  'aphid', 'harvest', 'sowing', 'seed', 'rice', 'paddy', 'wheat', 'maize', 'corn', 'tomato', 'potato',
  'onion', 'chilli', 'chili', 'pepper', 'cotton', 'sugarcane', 'banana', 'coconut', 'pulse', 'gram',
  'chickpea', 'lentil', 'bean', 'vegetable', 'fruit', 'weather', 'season', 'farm', 'yield',
  'organic', 'compost', 'npk', 'nitrogen', 'potassium', 'phosphorus', 'livestock', 'cattle',
  'dairy', 'goat', 'poultry', 'yellowing', 'yellow', 'leaves', 'leaf', 'wilt', 'fungus', 'weed',
  'rot', 'insect', 'field', 'cultivation', 'grow', 'growing', 'monsoon', 'rain', 'pesticide',
  'fungicide', 'manure', 'tractor', 'plow', 'drip', 'spot', 'spots', 'nutrient', 'nutrients',
  'deficiency', 'deficiencies', 'greenhouse', 'polyhouse', 'hydroponics'
];

/**
 * Checks if a query is unrelated to agriculture.
 * @param {string} text - Current query text
 * @param {Array} history - Recent conversation history
 * @returns {boolean} - true if unrelated (reject), false if agricultural (allow)
 */
function isUnrelatedQuery(text, history = []) {
  if (!text || typeof text !== 'string') return true;
  const trimmed = text.trim();

  // 1. Explicit unrelated intent check (ALWAYS BLOCKED regardless of history)
  if (UNRELATED_PATTERNS.some(regex => regex.test(trimmed))) {
    return true;
  }

  // 2. Direct agricultural keyword check on current query
  const lower = trimmed.toLowerCase();
  const hasDirectAgriKeyword = AGRI_KEYWORDS.some(kw => lower.includes(kw));
  if (hasDirectAgriKeyword) {
    return false;
  }

  // 3. Greetings allowed
  if (/^(hi|hello|hey|who are you|how are you)\??$/i.test(trimmed)) {
    return false; // Allowed greeting
  }

  // 4. Contextual evaluation using conversation history:
  // If recent conversation history contains agricultural terms, evaluate follow-up in context
  if (Array.isArray(history) && history.length > 0) {
    const historyText = history
      .map(item => {
        if (typeof item === 'string') return item;
        return item.message || item.content || item.text || (item.result?.message) || (item.result?.assessment) || '';
      })
      .join(' ')
      .toLowerCase();

    const historyHasAgriKeyword = AGRI_KEYWORDS.some(kw => historyText.includes(kw));
    if (historyHasAgriKeyword) {
      // Prior conversation was agricultural and current query is NOT explicitly unrelated -> Allow as valid follow-up
      return false;
    }
  }

  // 5. Short general queries without agri terms or agricultural history context -> Reject
  if (trimmed.length < 50 && !/(grow|plant|field|land|season|water|leaf|green|yellow|brown|white|spot|bug|rot|soil|farm|treat|fix|prevent|nutrient|irrigate|water|pest)/i.test(lower)) {
    return true;
  }

  return false;
}

const GUARDRAIL_REJECTION_MESSAGE = "I'm AgriSphere, an agriculture-focused assistant. I can help with crops, soil, irrigation, fertilizers, pests, diseases, farming practices, and other agriculture topics.";

module.exports = {
  isUnrelatedQuery,
  GUARDRAIL_REJECTION_MESSAGE
};
