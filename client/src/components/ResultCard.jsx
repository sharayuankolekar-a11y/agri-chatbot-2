import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ThumbsUp, ThumbsDown, RotateCcw, AlertOctagon, HelpCircle } from 'lucide-react';
import GaugeChart from './GaugeChart';
import RedFlagsList from './RedFlagsList';
import Disclaimer from './Disclaimer';
import { getRiskColor, getRiskTitle } from '../utils/formatters';
import { submitFeedback } from '../services/api';

export default function ResultCard({ result, onReset }) {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  if (!result) return null;

  const {
    scanId,
    riskLevel = 'LOW',
    riskScore = 0,
    category = 'Other Suspicious Activity',
    redFlags = [],
    explanation = '',
    recommendedActions = []
  } = result;

  const colors = getRiskColor(riskLevel);
  const riskTitle = getRiskTitle(riskLevel);

  const handleFeedback = async (isHelpful) => {
    if (feedbackSent || feedbackLoading || !scanId) return;
    setFeedbackLoading(true);
    await submitFeedback(scanId, isHelpful);
    setFeedbackLoading(false);
    setFeedbackSent(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 space-y-6 transition-all duration-300">
      
      {/* 1. Header Banner & Risk Level Card */}
      <div className={`p-6 rounded-3xl border-2 shadow-xl backdrop-blur-md transition-all ${colors.bg} ${colors.border}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Risk Details */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-sm">
              <span className="text-base">{colors.dot}</span>
              <span className={colors.text}>{riskLevel} RISK</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {riskTitle}
            </h3>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category:</span>
              <span className="px-3 py-1 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-sm">
                {category}
              </span>
            </div>
          </div>

          {/* Gauge Meter */}
          <div className="shrink-0 bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800">
            <GaugeChart score={riskScore} riskLevel={riskLevel} />
          </div>
        </div>
      </div>

      {/* 2. Red Flags Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-500" />
          <span>Red Flags Detected</span>
        </h4>
        <RedFlagsList redFlags={redFlags} />
      </div>

      {/* 3. Why Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-500" />
          <span>Why does this look {riskLevel === 'LOW' ? 'safe' : 'suspicious'}?</span>
        </h4>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {explanation}
        </p>
      </div>

      {/* 4. What You Should Do Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>What You Should Do</span>
        </h4>
        <div className="grid grid-cols-1 gap-2.5">
          {recommendedActions.map((act, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <Disclaimer riskLevel={riskLevel} />

      {/* 5. Feedback & Reset Actions */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Was this analysis helpful?
          </span>
          {feedbackSent ? (
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              ✓ Thanks for your feedback!
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFeedback(true)}
                disabled={feedbackLoading}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Yes</span>
              </button>
              <button
                onClick={() => handleFeedback(false)}
                disabled={feedbackLoading}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <ThumbsDown className="w-4 h-4 text-red-500" />
                <span>No</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze Another</span>
        </button>
      </div>

    </div>
  );
}
