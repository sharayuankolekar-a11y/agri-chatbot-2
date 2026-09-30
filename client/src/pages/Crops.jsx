import React from 'react';
import { ArrowRight, Grid, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import FarmCanvas from '../components/FarmCanvas';

export default function Crops() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const cropsList = [
    {
      name: 'Rice / Paddy',
      icon: '🌾',
      season: 'Kharif (Monsoon)',
      soil: 'Clayey loam with high water retention capacity',
      careTip: 'Maintain 2–5 cm shallow standing water during tillering and panicle stages.',
      commonPests: 'Stem Borer, Brown Planthopper, Blast Disease',
      sampleQuery: 'What is the recommended fertilizer dose and water management for Paddy Rice?'
    },
    {
      name: 'Wheat',
      icon: '🌾',
      season: 'Rabi (Winter)',
      soil: 'Well-drained fertile clay loam',
      careTip: 'Provide 5–6 timely irrigations at Crown Root Initiation (CRI) and Tillering stages.',
      commonPests: 'Yellow Rust, Aphids, Loose Smut',
      sampleQuery: 'How to manage Yellow Rust disease in Wheat crop naturally?'
    },
    {
      name: 'Maize / Corn',
      icon: '🌽',
      season: 'Kharif & Spring',
      soil: 'Deep fertile sandy loam with pH 5.5–7.5',
      careTip: 'Split Nitrogen fertilizer into 3 doses: Basal, Knee-high, and Tasseling stages.',
      commonPests: 'Fall Armyworm, Stem Borer, Downy Mildew',
      sampleQuery: 'What is the best treatment for Fall Armyworm in Maize fields?'
    },
    {
      name: 'Tomato',
      icon: '🍅',
      season: 'Round the Year',
      soil: 'Well-drained sandy loam rich in organic matter',
      careTip: 'Stake plants for vertical support and prune lower leaves to prevent fungal splash.',
      commonPests: 'Early Blight, Fruit Borer, Leaf Curl Virus',
      sampleQuery: 'My tomato leaves are turning yellow with dark concentric spots. What should I do?'
    },
    {
      name: 'Potato',
      icon: '🥔',
      season: 'Rabi (Winter)',
      soil: 'Loose friable sandy loam with high organic carbon',
      careTip: 'Perform earthing up 30 days after planting to protect developing tubers from sun exposure.',
      commonPests: 'Late Blight, Aphids, Potato Tuber Moth',
      sampleQuery: 'How to prevent Late Blight in Potato crops during cold humid weather?'
    },
    {
      name: 'Onion',
      icon: '🧅',
      season: 'Kharif & Rabi',
      soil: 'Deep friable loamy soil rich in organic humus',
      careTip: 'Avoid excessive nitrogen late in season to ensure proper bulb firming and long storage life.',
      commonPests: 'Thrips, Purple Blotch, Stem rot',
      sampleQuery: 'How can I control thrips infestation on onion leaves organically?'
    },
    {
      name: 'Coconut',
      icon: '🥥',
      season: 'Perennial',
      soil: 'Coastal sandy loam or red laterite soil',
      careTip: 'Apply 50 kg organic manure and balanced NPK fertilizer in ring basin twice annually.',
      commonPests: 'Rhinoceros Beetle, Red Palm Weevil, Eriophyid Mite',
      sampleQuery: 'What is the treatment for Rhinoceros Beetle damage in coconut palms?'
    },
    {
      name: 'Banana',
      icon: '🍌',
      season: 'Perennial',
      soil: 'Rich loamy soil with pH 6.0–7.5 and good drainage',
      careTip: 'Desucker regularly leaving only 1 main plant and 1 follower sucker per hill.',
      commonPests: 'Sigatoka Leaf Spot, Panama Wilt, Banana Stem Weevil',
      sampleQuery: 'How to control Sigatoka leaf spot in banana plantations?'
    },
    {
      name: 'Sugarcane',
      icon: '🌾',
      season: 'Annual (12-14 Months)',
      soil: 'Deep well-drained loamy soil with high moisture retention',
      careTip: 'Trash mulching between rows conserves soil moisture and suppresses weed growth.',
      commonPests: 'Early Shoot Borer, Red Rot, Whitefly',
      sampleQuery: 'What is the prevention method for Red Rot in Sugarcane?'
    },
    {
      name: 'Pulses (Chickpea / Mung)',
      icon: '🌱',
      season: 'Kharif & Rabi',
      soil: 'Light to medium well-drained soil',
      careTip: 'Treat seeds with Rhizobium & PSB culture to fix atmospheric nitrogen naturally.',
      commonPests: 'Pod Borer (Helicoverpa), Wilt, Yellow Mosaic Virus',
      sampleQuery: 'How to manage Pod Borer in Chickpea crops organically?'
    },
    {
      name: 'Vegetables (Brinjal / Chili)',
      icon: '🥬',
      season: 'Round the Year',
      soil: 'Silt loam rich in organic compost',
      careTip: 'Drip irrigation combined with fertigation ensures maximum yield and reduced weed growth.',
      commonPests: 'Fruit & Shoot Borer, Damping Off, Whiteflies',
      sampleQuery: 'What is the remedy for fruit and shoot borer in Brinjal?'
    },
    {
      name: 'Fruits (Mango / Citrus)',
      icon: '🍎',
      season: 'Perennial Orchard',
      soil: 'Deep well-drained alluvial or loamy soil',
      careTip: 'Prune dead and crisscross branches post-harvest to allow sunlight penetration into canopy.',
      commonPests: 'Mango Hopper, Citrus Canker, Mealybugs',
      sampleQuery: 'How to control Citrus Canker and leaf miner in lemon trees?'
    }
  ];

  const handleAskCrop = (query) => {
    navigate('/', { state: { prefillQuery: query } });
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-hidden bg-[#F6F3E8] text-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F7A4D]/10 text-[#14532D] text-xs font-black mb-2">
            <Grid className="w-4 h-4 text-[#1F7A4D]" />
            <span>{t('crops.badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#14532D] tracking-tight">
            {t('crops.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
            {t('crops.subtitle')}
          </p>
        </div>

        {/* 3D Visual Crop Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropsList.map((crop, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-lg space-y-4 flex flex-col justify-between hover:border-[#1F7A4D] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-3 rounded-2xl bg-[#F6F3E8] border border-[#1F7A4D]/20 shrink-0 shadow-sm group-hover:scale-110 transition-transform">{crop.icon}</span>
                  <div>
                    <h3 className="text-lg font-black text-[#14532D] leading-tight">
                      {crop.name}
                    </h3>
                    <span className="text-[10px] font-black text-[#1F7A4D] uppercase tracking-wider block mt-0.5">
                      {crop.season}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                  <div className="p-2.5 rounded-2xl bg-[#F6F3E8] border border-[#1F7A4D]/10">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      {t('crops.soilClimate')}
                    </span>
                    <span className="text-slate-800 font-bold">{crop.soil}</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-[#F6F3E8] border border-[#1F7A4D]/10">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      {t('crops.tip')}
                    </span>
                    <span className="text-slate-700">{crop.careTip}</span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                      {t('crops.pests')}
                    </span>
                    <span className="text-amber-900 font-bold">{crop.commonPests}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAskCrop(crop.sampleQuery)}
                className="w-full py-3 rounded-2xl bg-[#1F7A4D] hover:bg-[#14532D] text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-lg"
              >
                <span>{t('crops.askAbout', { crop: crop.name })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
