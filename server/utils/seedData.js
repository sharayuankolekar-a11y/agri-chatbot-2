/**
 * Initial Seed Data Generator for AgriSphere
 * Populates realistic demo agricultural consultations for Dashboard and History logs.
 */

const Consultation = require('../models/Consultation');
const { getStatus, memoryStore } = require('../config/db');

const SEED_CONSULTATIONS = [
  {
    category: 'Plant Disease',
    crop: 'Tomato',
    queryText: 'My tomato leaves are turning yellow with dark spots. What disease is this?',
    hasImage: true,
    language: 'en',
    assessment: 'Possible Early Blight (Alternaria solani)',
    confidence: 88,
    symptoms: [
      'Concentric dark spots on lower leaves',
      'Yellow halos surrounding leaf spots',
      'Premature leaf drop'
    ],
    causes: [
      'Fungal infection favored by warm temperature and high humidity',
      'Splashing rainwater carrying soil pathogens'
    ],
    recommendedActions: [
      'Prune and destroy infected lower leaves immediately',
      'Avoid overhead watering; water at plant base',
      'Apply organic neem spray or copper-based bio-fungicide'
    ],
    prevention: [
      'Rotate crops annually away from nightshade family',
      'Mulch soil surface to prevent soil splash onto foliage'
    ],
    createdAt: new Date(Date.now() - 3600000 * 3)
  },
  {
    category: 'Irrigation',
    crop: 'Rice / Paddy',
    queryText: 'When is the critical irrigation period for paddy rice?',
    hasImage: false,
    language: 'en',
    assessment: 'Critical Water Management Schedule for Rice',
    confidence: 94,
    symptoms: ['Water scheduling inquiry'],
    causes: ['High crop water sensitivity during flowering stage'],
    recommendedActions: [
      'Maintain 2–5 cm water depth during tillering and panicle initiation',
      'Ensure field is not flooded 10 days prior to harvest',
      'Practice Alternate Wetting and Drying (AWD) to save 20% water'
    ],
    prevention: ['Level fields properly for uniform water distribution'],
    createdAt: new Date(Date.now() - 3600000 * 12)
  },
  {
    category: 'Fertilizers',
    crop: 'Maize',
    queryText: 'What is the recommended NPK fertilizer ratio for maize crop?',
    hasImage: false,
    language: 'en',
    assessment: 'Nutrient & Fertilizer Schedule for Maize',
    confidence: 90,
    symptoms: ['Nutrient inquiry'],
    causes: ['High nitrogen requirement for vegetative growth'],
    recommendedActions: [
      'Apply NPK in 120:60:60 kg/hectare balanced ratio',
      'Apply full Phosphorus & Potassium dose during basal sowing',
      'Split Nitrogen into 3 equal doses: Basal, Knee-high, and Tasseling stages'
    ],
    prevention: ['Soil test every 2 years to avoid nutrient lockup'],
    createdAt: new Date(Date.now() - 3600000 * 26)
  },
  {
    category: 'Pest Management',
    crop: 'Onion',
    queryText: 'How to control thrips infestation on onion leaves naturally?',
    hasImage: false,
    language: 'en',
    assessment: 'Integrated Pest Management for Onion Thrips',
    confidence: 86,
    symptoms: ['Silvery patches and curling on onion leaves'],
    causes: ['Thrips tabaci feeding on sap during hot dry weather'],
    recommendedActions: [
      'Install blue sticky traps (25 traps per hectare)',
      'Spray Neem oil (10,000 ppm) at 3ml per liter of water',
      'Use sprinkler irrigation to wash thrips off leaves'
    ],
    prevention: ['Avoid planting onions near alfalfa or wheat fields'],
    createdAt: new Date(Date.now() - 3600000 * 48)
  },
  {
    category: 'Crop Selection',
    crop: 'Pulses',
    queryText: 'Which short-duration pulse crop is suitable for dryland sandy soil?',
    hasImage: false,
    language: 'en',
    assessment: 'Dryland Pulse Selection & Sowing Advice',
    confidence: 92,
    symptoms: ['Crop selection for low rainfall zone'],
    causes: ['Low soil moisture retention capability'],
    recommendedActions: [
      'Select Green Gram (Mung Bean) or Black Gram (Vigna mungo)',
      'Treat seeds with Rhizobium culture before sowing',
      'Ensure light shallow sowing at 3–4 cm depth'
    ],
    prevention: ['Incorporate organic compost to enhance water retention'],
    createdAt: new Date(Date.now() - 3600000 * 72)
  }
];

async function seedInitialData() {
  const { isConnected } = getStatus();

  if (isConnected) {
    try {
      const count = await Consultation.countDocuments();
      if (count === 0) {
        await Consultation.insertMany(SEED_CONSULTATIONS);
        console.log(`✅ Seeded ${SEED_CONSULTATIONS.length} demo agricultural consultations into MongoDB.`);
      }
    } catch (err) {
      console.warn('⚠️ Seeding MongoDB failed:', err.message);
    }
  }

  // Populate memory store regardless for fast offline fallback
  if (memoryStore.scans.length === 0) {
    memoryStore.scans = SEED_CONSULTATIONS.map((s, idx) => ({
      _id: `seed-agri-${idx + 1}`,
      ...s
    }));
    console.log(`✅ Seeded memory store with ${memoryStore.scans.length} demo consultations.`);
  }
}

module.exports = {
  SEED_CONSULTATIONS,
  seedInitialData
};
