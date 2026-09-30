import React from 'react';
import { MessageSquareText, Link2, Briefcase, CreditCard } from 'lucide-react';

export default function QuickActions({ selectedMode, onSelectMode }) {
  const actions = [
    {
      id: 'MESSAGE',
      title: 'Check a Message',
      subtitle: 'SMS, WhatsApp, Social Media, Email',
      icon: MessageSquareText,
      color: 'hover:border-blue-500 hover:bg-blue-500/5 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'LINK',
      title: 'Check a Link',
      subtitle: 'URLs, Phishing domains, Shortened links',
      icon: Link2,
      color: 'hover:border-purple-500 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400'
    },
    {
      id: 'INTERNSHIP',
      title: 'Check an Internship',
      subtitle: 'Job offers, Recruiter chats, Registration fees',
      icon: Briefcase,
      color: 'hover:border-amber-500 hover:bg-amber-500/5 text-amber-600 dark:text-amber-400'
    },
    {
      id: 'PAYMENT',
      title: 'Check a Payment Request',
      subtitle: 'UPI, QR codes, Advance fees, Refunds, OTPs',
      icon: CreditCard,
      color: 'hover:border-emerald-500 hover:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-6">
      {actions.map((act) => {
        const Icon = act.icon;
        const isSelected = selectedMode === act.id;
        return (
          <button
            key={act.id}
            onClick={() => onSelectMode(act.id)}
            className={`flex items-start gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
              isSelected
                ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:scale-[1.02]'
            } ${act.color}`}
          >
            <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {act.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {act.subtitle}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
