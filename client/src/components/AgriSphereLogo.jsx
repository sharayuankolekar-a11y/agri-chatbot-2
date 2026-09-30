import React, { useId } from 'react';

export default function AgriSphereLogo({ className = "w-6 h-6" }) {
  // Unique ids per instance: several logos can be on screen at once (sidebar, top-left brand, intro),
  // and a url(#id) reference to a gradient inside a display:none logo would render blank.
  const uid = useId().replace(/:/g, '');
  const bgId = `logoAgriBg-${uid}`;
  const leafId = `logoLeafGrad-${uid}`;
  const goldId = `logoGoldGrad-${uid}`;
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <linearGradient id={leafId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id={goldId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Outer Rounded Container */}
      <rect width="512" height="512" rx="128" fill={`url(#${bgId})`} />
      <rect x="16" y="16" width="480" height="480" rx="112" fill="none" stroke="#10b981" strokeWidth="8" strokeOpacity="0.3" />

      {/* Sun Rays Accent */}
      <circle cx="256" cy="180" r="110" fill={`url(#${goldId})`} opacity="0.15" />

      {/* AgriSphere Leaf & Sprout Symbol */}
      <g transform="translate(256, 260)">
        {/* Right Leaf */}
        <path d="M 0 60 C 90 20, 160 -40, 140 -140 C 40 -120, -10 -40, 0 60 Z" fill={`url(#${leafId})`} />
        
        {/* Left Leaf */}
        <path d="M 0 60 C -90 10, -150 -50, -130 -130 C -40 -110, 10 -30, 0 60 Z" fill="#059669" />
        
        {/* Central Sprout Vein */}
        <path d="M 0 100 L 0 -150" stroke="#ffffff" strokeWidth="16" strokeLineCap="round" />
        
        {/* Soil / Field Arc Base */}
        <path d="M -160 110 Q 0 160 160 110" fill="none" stroke={`url(#${goldId})`} strokeWidth="24" strokeLineCap="round" />
      </g>
    </svg>
  );
}
