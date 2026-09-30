import React from 'react';

export default function GaugeChart({ score = 0, riskLevel = 'LOW' }) {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // Green
  if (riskLevel === 'HIGH') strokeColor = '#ef4444'; // Red
  else if (riskLevel === 'SUSPICIOUS') strokeColor = '#f59e0b'; // Amber

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-32 h-32 transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800"
          fill="transparent"
        />
        {/* Progress ring */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
          {clampedScore}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}
