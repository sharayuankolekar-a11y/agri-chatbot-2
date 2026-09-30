/**
 * AgriSphere Master Agriculture Analyzer Service
 * Coordinates Domain Guardrail Checking, Vision/Text LLM API calls,
 * and Expert Offline Agriculture Analysis.
 */

const { isUnrelatedQuery, GUARDRAIL_REJECTION_MESSAGE } = require('./agriClassifier');
const { callAgriLLM } = require('./agriLLMService');

async function analyzeAgriQuery(rawQuery, imageBase64 = null, mode = 'AUTO', language = 'en', history = []) {
  if (!rawQuery && !imageBase64) {
    throw new Error('Please provide an agricultural question or crop image for analysis.');
  }

  const queryText = rawQuery ? rawQuery.trim() : 'Analyze attached crop image';

  // 1. Enforce Agriculture Domain Guardrail Rejection (with Context)
  if (isUnrelatedQuery(queryText, history) && !imageBase64) {
    return {
      isUnrelated: true,
      message: GUARDRAIL_REJECTION_MESSAGE,
      result: null
    };
  }

  // 2. Try LLM Call (Supports Gemini Vision/Text API)
  let llmAnalysis = await callAgriLLM(queryText, imageBase64, language, history);

  // 3. If LLM unavailable/failed, use Expert Offline Agriculture Analysis Engine
  if (!llmAnalysis) {
    llmAnalysis = generateOfflineAgriAnalysis(queryText, Boolean(imageBase64), language);
    llmAnalysis.source = 'OFFLINE';
  }

  return {
    isUnrelated: false,
    queryText,
    hasImage: Boolean(imageBase64),
    result: llmAnalysis
  };
}

