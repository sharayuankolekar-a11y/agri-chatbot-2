import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Disclaimer({ riskLevel = 'LOW' }) {
  return (
    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2.5 my-4">
      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-slate-700 dark:text-slate-300">Important Disclaimer: </span>
        ScamSniff provides automated risk assessment based on provided content and structural indicators. It is not a legal authority or guarantee.
        {riskLevel === 'LOW' && (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 ml-1">
            "No obvious scam indicators were identified based on the information provided, but this does not guarantee safety."
          </span>
        )}
      </div>
    </div>
  );
}
