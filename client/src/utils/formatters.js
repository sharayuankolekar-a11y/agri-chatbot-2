export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', speechLocale: 'en-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', speechLocale: 'kn-IN' },
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳', speechLocale: 'hi-IN' },
  { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳', speechLocale: 'te-IN' },
  { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳', speechLocale: 'ta-IN' },
  { code: 'ml', label: 'മലയാളം (Malayalam)', flag: '🇮🇳', speechLocale: 'ml-IN' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳', speechLocale: 'mr-IN' },
  { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇮🇳', speechLocale: 'bn-IN' }
];

export function getCategoryBadge(category = '') {
  const cat = category.toLowerCase();
  if (cat.includes('disease') || cat.includes('health')) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      badgeBg: 'bg-emerald-600 text-white',
      dot: '🍃',
      label: 'Plant Disease'
    };
  }
  if (cat.includes('pest')) {
    return {
      bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      badgeBg: 'bg-amber-600 text-white',
      dot: '🐛',
      label: 'Pest Control'
    };
  }
  if (cat.includes('fertilizer') || cat.includes('soil')) {
    return {
      bg: 'bg-amber-700/10 text-amber-800 dark:text-amber-300 border-amber-700/30',
      badgeBg: 'bg-amber-700 text-white',
      dot: '🧪',
      label: 'Soil & Fertilizer'
    };
  }
  if (cat.includes('irrigation') || cat.includes('water')) {
    return {
      bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
      badgeBg: 'bg-blue-600 text-white',
      dot: '💧',
      label: 'Irrigation'
    };
  }
  if (cat.includes('weather')) {
    return {
      bg: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
      badgeBg: 'bg-cyan-600 text-white',
      dot: '🌦️',
      label: 'Weather Guidance'
    };
  }
  return {
    bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    badgeBg: 'bg-emerald-600 text-white',
    dot: '🌾',
    label: category || 'Agriculture Guidance'
  };
}

export function formatDate(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
