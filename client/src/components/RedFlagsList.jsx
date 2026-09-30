import React from 'react';
import { Flag, AlertTriangle, AlertCircle } from 'lucide-react';

export default function RedFlagsList({ redFlags = [] }) {
  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
        <span>✓ No immediate red flags detected.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {redFlags.map((flag, idx) => {
        const isHigh = flag.severity === 'HIGH';
        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-3 transition-all hover:border-red-500/40"
          >
            <div className={`p-2 rounded-lg shrink-0 ${isHigh ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
              {isHigh ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Flag className="w-4 h-4 text-red-500" />
                  {flag.title}
                </h5>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  isHigh ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                }`}>
                  {flag.severity || 'HIGH'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {flag.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
