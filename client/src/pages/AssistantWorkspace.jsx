import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  Home as HomeIcon,
  MessageSquare,
  Activity,
  Grid,
  History as HistoryIcon,
  BookOpen,
  Globe,
  Sun,
  Moon,
  Settings,
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowRight,
  Bug,
  Droplets,
  FlaskConical,
  ShieldCheck,
  Camera,
  FolderPlus,
  Mic,
  Lightbulb,
  Bell,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Menu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import AgriSphereLogo from '../components/AgriSphereLogo';
import ChatComposer from '../components/ChatComposer';
import ChatInterface from '../components/ChatInterface';
import ErrorBoundary from '../components/ErrorBoundary';
import FarmCanvas from '../components/FarmCanvas';
import { analyzeContent, getHistory } from '../services/api';

const DEFAULT_ACTIVITY_ITEMS = [
  {
    id: 'act-1',
    title: 'Possible Early Blight (Alternaria solani)',
    topic: 'Plant Disease',
    time: '9/18/2026',
    icon: Bug,
    iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
    queryText: 'My tomato leaves are turning yellow with brown concentric spots on lower leaves.',
    crop: 'Tomato',
    result: {
      crop: 'Tomato',
      category: 'Plant Disease',
      assessment: 'Early Blight (Alternaria solani)',
      confidence: 94,
      symptoms: ['Concentric dark rings on lower leaves', 'Yellowing of older foliage', 'Premature leaf drop'],
      causes: ['High humidity combined with warm temps (24-29°C)', 'Fungal spores in soil splash'],
      recommendedActions: ['Apply copper-based fungicide or Mancozeb spray', 'Prune infected lower leaves', 'Avoid overhead sprinkler watering'],
      prevention: ['Implement 3-year crop rotation with non-solanaceous crops', 'Mulch soil base to prevent spore splash']
    }
  },
  {
    id: 'act-2',
    title: 'Critical Water Management Schedule',
    topic: 'Irrigation',
    time: '9/18/2026',
    icon: Droplets,
    iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
    queryText: 'How frequently should drip irrigation be operated during flowering stage in paddy?',
    crop: 'Rice',
    result: {
      crop: 'Rice',
      category: 'Irrigation Guidance',
      assessment: 'Flowering Stage Drip Irrigation Schedule',
      confidence: 89,
      symptoms: ['Panicle initiation moisture requirement check'],
      causes: ['High evapotranspiration during flowering requires consistent soil saturation'],
      recommendedActions: ['Operate drip system for 2.5 hours daily or 50 liters/plot', 'Maintain soil moisture at field capacity'],
      prevention: ['Install tensiometers or soil moisture sensors at 15cm depth']
    }
  },
  {
    id: 'act-3',
    title: 'Nutrient & Fertilizer Schedule for Maize',
    topic: 'Fertilizers',
    time: '9/17/2026',
    icon: FlaskConical,
    iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
    queryText: 'How to amend acidic sandy soil pH 5.2 for optimal sugarcane growth?',
    crop: 'Soil',
    result: {
      crop: 'Sugarcane',
      category: 'Fertilizers & Soil',
      assessment: 'Agricultural Lime (CaCO3) Amendment Protocol',
      confidence: 92,
      symptoms: ['Low pH 5.2 reducing P availability'],
      causes: ['Leaching of basic cations in high-rainfall sandy soils'],
      recommendedActions: ['Apply 2.5 tonnes/ha agricultural dolomite lime 3-4 weeks before planting', 'Incorporate thoroughly into top 20cm soil layer'],
      prevention: ['Regular biennial soil testing and organic compost additions']
    }
  },
  {
    id: 'act-4',
    title: 'Integrated Pest Management for Onion',
    topic: 'Pest Management',
    time: '9/16/2026',
    icon: Bug,
    iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
    queryText: 'How to formulate 5% neem oil emulsion for thrips and aphid control on onion crops organically?',
    crop: 'Onion',
    result: {
      crop: 'Onion',
      category: 'Pest Management',
      assessment: 'Neem Oil Bio-Pesticide Spray',
      confidence: 95,
      symptoms: ['Silver streaks on leaf tips, curling shoots'],
      causes: ['Thrips tabaci population buildup in dry weather'],
      recommendedActions: ['Spray 5% cold-pressed neem oil + 10ml liquid soap per liter of water', 'Apply late evening under foliage'],
      prevention: ['Install yellow sticky traps (10 per acre)']
    }
  },
  {
    id: 'act-5',
    title: 'Dryland Pulse Selection & Sowing Advice',
    topic: 'Crop Selection',
    time: '9/15/2026',
    icon: Sprout,
    iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
    queryText: 'What farming precautions should I take for maize crop before heavy monsoon rain?',
    crop: 'Maize',
    result: {
      crop: 'Maize',
      category: 'Weather Advisory',
      assessment: 'Monsoon Heavy Rainfall Drainage Protocol',
      confidence: 91,
      symptoms: ['Risk of waterlogging in field troughs'],
      causes: ['Heavy precipitation forecast over next 48 hours'],
      recommendedActions: ['Clear field perimeter drainage channels', 'Delay top-dressing fertilizer spray until rain stops'],
      prevention: ['Ridge and furrow cultivation method']
    }
  }
];

