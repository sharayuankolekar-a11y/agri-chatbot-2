import React from 'react';

export default function ScamSniffLogo({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <linearGradient id="logoEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Background Base */}
      <rect width="512" height="512" rx="120" fill="url(#logoBgGrad)" />
      
      {/* Outer Accent Border */}
      <rect x="16" y="16" width="480" height="480" rx="104" stroke="#10b981" strokeWidth="10" strokeOpacity="0.3" fill="none" />

      {/* Radar Scan Arcs */}
      <path d="M 240 100 A 140 140 0 0 1 380 240" stroke="#10b981" strokeWidth="14" strokeLinecap="round" strokeDasharray="20 16" opacity="0.7" fill="none" />

      {/* ScamSniff Detection Icon */}
      <g>
        <circle cx="216" cy="216" r="110" stroke="url(#logoEmeraldGrad)" strokeWidth="36" fill="none" />
        <circle cx="216" cy="216" r="90" fill="#047857" fillOpacity="0.4" />

        <path d="M 166 216 A 50 50 0 0 1 216 166" stroke="#ffffff" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M 140 216 A 76 76 0 0 1 216 140" stroke="#34d399" strokeWidth="14" strokeLinecap="round" opacity="0.9" fill="none" />

        <circle cx="216" cy="216" r="18" fill="#ffffff" />

        <path d="M 298 298 L 404 404" stroke="url(#logoEmeraldGrad)" strokeWidth="44" strokeLinecap="round" fill="none" />
        <path d="M 298 298 L 404 404" stroke="#ffffff" strokeWidth="20" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}
