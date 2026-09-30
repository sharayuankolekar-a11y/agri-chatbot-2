const { GoogleGenAI } = require('@google/genai');
const axios = require('axios');

const SYSTEM_PROMPT = `You are AgriSphere, an expert agriculture AI assistant dedicated to helping farmers, agronomists, and gardeners.

Answer the user's actual agriculture question accurately, directly, and thoroughly.

Supported Agriculture Topics:
- Crops & Cultivation (sowing, growing, harvesting, crop selection)
- Soil Health & Nutrients (pH, compost, soil prep, soil testing)
- Irrigation & Water Management (drip, sprinkler, schedule, water conservation)
- Fertilizers & Plant Nutrition (NPK ratios, organic manure, foliar spray, fertigation)
- Pest Control & Management (aphids, thrips, caterpillars, IPM, bio-pesticides, neem oil)
- Plant Health & Disease Diagnosis (early blight, leaf curl, rust, fungal/bacterial infections)
- Greenhouse & Protected Cultivation (polyhouse, shade net, microclimate control)
- Organic & Sustainable Farming
- Agricultural Weather Decisions & Tech (vertical farming, hydroponics, machinery)

Rules:
1. Only answer agricultural and farming queries.
2. If the user asks a non-agricultural question (e.g. programming, math, general trivia), politely decline and remind them that AgriSphere only handles farming and agriculture.
3. Provide practical, field-tested, step-by-step guidance for farmers.
4. Format response in JSON with the exact structure below.

Return JSON in this format:
{
  "message": "Direct, clear, comprehensive answer to the user's exact question formatted with clear paragraphs, bullet points, or numbered steps when appropriate.",
  "title": "Concise topic heading (e.g. Tomato Early Blight Control, Greenhouse Farming Guide)",
  "category": "Topic category (e.g. Plant Disease, Irrigation Guidance, Fertilizers & Soil, Crop Cultivation, Pest Management, Greenhouse)",
  "crop": "Specific crop name if applicable (e.g. Tomato, Rice, Wheat, Onion, Chilli) or null",
  "warnings": ["Subtle warnings or precautions if relevant"],
  "recommendedActions": ["Step 1", "Step 2", "Step 3"],
  "followUpQuestion": "A helpful follow-up question for the farmer"
}`;

const LANG_MAP = {
  en: 'English',
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिंदी)',
  te: 'Telugu (తెలుగు)',
  ta: 'Tamil (தமிழ்)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)'
};

/**
 * Parses image base64 into mimeType and raw base64 data for Gemini inlineData
 */
function parseBase64Image(imageBase64) {
  if (!imageBase64 || typeof imageBase64 !== 'string') return null;
  let mimeType = 'image/jpeg';
  let data = imageBase64;

  if (imageBase64.startsWith('data:')) {
    const parts = imageBase64.split(';base64,');
    if (parts.length === 2) {
      mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      data = parts[1];
    }
  }

  if (!data || data.trim() === '') return null;
  return { inlineData: { mimeType, data } };
}

/**
 * Calls Google Gemini API using official @google/genai SDK.
 * Fallback to OpenAI format if OPENAI_API_KEY is supplied instead.
 * Returns normalized object or null (triggering offline fallback engine).
 */
