import React from 'react';
import { BookOpen, Sprout, Droplets, FlaskConical, Bug, ShieldCheck, Sun, CheckCircle, ShieldAlert, Scissors, Tractor, Clover } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import FarmCanvas from '../components/FarmCanvas';

export default function Learn() {
  const { t } = useLanguage();

  const topics = [
    {
      icon: Sprout,
      color: 'text-[#1F7A4D] bg-[#1F7A4D]/10 border-[#1F7A4D]/20',
      titleKey: 'learn.catSoil',
      summary: 'Proper soil preparation enhances root penetration, moisture retention, and microbial activity necessary for high crop yields.',
      keyRule: 'Conduct a soil health test every 2 years to determine exact N-P-K and micronutrient deficiencies before applying bulk fertilizers.',
      steps: [
        'Deep plow fields during summer to destroy soil-borne pest pupae',
        'Incorporate 10-15 tonnes of well-rotted farmyard manure (FYM) per hectare',
        'Maintain soil pH between 6.0–7.5 for optimal nutrient availability'
      ]
    },
    {
      icon: Sun,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      titleKey: 'learn.catSeeds',
      summary: 'High-quality certified seeds treated with beneficial bio-agents guarantee uniform germination and early crop vigor.',
      keyRule: 'Treat seeds with Trichoderma (4g/kg) or Rhizobium culture before sowing to prevent seed-borne rot.',
      steps: [
        'Select certified disease-resistant varieties adapted to your agro-climatic zone',
        'Sow seeds at optimal depth (2-3x seed diameter) in moist seedbed',
        'Maintain recommended line-to-line spacing for proper solar interception'
      ]
    },
    {
      icon: Tractor,
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      titleKey: 'learn.catSowing',
      summary: 'Optimal sowing density and seedbed preparation minimize crop competition and ensure uniform stand establishment.',
      keyRule: 'Calibrate seed drills to achieve recommended seed rate per acre based on crop geometry.',
      steps: [
        'Ensure adequate seedbed moisture prior to mechanical or manual sowing',
        'Maintain uniform sowing depth to prevent uneven seedling emergence',
        'Perform seed priming in saline soils to boost initial germination speed'
      ]
    },
    {
      icon: Droplets,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      titleKey: 'learn.catIrrigation',
      summary: 'Efficient irrigation prevents water stress during critical growth stages while conserving water resources.',
      keyRule: 'Adopt Drip or Micro-Sprinkler systems to save 30-50% water and reduce weed emergence.',
      steps: [
        'Irrigate during early morning or late evening to minimize evaporation losses',
        'Apply mulching (straw or plastic film) to conserve root zone soil moisture',
        'Avoid over-watering to prevent root asphyxiation and damping-off fungus'
      ]
    },
    {
      icon: FlaskConical,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      titleKey: 'learn.catFertilizers',
      summary: 'Providing balanced Nitrogen, Phosphorus, Potassium (NPK) and micronutrients at right stages maximizes fertilizer efficiency.',
      keyRule: 'Never apply full Nitrogen in one dose; split into Basal, Vegetative, and Flowering applications.',
      steps: [
        'Apply full Phosphorus and Potassium as basal dressing during land prep',
        'Supplement with Zinc Sulfate (25 kg/ha) in paddy and maize crops',
        'Integrate organic vermicompost with bio-fertilizers like Azospirillum'
      ]
    },
    {
      icon: Bug,
      color: 'text-red-700 bg-red-50 border-red-200',
      titleKey: 'learn.catPests',
      summary: 'IPM combines physical, biological, and chemical methods to control crop pests safely without harming beneficial insects.',
      keyRule: 'Monitor pest threshold levels using sticky traps before applying targeted bio-pesticides.',
      steps: [
        'Install yellow sticky traps (25/ha) for sucking pests (aphids/whiteflies)',
        'Spray Neem Oil solution (10,000 ppm) at 3-5 ml per liter of water',
        'Conserve natural predators like ladybird beetles and lacewings'
      ]
    },
    {
      icon: ShieldAlert,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
      titleKey: 'learn.catDiseases',
      summary: 'Early diagnosis of fungal, bacterial, and viral crop pathogens prevents large-scale yield loss.',
      keyRule: 'Remove infected host plants immediately to prevent pathogen spore dispersion in wind.',
      steps: [
        'Rotate with non-host crops to break soil pathogen life cycles',
        'Use certified disease-free planting material',
        'Apply bio-fungicides like Pseudomonas fluorescens at first symptom appearance'
      ]
    },
    {
      icon: Scissors,
      color: 'text-slate-800 bg-slate-100 border-slate-300',
      titleKey: 'learn.catWeeds',
      summary: 'Systematic weed management prevents nutrient robbing during early 30-45 critical crop growth days.',
      keyRule: 'Combine mechanical weeding with bio-mulching for zero chemical residue control.',
      steps: [
        'Perform first hoeing at 15-20 days post emergence',
        'Use paddy cono-weeder in system of rice intensification (SRI)',
        'Keep field borders free of invasive weed hosts'
      ]
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-900 bg-green-50 border-green-200',
      titleKey: 'learn.catHarvesting',
      summary: 'Harvesting crops at physiological maturity ensures peak grain quality, sugar content, and minimum post-harvest loss.',
      keyRule: 'Dry harvested grains to optimal moisture content (12-14%) before long-term storage.',
      steps: [
        'Harvest during dry clear weather to avoid fungal molding',
        'Use clean ventilated hermetic storage bags for grain preservation',
        'Sanitize storage bins with neem leaves or bio-fumigants'
      ]
    },
    {
      icon: Clover,
      color: 'text-[#1F7A4D] bg-[#1F7A4D]/10 border-[#1F7A4D]/20',
      titleKey: 'learn.catSustainable',
      summary: 'Sustainable farming maintains long-term soil fertility, biodiversity, and environmental health.',
      keyRule: 'Practice legume crop rotation annually to fix atmospheric nitrogen in agricultural soils naturally.',
      steps: [
        'Incorporate green manure crops like Sesbania (Dhaincha) prior to main crop',
        'Prepare bio-inputs like Jeevamrut and Panchagavya for plant immunity',
        'Compost farm waste residues rather than burning crop stubble'
      ]
    },
    {
      icon: Sprout,
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      titleKey: 'learn.catOrganic',
      summary: 'Bio-farming harnesses natural microbial inoculants and vermicompost for chemical-free premium crop production.',
      keyRule: 'Apply organic manures 3-4 weeks prior to sowing for optimal microbial mineralization.',
      steps: [
        'Utilize vermicompost and Azotobacter bio-fertilizers',
        'Establish natural hedge borders to attract beneficial pollinator insects',
        'Obtain organic certification credentials for premium market value'
      ]
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-hidden bg-[#F6F3E8] text-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F7A4D]/10 text-[#14532D] text-xs font-black mb-2">
            <BookOpen className="w-4 h-4 text-[#1F7A4D]" />
            <span>{t('learn.badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#14532D] tracking-tight">
            {t('learn.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
            {t('learn.subtitle')}
          </p>
        </div>

        {/* Editorial Knowledge Guide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-lg space-y-4 flex flex-col justify-between hover:border-[#1F7A4D] transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl border ${topic.color} shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#14532D] leading-tight">
                      {t(topic.titleKey)}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-bold">
                    {topic.summary}
                  </p>

                  {/* Golden Rule Box */}
                  <div className="p-3.5 rounded-2xl bg-[#F6F3E8] border border-[#1F7A4D]/20 text-[#14532D] text-xs font-bold flex items-start gap-2.5 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-[#1F7A4D] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black">{t('learn.goldenRule')} </span>
                      {topic.keyRule}
                    </div>
                  </div>

                  {/* Implementation Steps List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      {t('learn.stepsTitle')}
                    </span>
                    {topic.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs font-bold text-slate-800">
                        <span className="text-[#1F7A4D] font-bold">•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
