import React, { useState, useEffect } from 'react';
import { CheckCircle2, ThumbsUp, ThumbsDown, Copy, Check, X, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitFeedback } from '../services/api';

export default function AgriResultCard({ result, onReset }) {
  const { t } = useLanguage();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract main response text safely
  const rawMsg = result?.message || result?.assessment || result?.answer;
  const mainMessage = typeof rawMsg === 'string'
    ? rawMsg
    : (rawMsg ? String(rawMsg) : (result ? 'Agricultural guidance completed.' : ''));
  const displayTitle = typeof result?.title === 'string' && result.title.trim() !== ''
    ? result.title
    : (typeof result?.crop === 'string' && result.crop !== 'General Crop' ? result.crop : null);
  const targetId = result?.consultationId || result?.scanId;

  // Progressive typing effect
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!mainMessage) return;
    setDisplayedText('');
    setIsTyping(true);

    let idx = 0;
    const speed = Math.max(6, Math.floor(350 / mainMessage.length));
    const interval = setInterval(() => {
      idx++;
      setDisplayedText(mainMessage.slice(0, idx));
      if (idx >= mainMessage.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [mainMessage]);

  if (!result) return null;

  const handleFeedback = async (isHelpful) => {
    if (feedbackSent || feedbackLoading || !targetId) return;
    setFeedbackLoading(true);
    try {
      await submitFeedback(targetId, isHelpful);
    } catch (e) {
      console.warn('Feedback submit error:', e);
    }
    setFeedbackLoading(false);
    setFeedbackSent(true);
  };

  const handleCopy = () => {
    try {
      const textToCopy = `${displayTitle ? displayTitle + '\n\n' : ''}${mainMessage}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy clipboard failed:', err);
    }
  };

  // Safe paragraph & bullet formatter
  const renderFormattedContent = (text) => {
    const safeText = typeof text === 'string' ? text : String(text || '');
    if (!safeText) return null;

    const lines = safeText.split('\n');
    return lines.map((line, i) => {
      const safeLine = typeof line === 'string' ? line : String(line || '');
      const trimmed = safeLine.trim();
      if (!trimmed) return <div key={i} className="h-2" />;
      
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return (
          <h4 key={i} className="text-sm font-black text-[#14532D] dark:text-emerald-300 mt-2 mb-1">
            {trimmed.replace(/\*\*/g, '')}
          </h4>
        );
      }

      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        const bulletText = trimmed.replace(/^([\bullet\-\*]|\d+\.)\s*/, '');
        return (
          <div key={i} className="flex items-start gap-2 py-0.5 pl-1">
            <span className="text-[#1F7A4D] font-bold shrink-0 mt-0.5">•</span>
            <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
              {renderInlineBold(bulletText)}
            </span>
          </div>
        );
      }

      return (
        <p key={i} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed my-1">
          {renderInlineBold(safeLine)}
        </p>
      );
    });
  };

  const renderInlineBold = (str) => {
    const safeStr = typeof str === 'string' ? str : String(str || '');
    const parts = safeStr.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part && part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-[#14532D] dark:text-emerald-300">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const warnings = Array.isArray(result.warnings) ? result.warnings : [];
  const recommendedActions = Array.isArray(result.recommendedActions) ? result.recommendedActions : [];
  const followUpQuestion = typeof result.followUpQuestion === 'string' ? result.followUpQuestion : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 text-left transition-all duration-300">
      
      {/* Main Conversational Response Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#091A13] border border-[#1F7A4D]/25 shadow-xl space-y-4 relative">
        
        {/* Title & Close Header */}
        <div className="flex items-center justify-between gap-3">
          {displayTitle ? (
            <h3 className="text-base sm:text-lg font-black text-[#14532D] dark:text-white tracking-tight">
              {displayTitle}
            </h3>
          ) : (
            <div className="text-xs font-bold text-[#1F7A4D] dark:text-emerald-400 uppercase tracking-wider">
              {typeof result.category === 'string' ? result.category : 'AgriSphere AI Advisory'}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#1F7A4D]/10 text-slate-700 dark:text-slate-300 hover:text-[#1F7A4D] text-xs font-extrabold transition-all"
              title="Copy response text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {onReset && (
              <button
                onClick={onReset}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Close response"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="text-xs sm:text-sm space-y-1">
          {renderFormattedContent(displayedText)}
          {isTyping && <span className="w-2 h-4 bg-[#1F7A4D] animate-pulse inline-block rounded-xs ml-1" />}
        </div>

        {/* Warnings Highlight (if present) */}
        {warnings.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {warnings.map((w, idx) => (
                <p key={idx}>{typeof w === 'string' ? w : String(w || '')}</p>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions List (if present) */}
        {recommendedActions.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/80 border border-[#1F7A4D]/15 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#14532D] dark:text-emerald-300 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#1F7A4D]" />
              <span>Recommended Actions</span>
            </div>
            <div className="space-y-1.5 pl-1">
              {recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 font-bold">
                  <span className="text-[#1F7A4D] shrink-0 font-extrabold">•</span>
                  <span>{typeof action === 'string' ? action : String(action || '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up Question Prompt */}
        {followUpQuestion && (
          <div className="p-3 rounded-2xl bg-[#1F7A4D]/5 border border-[#1F7A4D]/20 text-xs font-bold text-[#14532D] dark:text-emerald-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#1F7A4D] shrink-0" />
            <span>{followUpQuestion}</span>
          </div>
        )}

      </div>

      {/* Action Footer: Feedback & Ask Another Question */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#091A13] border border-[#1F7A4D]/20 flex items-center justify-between gap-3 text-xs flex-wrap shadow-md">
        
        {/* Feedback Yes / No */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
            {t('result.helpful') || 'Was this guidance helpful?'}
          </span>
          {feedbackSent ? (
            <span className="font-black text-[#1F7A4D] dark:text-emerald-400 text-xs">
              {t('result.thanks') || '✓ Thank you for your feedback!'}
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleFeedback(true)}
                disabled={feedbackLoading}
                className="px-3 py-1.5 rounded-xl bg-[#1F7A4D]/10 hover:bg-[#1F7A4D]/20 text-[#14532D] dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{t('result.yes') || 'Yes'}</span>
              </button>
              <button
                onClick={() => handleFeedback(false)}
                disabled={feedbackLoading}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>{t('result.no') || 'No'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Ask Another Question Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-[#1F7A4D] hover:bg-[#14532D] text-white font-black text-xs transition-all shadow-md active:scale-95"
          >
            {t('result.askAnother') || 'Ask Another Question'}
          </button>
        )}

      </div>

    </div>
  );
}
