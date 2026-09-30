import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DemoPresets({ onSelectPreset }) {
  const presets = [
    {
      label: '🎁 Prize Scam',
      mode: 'PAYMENT',
      text: 'Congratulations! You have been selected for a ₹50,000 government reward. Pay ₹299 processing fee immediately.'
    },
    {
      label: '💼 Internship Scam',
      mode: 'INTERNSHIP',
      text: 'Your internship application has been shortlisted. Pay ₹1,500 registration fee to confirm your position.'
    },
    {
      label: '🏦 KYC Phishing',
      mode: 'LINK',
      text: 'Your bank KYC has expired. Click this link immediately to avoid account suspension: http://secure-bank-kyc.top/login'
    },
    {
      label: '💸 Payment Scam',
      mode: 'PAYMENT',
      text: 'Someone is asking me for an OTP to process my refund.'
    },
    {
      label: '✅ Safe Message',
      mode: 'MESSAGE',
      text: 'Hi Team, please find attached the slide deck for our project presentation scheduled for tomorrow at 10 AM. Regards, Alex.'
    }
  ];

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
        <span>Try a Live Demo Sample (Presentation Mode):</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPreset(preset.text, preset.mode)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all hover:scale-105"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