async function callAgriLLM(queryText, imageBase64 = null, language = 'en', history = []) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const genericLlmKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;

  const targetLang = LANG_MAP[language] || 'English';

  // 1. Primary: Use Official Google Gemini API via @google/genai
  if (geminiKey && geminiKey.trim() !== '') {
    console.log('Gemini API: ENABLED');
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey.trim() });
      const candidateModels = Array.from(new Set([
        process.env.GEMINI_MODEL,
        'gemini-3.5-flash-lite',
        'gemini-3.5-flash',
        'gemini-3.8-flash',
        'gemini-2.5-flash'
      ])).filter(Boolean);

      const contents = [];

      // Add conversation history if available
      if (Array.isArray(history) && history.length > 0) {
        for (const msg of history.slice(-6)) {
          const role = (msg.role === 'user' || msg.sender === 'user') ? 'user' : 'model';
          const text = msg.message || msg.content || msg.text || '';
          if (text) {
            contents.push({ role, parts: [{ text }] });
          }
        }
      }

      // Build current user prompt parts
      const userParts = [];
      const userPromptText = `User Agriculture Question: "${queryText || 'Analyze attached crop image'}"\nTarget Response Language: Please write your response in ${targetLang}.\nAnalyze and output JSON matching system schema.`;
      userParts.push({ text: userPromptText });

      // Add inline image if attached
      const imagePart = parseBase64Image(imageBase64);
      if (imagePart) {
        userParts.push(imagePart);
      }

      contents.push({ role: 'user', parts: userParts });

      let response = null;
      let usedModel = null;
      let lastErr = null;

      for (const modelName of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: SYSTEM_PROMPT,
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          });
          usedModel = modelName;
          break;
        } catch (err) {
          lastErr = err;
          console.warn(`⚠️ Model ${modelName} call failed (${err.message.substring(0, 80)}). Trying fallback candidate...`);
        }
      }

      if (!response) {
        throw lastErr || new Error('All Gemini models failed');
      }

      console.log(`Gemini API: response received from ${usedModel}`);

      const jsonText = response?.text;
      if (!jsonText) {
        console.warn('⚠️ Gemini API returned empty response text.');
        return null;
      }

      const parsed = JSON.parse(jsonText);
      const cleaned = validateAndCleanAgriResponse(parsed);
      if (cleaned) {
        cleaned.source = 'GEMINI';
        cleaned.model = usedModel;
      }
      return cleaned;
    } catch (geminiErr) {
      console.warn(`⚠️ Google Gemini API call failed (${geminiErr.message}). Switching to fallback mechanism.`);
      // Continue to check generic LLM key or fallback to offline engine
    }
  }

  // 2. Secondary Fallback: OpenAI-compatible API if LLM_API_KEY or OPENAI_API_KEY is provided
  if (genericLlmKey && genericLlmKey.trim() !== '') {
    try {
      const model = process.env.LLM_MODEL || 'gpt-4o-mini';
      const baseUrl = (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');

      const userContent = [];
      userContent.push({
        type: 'text',
        text: `User Agriculture Question: "${queryText}"\nSelected Language for Response: ${targetLang}\nAnalyze and return structured JSON matching system schema.`
      });

      if (imageBase64) {
        userContent.push({
          type: 'image_url',
          image_url: {
            url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
          }
        });
      }

      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userContent }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${genericLlmKey.trim()}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const jsonStr = response.data?.choices?.[0]?.message?.content;
      if (!jsonStr) return null;

      const parsed = JSON.parse(jsonStr);
      return validateAndCleanAgriResponse(parsed);
    } catch (llmErr) {
      console.warn(`⚠️ Secondary LLM API call failed: ${llmErr.message}. Switching to offline agriculture engine.`);
      return null;
    }
  }

  // No API key configured -> Trigger offline engine
  return null;
}

function validateAndCleanAgriResponse(data) {
  if (!data || typeof data !== 'object') return null;

  const msg = data.message || data.assessment || data.answer || 'Agricultural guidance completed.';
  return {
    message: msg,
    assessment: msg,
    title: data.title || data.crop || 'Agricultural Advisory',
    category: data.category || 'General Agriculture',
    crop: data.crop || null,
    confidence: Number(data.confidence) || null,
    symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
    possibleCauses: Array.isArray(data.possibleCauses) ? data.possibleCauses : [],
    recommendedActions: Array.isArray(data.recommendedActions) ? data.recommendedActions : [],
    prevention: Array.isArray(data.prevention) ? data.prevention : [],
    warnings: Array.isArray(data.warnings) ? data.warnings : [],
    followUpQuestion: data.followUpQuestion || null
  };
}

module.exports = {
  callAgriLLM,
  SYSTEM_PROMPT
};
