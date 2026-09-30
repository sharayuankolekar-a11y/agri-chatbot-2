import React from 'react';
import { Sprout, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AgriResultCard from './AgriResultCard';
import AgriSphereLogo from './AgriSphereLogo';

export default function ChatInterface({
  messages = [],
  userMessage,
  userImage,
  isLoading,
  error,
  isUnrelated,
  unrelatedMessage,
  result,
  onReset,
  onRetry,
  messagesEndRef
}) {
  const { t } = useLanguage();

  // If no messages array provided, construct one from legacy props for backwards compatibility
  const messageList = (Array.isArray(messages) && messages.length > 0)
    ? messages
    : (userMessage || userImage || result || isUnrelated)
      ? [
          ...(userMessage || userImage ? [{ id: 'usr-legacy', role: 'user', content: userMessage, image: userImage }] : []),
          ...(isUnrelated ? [{ id: 'ast-legacy-unrelated', role: 'assistant', isUnrelated: true, unrelatedMessage }] : []),
          ...(result ? [{ id: 'ast-legacy-result', role: 'assistant', result }] : [])
        ]
      : [];

  if (messageList.length === 0 && !isLoading && !error) return null;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 py-2 transition-all duration-300">

      {/* Render Continuous Message List */}
      {messageList.map((msg, idx) => {
        if (msg.role === 'user') {
          return (
            <div key={msg.id || `user-${idx}`} className="flex justify-end my-2">
              <div className="max-w-xl p-3.5 sm:p-4 rounded-3xl rounded-tr-none bg-[#1F7A4D] text-white font-bold text-xs sm:text-sm shadow-md space-y-2">
                {msg.image && (
                  <div className="w-48 h-36 rounded-2xl overflow-hidden bg-black/20 border border-white/20">
                    <img src={msg.image} alt="Crop upload" className="w-full h-full object-cover" />
                  </div>
                )}
                {msg.content && <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>}
              </div>
            </div>
          );
        }

        if (msg.role === 'assistant') {
          // Domain Guardrail Rejection Notice
          if (msg.isUnrelated) {
            return (
              <div key={msg.id || `ast-${idx}`} className="flex items-start gap-3 my-2">
                <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-sm border border-[#1F7A4D]/20">
                  <AgriSphereLogo className="w-full h-full" />
                </div>
                <div className="p-4 sm:p-5 rounded-3xl rounded-tl-none bg-white/95 dark:bg-[#091A13]/95 backdrop-blur-md border border-[#1F7A4D]/25 shadow-lg max-w-xl space-y-2 text-left">
                  <div className="flex items-center gap-1.5 text-[#1F7A4D] dark:text-emerald-400 font-black text-xs uppercase tracking-wider">
                    <Sprout className="w-4 h-4" />
                    <span>{t('chat.guardrailTitle') || 'AgriSphere Assistant'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                    {msg.unrelatedMessage || msg.content || t('chat.guardrailDefault')}
                  </p>
                </div>
              </div>
            );
          }

          // Normal Assistant Result Card
          return (
            <div key={msg.id || `ast-${idx}`} className="flex items-start gap-3 my-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-sm border border-[#1F7A4D]/20">
                <AgriSphereLogo className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <AgriResultCard result={msg.result || msg} onReset={null} />
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* AI Loading Thinking Indicator */}
      {isLoading && (
        <div className="flex items-start gap-3 my-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-sm border border-[#1F7A4D]/20">
            <AgriSphereLogo className="w-full h-full" />
          </div>
          <div className="p-4 rounded-3xl rounded-tl-none bg-white/95 dark:bg-[#091A13]/95 backdrop-blur-md border border-[#1F7A4D]/20 shadow-md flex items-center gap-3">
            <Sprout className="w-5 h-5 text-[#1F7A4D] animate-spin" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-black text-[#14532D] dark:text-emerald-300">
                  {t('chat.analyzing') || 'AgriSphere is thinking...'}
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A4D] animate-bounce" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                {t('chat.evaluating') || 'Evaluating crop health, soil parameters & agricultural guidance...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-start gap-3 my-2">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="p-4 rounded-3xl rounded-tl-none bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-200 space-y-2 max-w-xl text-xs font-semibold shadow-md">
            <p className="font-extrabold">{t('chat.errorTitle') || 'Connection Error'}</p>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-sm transition-colors hover:bg-red-700"
              >
                {t('chat.tryAgain') || 'Try Again'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />

    </div>
  );
}