const INTRO_SEEN_KEY = 'agrisphere_intro_seen';

// Workspace background. To change it, drop a new image into client/public/ and update this path.
const BACKGROUND_SRC = '/AgriSphere.png';

// Shared look for the small round controls floating over the landscape (menu, activity, search, bell)
const ROUND_BTN =
  'flex items-center justify-center w-11 h-11 rounded-full bg-[#FBF6E9]/95 dark:bg-[#091A13]/90 text-[#1E4D2B] dark:text-emerald-300 border border-[#DCCFB0] dark:border-[#1F7A4D]/40 shadow-md hover:bg-white dark:hover:bg-emerald-950 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B8A3A]';

const QUICK_TIPS = [
  'Apply organic compost to improve soil structure and water retention.',
  'Irrigate crops during early morning hours to minimize water evaporation and prevent fungal diseases.',
  'Rotate Solanaceous crops like tomato and potato with legumes to naturally replenish soil nitrogen.',
  'Install yellow sticky traps across your field to detect sucking pests early before outbreak.'
];

export default function AssistantWorkspace() {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  // Desktop sidebars collapse state (both closed on first load so the farm is the focus)
  const [isLeftNavOpen, setIsLeftNavOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Logo intro: plays once per browser session (skipped for reduced-motion users)
  const [introDone, setIntroDone] = useState(() => {
    try {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
      return sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const introLogoRef = useRef(null);
  const introWordRef = useRef(null);
  const introScrimRef = useRef(null);
  const brandLogoRef = useRef(null);

  // Mobile drawers toggle state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);

  // Search & notifications popover state
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  const [activityItems, setActivityItems] = useState(DEFAULT_ACTIVITY_ITEMS);
  const [activeItem, setActiveItem] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);

  // Continuous Chat Thread State
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation whenever messages or loading state update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Logo intro: logo appears centered, holds briefly, then glides to the top-left brand slot
  useLayoutEffect(() => {
    if (introDone) return undefined;

    const finishIntro = () => {
      try { sessionStorage.setItem(INTRO_SEEN_KEY, '1'); } catch { /* storage unavailable: intro may replay */ }
      setIntroDone(true);
    };

    const logo = introLogoRef.current;
    const word = introWordRef.current;
    const scrim = introScrimRef.current;
    const target = brandLogoRef.current;
    if (!logo || !word || !scrim || !target || typeof logo.animate !== 'function') {
      finishIntro();
      return undefined;
    }

    const to = target.getBoundingClientRect();
    const from = logo.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.width / from.width;
    const center = 'translate(-50%, -50%)';

    // Timeline (ms): fade in, hold at centre, then glide to the top-left.
    const FADE_IN = 600;
    const HOLD = 2600;
    const GLIDE = 1300;
    const DURATION = FADE_IN + HOLD + GLIDE; // 4500ms total
    const tIn = FADE_IN / DURATION;
    const tHold = (FADE_IN + HOLD) / DURATION;
    const opts = { duration: DURATION, fill: 'forwards' };
    const anims = [
      logo.animate([
        { transform: `${center} scale(0.9)`, opacity: 0, offset: 0, easing: 'cubic-bezier(0.22, 0.8, 0.3, 1)' },
        { transform: `${center} scale(1)`, opacity: 1, offset: tIn, easing: 'linear' },
        { transform: `${center} scale(1)`, opacity: 1, offset: tHold, easing: 'cubic-bezier(0.65, 0, 0.25, 1)' },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale})`, opacity: 1, offset: 1 }
      ], opts),
      word.animate([
        { opacity: 0, offset: 0 },
        { opacity: 1, offset: tIn },
        { opacity: 1, offset: tHold },
        { opacity: 0, offset: Math.min(tHold + 0.1, 0.98) },
        { opacity: 0, offset: 1 }
      ], opts),
      scrim.animate([
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: tHold },
        { opacity: 0, offset: 0.97 },
        { opacity: 0, offset: 1 }
      ], opts)
    ];
    anims[0].onfinish = finishIntro;

    return () => anims.forEach((a) => { a.onfinish = null; a.cancel(); });
  }, [introDone]);

  // Keyboard shortcut Ctrl+B to toggle left nav
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsLeftNavOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prefill query if passed via router location state
  useEffect(() => {
    if (location.state?.prefillQuery) {
      handleSend({ queryText: location.state.prefillQuery, language });
    }
  }, [location.state]);

  // Load history from backend API and merge into activity items
  useEffect(() => {
    async function fetchBackendHistory() {
      const data = await getHistory();
      if (data.success && (data.consultations?.length || data.scans?.length)) {
        const items = data.consultations || data.scans || [];
        const mapped = items.map((item, index) => ({
          id: item._id || `backend-${index}`,
          title: item.assessment || item.crop || 'Farm Consultation',
          topic: item.category || 'General Agriculture',
          time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
          icon: item.category === 'Plant Disease' ? Bug : item.category === 'Irrigation Guidance' ? Droplets : item.category === 'Fertilizers & Soil' ? FlaskConical : Sprout,
          iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
          queryText: item.queryText || item.crop || 'Agricultural consultation',
          crop: item.crop || 'Crop',
          result: item
        }));
        setActivityItems(prev => {
          const combined = [...mapped, ...prev];
          const map = new Map();
          const unique = [];
          for (const item of combined) {
            if (!map.has(item.id)) {
              map.set(item.id, true);
              unique.push(item);
            }
          }
          return unique;
        });
      }
    }
    fetchBackendHistory();
  }, []);

  const handleSelectActivity = (item) => {
    setActiveItem(item);
    setMessages([
      { id: `usr-act-${item.id}`, role: 'user', content: item.queryText || item.title },
      { id: `ast-act-${item.id}`, role: 'assistant', content: item.result?.message || item.result?.assessment, result: item.result }
    ]);
    setError(null);
    setMobileRightOpen(false);
  };

  const handleNewConsultation = () => {
    setActiveItem(null);
    setMessages([]);
    setError(null);
    setMobileRightOpen(false);
  };

  const handleSend = async ({ queryText, image, language: overrideLang }) => {
    if (!queryText && !image) return;

    const currentLang = overrideLang || language;
    const userMsgId = `usr-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      role: 'user',
      content: queryText,
      image,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Build history payload from recent messages in thread for Gemini API
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.role,
        message: m.content || m.result?.message || m.result?.assessment || ''
      }));

      const data = await analyzeContent({
        queryText,
        image,
        language: currentLang,
        history: historyPayload
      });

      if (data.success) {
        if (data.isUnrelated) {
          const guardrailMsg = {
            id: `ast-${Date.now()}`,
            role: 'assistant',
            isUnrelated: true,
            unrelatedMessage: data.message || t('chat.guardrailDefault'),
            timestamp: new Date()
          };
          setMessages(prev => [...prev, guardrailMsg]);
        } else {
          const aiMessage = data.message || data.result?.message || data.result?.assessment || 'Agricultural guidance completed.';
          const resObj = {
            consultationId: data.consultationId || data.result?.consultationId || `agri-${Date.now()}`,
            message: aiMessage,
            assessment: aiMessage,
            title: data.title || data.result?.title || data.crop || data.result?.crop || 'Agricultural Advisory',
            category: data.category || data.result?.category || 'General Agriculture',
            crop: data.crop || data.result?.crop || null,
            recommendedActions: Array.isArray(data.result?.recommendedActions) ? data.result.recommendedActions : (Array.isArray(data.recommendedActions) ? data.recommendedActions : []),
            warnings: Array.isArray(data.result?.warnings) ? data.result.warnings : (Array.isArray(data.warnings) ? data.warnings : []),
            followUpQuestion: data.result?.followUpQuestion || data.followUpQuestion || null
          };

          const astMsg = {
            id: `ast-${Date.now()}`,
            role: 'assistant',
            content: aiMessage,
            result: resObj,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, astMsg]);

          const newItem = {
            id: resObj.consultationId,
            title: resObj.title || queryText.slice(0, 30) + '...',
            topic: resObj.category,
            time: 'Just now',
            icon: Sprout,
            iconBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400',
            queryText,
            crop: resObj.crop || 'Crop',
            result: resObj
          };
          setActivityItems(prev => [newItem, ...prev]);
          setActiveItem(newItem);
        }
        return true;
      } else {
        setError(data.error || 'Failed to complete analysis.');
        return false;
      }
    } catch (err) {
      setError(err.message || 'Server connection error.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const prevTip = () => {
    setTipIndex(prev => (prev === 0 ? QUICK_TIPS.length - 1 : prev - 1));
  };

  const nextTip = () => {
    setTipIndex(prev => (prev === QUICK_TIPS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="h-screen h-[100dvh] w-full flex bg-[#FAF8F3] dark:bg-[#07130e] text-slate-900 dark:text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] relative select-none-or-normal">
      
      {/* ========================================== */}
      {/* 1. LEFT NAVIGATION SIDEBAR (Collapsible) */}
      {/* ========================================== */}
      <aside
        aria-hidden={!isLeftNavOpen}
        {...(!isLeftNavOpen ? { inert: '' } : {})}
        className={`hidden lg:flex flex-col shrink-0 bg-[#FBF7EC] dark:bg-[#091A13] border-r border-[#E4D9BE] dark:border-[#1F7A4D]/20 h-full p-5 justify-between z-30 relative select-none shadow-lg transition-all duration-300 ease-in-out ${
          isLeftNavOpen ? 'w-64 xl:w-72 opacity-100 translate-x-0' : 'w-0 p-0 border-0 opacity-0 -translate-x-full overflow-hidden'
        }`}
      >
        <div className="space-y-6 min-w-[220px]">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 px-1 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0">
              <AgriSphereLogo className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center tracking-tight font-bold text-xl leading-none">
                <span className="text-slate-900 dark:text-white">Agri</span>
                <span className="text-[#14532D] dark:text-emerald-400">Sphere</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                {t('footer.tagline') || 'Smart Farming. Better Decisions.'}
              </p>
            </div>
          </Link>

          {/* Vertical Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                location.pathname === '/'
                  ? 'bg-[#1F5C3A] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-[#14532D]/10 hover:text-[#14532D]'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>{t('workspace.home') || 'Home'}</span>
            </Link>

            <Link
              to="/assistant"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                location.pathname === '/assistant'
                  ? 'bg-[#1F5C3A] text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-[#14532D]/10 hover:text-[#14532D]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('workspace.assistant') || 'Assistant'}</span>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#14532D]/10 hover:text-[#14532D] transition-all"
            >
              <Activity className="w-4 h-4 text-[#14532D] dark:text-emerald-400" />
              <span>{t('nav.dashboard') || 'Dashboard'}</span>
            </Link>

            <Link
              to="/crops"
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#14532D]/10 hover:text-[#14532D] transition-all"
            >
              <Grid className="w-4 h-4 text-[#14532D] dark:text-emerald-400" />
              <span>{t('nav.crops') || 'Crops'}</span>
            </Link>

            <Link
              to="/consultations"
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#14532D]/10 hover:text-[#14532D] transition-all"
            >
              <HistoryIcon className="w-4 h-4 text-[#14532D] dark:text-emerald-400" />
              <span>{t('nav.consultations') || 'Consultations'}</span>
            </Link>

            <Link
              to="/learn"
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#14532D]/10 hover:text-[#14532D] transition-all"
            >
              <BookOpen className="w-4 h-4 text-[#14532D] dark:text-emerald-400" />
              <span>{t('nav.learn') || 'Learn'}</span>
            </Link>
          </nav>

        </div>

        {/* Bottom Sidebar Widgets */}
        <div className="space-y-3 min-w-[220px]">
          
          {/* Today's Insight Card */}
          <Link
            to="/learn"
            className="p-3.5 rounded-2xl bg-[#1F5C3A] text-white shadow-sm block space-y-1.5 hover:bg-[#256B43] transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-200">
              <span className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t('workspace.todaysInsight') || "Today's Insight"}</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
            </div>
            <p className="text-xs font-semibold leading-relaxed text-emerald-50">
              {t('workspace.insightText') || 'Tomato growing conditions are good in your area.'}
            </p>
          </Link>

          {/* Global Language Selector & Theme Toggle */}
          <div className="relative flex items-center justify-between px-3 py-2 rounded-2xl border border-slate-200 dark:border-[#1F7A4D]/20 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#14532D] dark:text-emerald-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold text-xs pr-1"
                aria-label="Select workspace language"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold">
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              title="Toggle light/dark theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>

          {/* Farmer Ramesh User Profile */}
          <div className="p-2.5 rounded-2xl border border-slate-200 dark:border-[#1F7A4D]/20 bg-white dark:bg-[#091A13] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#14532D] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                F
              </div>
              <div>
                <div className="text-xs font-semibold text-[#14532D] dark:text-white leading-tight">
                  {t('workspace.farmerName') || 'Farmer Ramesh'}
                </div>
                <div className="text-[10px] text-slate-500 font-bold">Bengaluru, KA</div>
              </div>
            </div>
            <button
              onClick={() => alert('AgriSphere Profile & Farm Location Settings: Bengaluru, KA')}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              title="Profile Settings"
            >
              <Settings className="w-4 h-4 text-[#14532D] dark:text-emerald-400" />
            </button>
          </div>

        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. CENTER IMMERSIVE LANDSCAPE AREA & CHAT STREAM */}
      {/* ========================================== */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden transition-all duration-300">
        
        {/* Full-bleed Background Landscape Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={BACKGROUND_SRC}
            alt="AgriSphere Landscape Visual"
            className="w-full h-full object-cover object-center filter brightness-[1.0] contrast-[1.02] saturate-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBF5E3]/45 via-transparent via-40% to-[#0B1A10]/35 pointer-events-none" />
        </div>

        {/* Top bar: menu + brand (left), weather / search / notifications / activity (right) */}
        <div className="relative z-20 flex items-start justify-between gap-3 px-4 sm:px-8 lg:px-10 pt-4 sm:pt-5 pb-1 shrink-0">

          {/* Left: menu toggle + brand. The logo lands here at the end of the intro. */}
          <div className="flex items-center gap-3">
            {/* Mobile drawer trigger (existing mobileNavOpen state) */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className={`lg:hidden ${ROUND_BTN}`}
              aria-label="Open menu"
              aria-haspopup="dialog"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop sidebar toggle (existing isLeftNavOpen state) */}
            <button
              onClick={() => setIsLeftNavOpen(!isLeftNavOpen)}
              className={`hidden lg:flex ${ROUND_BTN}`}
              title={isLeftNavOpen ? 'Close menu (Ctrl+B)' : 'Open menu (Ctrl+B)'}
              aria-label={isLeftNavOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isLeftNavOpen}
            >
              {isLeftNavOpen ? <PanelLeftClose className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand: hidden on desktop while the sidebar is open (the sidebar shows the logo itself) */}
            <Link to="/" className={`items-center gap-2.5 ${isLeftNavOpen ? 'flex lg:hidden' : 'flex'}`} aria-label="AgriSphere home">
              <span
                ref={brandLogoRef}
                className="block w-10 h-10 shrink-0 drop-shadow-md"
                style={{ visibility: introDone ? 'visible' : 'hidden' }}
              >
                <AgriSphereLogo className="w-full h-full" />
              </span>
              <span
                className={`hidden sm:block agri-hero-title !text-xl leading-none transition-opacity duration-500 ${introDone ? 'opacity-100' : 'opacity-0'}`}
              >
                Agri<span className="agri-hero-accent">Sphere</span>
              </span>
            </Link>
          </div>

          {/* Right: weather, search, notifications, activity toggle */}
          <div className="relative flex items-center gap-2">
            {/* Weather */}
            <div className="hidden md:flex items-center gap-2.5 pl-2 pr-4 py-1.5 mr-1 rounded-full bg-[#FBF6E9]/95 dark:bg-[#091A13]/90 border border-[#DCCFB0] dark:border-[#1F7A4D]/30 shadow-md text-[#1E4D2B] dark:text-white">
              <div className="p-1.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold leading-none">28°C <span className="text-[10px] font-medium text-slate-500">Clear Sky</span></div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">📍 Bengaluru, KA</div>
              </div>
            </div>

            {/* Search */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={ROUND_BTN}
              title="Search farm logs"
              aria-label="Search farm logs"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationAlert(!showNotificationAlert)}
                className={ROUND_BTN}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#FBF6E9]" />
            </div>

            {/* Mobile activity drawer trigger (existing mobileRightOpen state) */}
            <button
              onClick={() => setMobileRightOpen(true)}
              className={`xl:hidden ${ROUND_BTN}`}
              aria-label="Open recent farm activity"
              aria-haspopup="dialog"
            >
              <HistoryIcon className="w-5 h-5" />
            </button>

            {/* Desktop activity panel toggle (existing isRightPanelOpen state) */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`hidden xl:flex ${ROUND_BTN}`}
              title={isRightPanelOpen ? 'Close recent activity' : 'Open recent activity'}
              aria-label={isRightPanelOpen ? 'Close recent activity' : 'Open recent activity'}
              aria-expanded={isRightPanelOpen}
            >
              {isRightPanelOpen ? <PanelRightClose className="w-5 h-5" /> : <HistoryIcon className="w-5 h-5" />}
            </button>

            {/* Expandable search input (overlays content so the layout never shifts) */}
            {showSearchInput && (
              <div className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] p-2 rounded-2xl bg-[#FBF6E9] dark:bg-[#091A13] border border-[#DCCFB0] dark:border-[#1F7A4D]/30 shadow-lg text-xs flex items-center gap-2">
                <Search className="w-4 h-4 text-[#1E4D2B] ml-1 shrink-0" />
                <input
                  type="text"
                  placeholder="Search farm logs..."
                  className="w-full bg-transparent focus:outline-none font-semibold text-xs"
                  onChange={(e) => {
                    const q = e.target.value.toLowerCase();
                    if (!q) {
                      setActivityItems(DEFAULT_ACTIVITY_ITEMS);
                    } else {
                      setActivityItems(DEFAULT_ACTIVITY_ITEMS.filter(item =>
                        item.title.toLowerCase().includes(q) || item.topic.toLowerCase().includes(q)
                      ));
                      // Results are listed in the activity panel, which starts closed
                      setIsRightPanelOpen(true);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Center Area: Header + Canvas or Continuous Conversation Thread */}
        <div className="flex-1 relative z-10 w-full min-h-0 overflow-y-auto px-4 sm:px-6 py-2 flex flex-col space-y-4">
          
          {/* Main Headline (always visible at top of conversation area) */}
          <div className="relative max-w-2xl mx-auto w-full text-center px-4 py-5 sm:py-6">
            <div aria-hidden="true" className="agri-hero-mist absolute inset-0 pointer-events-none" />
            <h1 className="agri-hero-title relative">
              <span className="block">Your Farm.</span>
              <span className="agri-hero-accent block">Smarter Decisions.</span>
            </h1>
            <p className="agri-hero-sub relative mt-2.5 max-w-md mx-auto">
              AI-powered agricultural guidance for healthier crops and higher yields.
            </p>
          </div>

          {/* Show Farm Canvas Pins when empty thread, or Continuous Chat Thread when messages present */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center relative min-h-[280px]">
              <FarmCanvas isInteractive={true} onSelectTelemetry={(m) => handleSend({ queryText: `Tell me about ${m.label} on my farm.`, language })} />
            </div>
          ) : (
            <div className="flex-1 w-full max-w-3xl mx-auto py-2">
              <ErrorBoundary onReset={handleNewConsultation}>
                <ChatInterface
                  messages={messages}
                  isLoading={isLoading}
                  error={error}
                  messagesEndRef={messagesEndRef}
                  onRetry={() => {
                    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                    if (lastUserMsg) {
                      handleSend({ queryText: lastUserMsg.content, image: lastUserMsg.image, language });
                    }
                  }}
                />
              </ErrorBoundary>
            </div>
          )}

        </div>

        {/* Sticky Bottom Consultation Console */}
        <div className="relative z-20 max-w-3xl mx-auto w-full p-4 pt-0 space-y-2 shrink-0">
          <ChatComposer
            onSend={handleSend}
            isLoading={isLoading}
          />
          <div className="agri-motto text-center text-xs sm:text-sm">
            "Better Farming Brighter Tomorrow"
          </div>
        </div>

      </main>

      {/* ========================================== */}
      {/* 3. RIGHT RECENT FARM ACTIVITY PANEL (Collapsible) */}
      {/* ========================================== */}
      <aside
        aria-hidden={!isRightPanelOpen}
        {...(!isRightPanelOpen ? { inert: '' } : {})}
        className={`hidden xl:flex flex-col shrink-0 bg-[#FBF7EC] dark:bg-[#091A13] border-l border-[#E4D9BE] dark:border-[#1F7A4D]/20 h-full p-5 justify-between overflow-y-auto z-30 relative select-none space-y-4 shadow-lg transition-all duration-300 ease-in-out ${
          isRightPanelOpen ? 'w-80 xl:w-84 opacity-100 translate-x-0' : 'w-0 p-0 border-0 opacity-0 translate-x-full overflow-hidden'
        }`}
      >
        <div className="space-y-3 min-w-[260px]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              {t('workspace.recentActivity') || 'Recent Farm Activity'}
            </h3>
            <Link
              to="/consultations"
              className="text-[11px] font-bold text-[#14532D] dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>{t('workspace.viewAll') || 'View All'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Farm Activity List Items */}
          <div className="space-y-2">
            {activityItems.slice(0, 5).map((item) => {
              const Icon = item.icon || Sprout;
              const isSelected = activeItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectActivity(item)}
                  className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-center gap-3 group border ${
                    isSelected
                      ? 'bg-[#14532D] text-white border-[#14532D] shadow-lg'
                      : 'bg-[#FFFDF6] dark:bg-[#091A13] border-[#E4D9BE] dark:border-[#1F7A4D]/15 hover:border-[#1F5C3A] text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-white/20 text-white' : item.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-[#14532D]'}`}>
                      {item.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] mt-0.5 opacity-80">
                      <span className="font-semibold truncate text-slate-500 dark:text-slate-300">{item.topic}</span>
                      <span className="shrink-0 font-medium text-slate-400">{item.time}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* + New Consultation Primary CTA Button */}
          <button
            onClick={handleNewConsultation}
            className="w-full py-3 px-4 rounded-2xl bg-[#1F5C3A] hover:bg-[#256B43] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('memory.newConsultation') || '+ New Chat'}</span>
          </button>
        </div>

        {/* Quick Tips Carousel */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-slate-900/60 border border-amber-200/80 dark:border-amber-900/30 space-y-1.5 min-w-[260px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-400">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>{t('workspace.quickTips') || 'Quick Tips'}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={prevTip}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Previous Tip"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={nextTip}
                className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Next Tip"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
            "{QUICK_TIPS[tipIndex]}"
          </p>
        </div>

        {/* Learning Card */}
        <div className="p-3 rounded-2xl bg-[#1F3B2A] text-white shadow-md space-y-2 relative overflow-hidden group border border-[#2B4A36] min-w-[260px]">
          <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1592417817098-8f3d6eb1b757?auto=format&fit=crop&w=600&q=80"
              alt="Healthy Soil Healthy Future"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
            
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-bold text-white leading-tight">
                Healthy Soil<br />Healthy Future
              </span>
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 font-medium leading-snug">
            Learn sustainable farming practices with AgriSphere.
          </p>

          <Link
            to="/learn"
            className="text-[11px] font-bold text-emerald-400 hover:text-white flex items-center gap-1"
          >
            <span>Explore Learning Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </aside>

      {/* Mobile Drawers */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="agri-scrim absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <div className="agri-drawer-left absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-[#091A13] flex flex-col p-4 justify-between shadow-2xl z-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <AgriSphereLogo className="w-full h-full" />
                  </div>
                  <span className="font-bold text-base text-[#14532D] dark:text-white">Agri<span className="text-emerald-500">Sphere</span></span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="p-1 rounded-xl text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                <Link to="/" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#14532D] text-white">
                  <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link to="/assistant" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#14532D]/10">
                  <MessageSquare className="w-4 h-4" />
                  <span>Assistant</span>
                </Link>
                <Link to="/dashboard" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#14532D]/10">
                  <Activity className="w-4 h-4 text-[#14532D]" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/crops" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#14532D]/10">
                  <Grid className="w-4 h-4 text-[#14532D]" />
                  <span>Crops</span>
                </Link>
                <Link to="/consultations" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#14532D]/10">
                  <HistoryIcon className="w-4 h-4 text-[#14532D]" />
                  <span>Consultations</span>
                </Link>
                <Link to="/learn" onClick={() => setMobileNavOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-[#14532D]/10">
                  <BookOpen className="w-4 h-4 text-[#14532D]" />
                  <span>Learn</span>
                </Link>
              </nav>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-bold">
                <Globe className="w-4 h-4 text-[#14532D]" />
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent font-bold text-xs">
                  {supportedLanguages.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {l.nativeName}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logo intro (first load per session): centered moment, then glides to the top-left brand slot */}
      {!introDone && (
        <div className="fixed inset-0 z-[70] pointer-events-none" aria-hidden="true">
          <div ref={introScrimRef} className="absolute inset-0 bg-[#F6EFDC]/85" />
          <div
            ref={introLogoRef}
            className="absolute left-1/2 top-1/2 w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl"
            style={{ transform: 'translate(-50%, -50%)', opacity: 0, willChange: 'transform, opacity' }}
          >
            <AgriSphereLogo className="w-full h-full" />
          </div>
          <div
            ref={introWordRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 mt-20 sm:mt-24 text-center"
            style={{ opacity: 0 }}
          >
            <div className="agri-hero-title !text-3xl sm:!text-4xl">Agri<span className="agri-hero-accent">Sphere</span></div>
            <div className="agri-hero-sub mt-1">Smart Farming. Better Decisions.</div>
          </div>
        </div>
      )}

      {mobileRightOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="agri-scrim absolute inset-0 bg-black/50" onClick={() => setMobileRightOpen(false)} />
          <div className="agri-drawer-right absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-[#091A13] flex flex-col p-4 justify-between shadow-2xl z-50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#14532D]">
                <Activity className="w-4 h-4" />
                <span>Recent Farm Activity</span>
              </div>
              <button onClick={() => setMobileRightOpen(false)} className="p-1 rounded-xl text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <button onClick={handleNewConsultation} className="w-full py-3 px-4 rounded-2xl bg-[#14532D] text-white text-xs font-bold flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              <span>+ New Chat</span>
            </button>

            <div className="flex-1 overflow-y-auto space-y-2">
              {activityItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectActivity(item)}
                  className="w-full text-left p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 text-slate-900 flex items-center gap-3"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${item.iconBg}`}>
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{item.time}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
