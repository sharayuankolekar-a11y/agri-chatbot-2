import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sprout, RefreshCw, ShieldCheck, Droplets, FlaskConical, Bug, Sun, ArrowUpRight } from 'lucide-react';
import ChatComposer from '../components/ChatComposer';
import ChatInterface from '../components/ChatInterface';
import FarmCanvas from '../components/FarmCanvas';
import { useLanguage } from '../context/LanguageContext';
import { analyzeContent } from '../services/api';

export default function Home() {
  const location = useLocation();
  const { language, t } = useLanguage();
  const [submittedText, setSubmittedText] = useState('');
  const [submittedImage, setSubmittedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isUnrelated, setIsUnrelated] = useState(false);
  const [unrelatedMessage, setUnrelatedMessage] = useState('');
  const [error, setError] = useState(null);

  const commandDockActions = [
    { id: 'crop', labelKey: 'hero.cmdCrop', icon: Sprout, query: 'Which crop is suitable for sandy loam soil in monsoon season?' },
    { id: 'disease', labelKey: 'hero.cmdDisease', icon: ShieldCheck, query: 'My tomato leaves are turning yellow with dark spots. What should I do?' },
    { id: 'water', labelKey: 'hero.cmdWater', icon: Droplets, query: 'When should I irrigate my rice paddy field during tillering stage?' },
    { id: 'fertilizer', labelKey: 'hero.cmdFertilizer', icon: FlaskConical, query: 'What is the recommended NPK fertilizer application schedule for maize?' },
    { id: 'pest', labelKey: 'hero.cmdPest', icon: Bug, query: 'How can I control aphids on onion crops organically using neem oil?' },
    { id: 'weather', labelKey: 'hero.cmdWeather', icon: Sun, query: 'What farming precautions should I take before heavy monsoon rain?' }
  ];

  // Prefill query from crop page navigation
  useEffect(() => {
    if (location.state?.prefillQuery) {
      handleSend({ queryText: location.state.prefillQuery, language });
    }
  }, [location.state]);

  const handleSend = async ({ queryText, image, language: overrideLang }) => {
    if (!queryText && !image) return;

    const currentLang = overrideLang || language;

    setSubmittedText(queryText);
    setSubmittedImage(image);
    setIsLoading(true);
    setError(null);
    setIsUnrelated(false);
    setAnalysisResult(null);

    try {
      const data = await analyzeContent({
        queryText,
        image,
        language: currentLang
      });

      if (data.success) {
        if (data.isUnrelated) {
          setIsUnrelated(true);
          setUnrelatedMessage(data.message || t('chat.guardrailDefault'));
        } else {
          setAnalysisResult(data.result);
        }
      } else {
        setError(data.error || 'Failed to complete analysis.');
      }
    } catch (err) {
      setError(err.message || 'Server connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedText('');
    setSubmittedImage(null);
    setAnalysisResult(null);
    setIsUnrelated(false);
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-hidden bg-[#F6F3E8] text-slate-900">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        
        {/* Main Asymmetric Hero Section */}
        {!submittedText && !submittedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[calc(100vh-10rem)]">
            
            {/* LEFT COLUMN: Communication (Eyebrow, Title, Subtitle, AI Command Panel, Quick Actions) */}
            <div className="lg:col-span-6 space-y-5 text-left order-2 lg:order-1">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F7A4D]/10 border border-[#1F7A4D]/20 text-[#14532D] dark:text-emerald-300 text-[11px] font-black uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#1F7A4D] animate-ping" />
                <span>{t('hero.eyebrow')}</span>
              </div>

              {/* Large Heading with Responsive clamp() */}
              <h1 className="font-black text-[#14532D] dark:text-white tracking-tight leading-[1.08]" style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.6rem)' }}>
                {t('hero.title1')}<br />
                <span className="text-[#1F7A4D] dark:text-emerald-400">{t('hero.title2')}</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
                {t('hero.desc')}
              </p>

              {/* Floating AI Command Panel */}
              <div className="pt-2">
                <ChatComposer
                  onSend={handleSend}
                  isLoading={isLoading}
                />
              </div>

              {/* Compact Command Menu Quick Actions */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Quick Agriculture Queries:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {commandDockActions.map((act) => {
                    const Icon = act.icon;
                    return (
                      <button
                        key={act.id}
                        onClick={() => handleSend({ queryText: act.query, language })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-[#1F7A4D]/20 text-slate-800 dark:text-slate-200 hover:text-[#1F7A4D] dark:hover:text-emerald-400 hover:border-[#1F7A4D] text-xs font-bold transition-all shadow-sm hover:scale-102"
                      >
                        <Icon className="w-3.5 h-3.5 text-[#1F7A4D]" />
                        <span>{t(act.labelKey)}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: 3D Farm Command Center Visualization */}
            <div className="lg:col-span-6 w-full h-full min-h-[350px] sm:min-h-[460px] order-1 lg:order-2">
              <FarmCanvas isInteractive={true} />
            </div>

          </div>
        )}

        {/* Live Conversation Stream (When user submits query) */}
        {(submittedText || submittedImage) && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between max-w-4xl mx-auto px-2">
              <span className="text-xs font-black text-[#14532D] uppercase tracking-wider flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#1F7A4D]" />
                <span>{t('chat.liveStream')}</span>
              </span>
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-[#1F7A4D]/20 text-slate-800 hover:bg-[#1F7A4D]/10 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#1F7A4D]" />
                <span>{t('chat.newQuestion')}</span>
              </button>
            </div>

            <ChatInterface
              userMessage={submittedText}
              userImage={submittedImage}
              isLoading={isLoading}
              error={error}
              isUnrelated={isUnrelated}
              unrelatedMessage={unrelatedMessage}
              result={analysisResult}
              onReset={handleReset}
              onRetry={() => handleSend({ queryText: submittedText, image: submittedImage, language })}
            />

            {/* Bottom Composer for continuing conversation */}
            <div className="pt-4 max-w-4xl mx-auto">
              <ChatComposer
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