function generateOfflineAgriAnalysis(text, hasImage, language = 'en') {
  const lower = text.toLowerCase();

  let crop = null;
  if (lower.includes('tomato')) crop = 'Tomato';
  else if (lower.includes('rice') || lower.includes('paddy')) crop = 'Rice / Paddy';
  else if (lower.includes('wheat')) crop = 'Wheat';
  else if (lower.includes('maize') || lower.includes('corn')) crop = 'Maize';
  else if (lower.includes('chilli') || lower.includes('chili') || lower.includes('pepper')) crop = 'Chilli';
  else if (lower.includes('potato')) crop = 'Potato';
  else if (lower.includes('onion')) crop = 'Onion';
  else if (lower.includes('cotton')) crop = 'Cotton';
  else if (lower.includes('sugarcane')) crop = 'Sugarcane';

  // 1. Greenhouse / Polyhouse Query
  if (lower.includes('greenhouse') || lower.includes('polyhouse') || lower.includes('shade net') || lower.includes('protected cultivation')) {
    const msg = `Greenhouse (or polyhouse) farming is a protected agricultural system designed to control environmental factors such as temperature, humidity, light intensity, and irrigation for optimal crop growth.

**Key Benefits:**
• **Weather Protection:** Shields crops from extreme rainfall, hail, frost, and scorching heat.
• **Microclimate Control:** Maintains optimal temperature and humidity for faster growth and higher quality yield.
• **Pest & Disease Control:** Significantly reduces entry of insect vectors compared to open field farming.
• **Year-Round Production:** Enables off-season cultivation of high-value crops.

**Key Considerations for Your Farm:**
• **Initial Investment:** Structural setup costs for steel frames, UV-stabilized polythene sheets, and shade nets.
• **Ventilation & Cooling:** Vents, shade curtains, or fan-and-pad cooling systems to prevent heat buildup.
• **Irrigation Setup:** Drip irrigation and fertigation systems for precise water and nutrient delivery.
• **Suitable Crops:** Tomatoes, capsicum (peppers), cucumbers, strawberries, and cut flowers.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Greenhouse Farming Guide',
      category: 'Greenhouse',
      crop: crop || 'General Crop',
      confidence: null,
      recommendedActions: [
        'Determine suitable greenhouse area and crop type based on local market demand.',
        'Install UV-stabilized 200-micron polyfilm with proper side/roof ventilation.',
        'Integrate drip irrigation and automated fertigation unit.'
      ],
      followUpQuestion: 'What crop, location, or farm size are you planning for your greenhouse?'
    };
  }

  // 2. Tomato Fertilizer / Nutrient Query
  if (crop === 'Tomato' && (lower.includes('fertilizer') || lower.includes('npk') || lower.includes('nutrient') || lower.includes('feed'))) {
    const msg = `Recommended fertilizer schedule and nutrition plan for Tomato crop:

**1. NPK Requirement:**
• Recommended N:P:K dosage is 120:60:60 kg per hectare (48:24:24 kg/acre).

**2. Application Schedule:**
• **Basal Dose:** Apply 100% Phosphorus & Potassium + 50% Nitrogen during land preparation.
• **Top-Dressing:** Split the remaining 50% Nitrogen into two equal top-doses at 30 days and 45 days after transplanting.

**3. Micronutrients & Prevention:**
• Foliar spray 0.5% Calcium Nitrate during fruit set to prevent Blossom End Rot.
• Incorporate 10 tonnes/ha of well-rotted farmyard manure (FYM) or vermicompost before planting.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Tomato Fertilizer Schedule',
      category: 'Fertilizers & Soil',
      crop: 'Tomato',
      recommendedActions: [
        'Apply NPK 120:60:60 kg/ha with 50% N as basal and remaining N in two splits.',
        'Foliar spray Calcium Nitrate during fruit setting stage.',
        'Incorporate 10 tonnes/ha organic compost during field preparation.'
      ]
    };
  }

  // 3. Tomato Yellow Leaf Spot / Disease Query
  if (crop === 'Tomato' && (lower.includes('yellow') || lower.includes('spot') || lower.includes('disease') || lower.includes('blight'))) {
    const msg = `Yellowing leaves with brown concentric spots (target spots) on lower foliage indicate **Early Blight (Alternaria solani)** or **Tomato Yellow Leaf Curl Virus**.

**Recommended Remedies & Control Actions:**
• **Fungicide Spray:** Apply Mancozeb 75 WP (2g/L water) or Copper Oxychloride 50 WP (3g/L water) covering all foliage.
• **Pruning:** Remove and destroy infected lower leaves up to 30 cm from the soil level.
• **Watering:** Avoid overhead sprinkler watering; irrigate directly at the root zone.
• **Mulching:** Mulch soil base with straw to prevent soil-borne fungal spores from splashing onto leaves.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Tomato Leaf Disease Control',
      category: 'Plant Disease',
      crop: 'Tomato',
      symptoms: ['Yellowing lower foliage with concentric brown target spots'],
      possibleCauses: ['Early Blight (Alternaria solani)', 'High humidity and leaf wetness'],
      recommendedActions: [
        'Spray Mancozeb 75 WP (2g/L) or Copper Oxychloride (3g/L).',
        'Prune lower infected leaves up to 30 cm from ground.',
        'Mulch plant base with dry straw.'
      ]
    };
  }

  // 4. Tomato Growing / Cultivation Query
  if (crop === 'Tomato' && (lower.includes('grow') || lower.includes('sow') || lower.includes('plant') || lower.includes('cultivat'))) {
    const msg = `Cultivation guide for growing high-yielding tomatoes:

**1. Soil & Land Preparation:**
• Well-drained sandy loam or loamy soil rich in organic matter (pH 6.0–7.0).
• Plow land 3 times and form raised beds (1m width).

**2. Nursery & Transplanting:**
• Treat seeds with Trichoderma viride (4g/kg seed).
• Transplant 25–30 day old healthy seedlings at 60 cm x 45 cm spacing.

**3. Staking & Irrigation:**
• Provide bamboo staking support 30 days after transplanting for clean, disease-free fruits.
• Irrigate every 5–7 days depending on soil moisture.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Tomato Cultivation Guide',
      category: 'Crop Cultivation',
      crop: 'Tomato',
      recommendedActions: [
        'Select certified disease-resistant tomato varieties.',
        'Transplant 25-30 day old seedlings at 60 cm x 45 cm spacing.',
        'Provide bamboo staking 30 days post-transplanting.'
      ]
    };
  }

  // 5. Rice Fertilizer Query
  if (crop === 'Rice / Paddy' && (lower.includes('fertilizer') || lower.includes('npk') || lower.includes('nutrient') || lower.includes('urea'))) {
    const msg = `Recommended fertilizer protocol for Rice (Paddy):

**1. NPK & Zinc Requirement:**
• Recommended N:P:K dosage: 100:50:50 kg/ha + 25 kg Zinc Sulfate per hectare.

**2. Application Split:**
• **Basal Dose:** Apply 50% Nitrogen + 100% Phosphorus & Potassium + Zinc Sulfate at final puddle plowing.
• **1st Top-Dress:** Apply 25% Nitrogen at active tillering (21 days after transplanting).
• **2nd Top-Dress:** Apply remaining 25% Nitrogen at panicle initiation (42 days after transplanting).`;

    return {
      message: msg,
      assessment: msg,
      title: 'Rice Fertilizer Management',
      category: 'Fertilizers & Soil',
      crop: 'Rice / Paddy',
      recommendedActions: [
        'Apply NPK 100:50:50 kg/ha + 25 kg Zinc Sulfate.',
        'Top-dress Nitrogen at 21 days (tillering) and 42 days (panicle initiation).'
      ]
    };
  }

  // 6. Rice Irrigation Query
  if (crop === 'Rice / Paddy' && (lower.includes('water') || lower.includes('irrigat') || lower.includes('moisture') || lower.includes('dry'))) {
    const msg = `Water management guidelines for Rice (Paddy):

**1. Standing Water Depth:**
• Maintain 2 to 5 cm shallow standing water from transplanting through tillering until flowering.

**2. Alternate Wetting & Drying (AWD):**
• Allow water level to drop 15 cm below soil surface before re-irrigating to save up to 30% water without reducing yield.

**3. Pre-Harvest Draining:**
• Drain field completely 10 to 14 days before harvest to promote uniform ripening and facilitate harvesting.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Rice Irrigation Schedule',
      category: 'Irrigation Guidance',
      crop: 'Rice / Paddy',
      recommendedActions: [
        'Maintain 2 to 5 cm shallow standing water during early growth.',
        'Adopt Alternate Wetting and Drying (AWD) to save water.',
        'Drain field 10 to 14 days before harvest.'
      ]
    };
  }

  // 7. Wheat Irrigation Query
  if (crop === 'Wheat' && (lower.includes('water') || lower.includes('irrigat') || lower.includes('moisture') || lower.includes('how often'))) {
    const msg = `Wheat requires 5 to 6 timely irrigations depending on soil water retention:

**Critical Irrigation Stages:**
• **1st Irrigation (CRITICAL):** Crown Root Initiation (CRI) stage — 21 days after sowing. (Watering here prevents up to 30% yield loss).
• **2nd Irrigation:** Tillering stage — 40–45 days after sowing.
• **3rd Irrigation:** Jointing stage — 60–65 days after sowing.
• **4th Irrigation:** Flowering stage — 80–85 days after sowing.
• **5th Irrigation:** Milk stage — 100 days after sowing.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Wheat Irrigation Schedule',
      category: 'Irrigation',
      crop: 'Wheat',
      recommendedActions: [
        'Irrigate at Crown Root Initiation (CRI) 21 days after sowing (CRITICAL).',
        'Provide subsequent irrigations at tillering, jointing, flowering, and milk stages.'
      ]
    };
  }

  // 8. Aphids & Pest Control Query (Chilli or General)
  if (lower.includes('aphid') || lower.includes('pest') || lower.includes('thrip') || lower.includes('bug')) {
    const msg = `Aphids and sap-sucking pests cause leaf curling and transmit viral diseases. Here is an effective control protocol:

**1. Bio-Pesticide Control:**
• **Neem Oil Spray:** Spray 5% cold-pressed Neem Oil emulsion (5 ml Neem oil + 2 ml liquid soap per liter of water) during late evening hours.
• **Sticky Traps:** Install yellow sticky traps (10–15 per acre) at crop height to catch adult flying aphids.

**2. Chemical Control (For Heavy Infestation):**
• Spray Imidacloprid 17.8 SL at 0.5 ml per liter of water or Acetamiprid 20 SP at 0.2g per liter of water.
• Ensure thorough spray coverage under foliage where aphids cluster.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Aphid & Pest Control Protocol',
      category: 'Pest Management',
      crop: crop || 'Chilli',
      recommendedActions: [
        'Spray 5% Neem Oil emulsion (5ml/L + liquid soap) during evening.',
        'Install 10-15 yellow sticky traps per acre.',
        'For heavy outbreaks, spray Imidacloprid 17.8 SL (0.5ml/L).'
      ]
    };
  }

  // 9. Onion Soil Query
  if (crop === 'Onion' && (lower.includes('soil') || lower.includes('ph') || lower.includes('land') || lower.includes('prep'))) {
    const msg = `Onion soil requirements and field preparation guide:

**1. Soil Type & pH:**
• Deep, well-drained friable sandy loam rich in organic matter.
• Optimum soil pH: 6.0 to 7.0.

**2. Land Preparation:**
• Plow land 3 to 4 times to fine tilth.
• Form raised beds (1.2m width) to prevent waterlogging, which distorts bulb shape and causes root rot.

**3. Organic Amendment:**
• Incorporate 15 tonnes/ha well-rotted organic compost or farmyard manure during final plowing.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Onion Soil Guidance',
      category: 'Soil Guidance',
      crop: 'Onion',
      recommendedActions: [
        'Select well-drained sandy loam soil with pH 6.0 - 7.0.',
        'Prepare raised beds to prevent waterlogging and bulb distortion.',
        'Incorporate 15 tonnes/ha organic compost during final plowing.'
      ]
    };
  }

  // 10. Hydroponics & Vertical Farming
  if (lower.includes('hydroponic') || lower.includes('soilless') || lower.includes('vertical farm')) {
    const msg = `Hydroponics is a method of growing crops without soil using mineral nutrient solutions in water:

**Key Advantages:**
• Up to 90% water savings compared to traditional soil farming.
• Faster growth rates and higher density per square meter.
• Precise control over nutrient pH (5.5–6.5) and EC levels.

**Common Systems:**
• **NFT (Nutrient Film Technique):** Ideal for leafy greens (lettuce, spinach, herbs).
• **DWC (Deep Water Culture):** Popular for fast-growing greens.
• **Drip System:** Suitable for fruiting crops like tomatoes and peppers.`;

    return {
      message: msg,
      assessment: msg,
      title: 'Hydroponics & Soil-less Farming',
      category: 'Agricultural Tech',
      crop: 'Hydroponics',
      recommendedActions: [
        'Maintain nutrient solution pH between 5.5 and 6.5.',
        'Monitor EC levels daily based on crop growth phase.'
      ]
    };
  }

  // 11. General Agricultural Query Fallback (Tailored to user prompt)
  const isFertilizer = lower.includes('fertilizer') || lower.includes('npk') || lower.includes('nutrient');
  const isWater = lower.includes('water') || lower.includes('irrigat');
  const isDisease = lower.includes('yellow') || lower.includes('spot') || lower.includes('disease') || lower.includes('rot');

  let topicName = 'General Agriculture';
  if (isFertilizer) topicName = 'Soil & Fertilizer Management';
  else if (isWater) topicName = 'Irrigation Guidance';
  else if (isDisease) topicName = 'Crop Health & Disease Advisory';
  else if (crop) topicName = `${crop} Farming Guidance`;

  const fallbackMsg = `Here is agricultural guidance regarding your inquiry about "${text.trim()}":

• **Primary Assessment:** Practical field management requires balanced nutrient application, proper irrigation timing, and regular crop health monitoring.
• **Recommended Actions:** 
  1. Inspect soil moisture at 15 cm depth before applying irrigation.
  2. Apply organic manure (vermicompost/FYM) to build soil organic carbon.
  3. Consult your local agricultural extension office for precise regional chemical dosages.`;

  return {
    message: fallbackMsg,
    assessment: fallbackMsg,
    title: topicName,
    category: topicName,
    crop: crop || null,
    recommendedActions: [
      'Conduct a soil test to determine precise NPK and micronutrient needs.',
      'Adopt drip irrigation or mulching to conserve moisture.',
      'Monitor fields weekly for early signs of pests or nutrient deficiencies.'
    ]
  };
}

module.exports = {
  analyzeAgriQuery,
  generateOfflineAgriAnalysis
};
