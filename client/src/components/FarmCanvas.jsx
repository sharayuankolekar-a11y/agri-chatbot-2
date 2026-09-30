import React, { useState } from 'react';
import { Leaf, Droplets, FlaskConical, Sun, ShieldCheck, Cpu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FarmCanvas({ isInteractive = true, onSelectTelemetry, showBackground = false }) {
  const { t } = useLanguage();
  const [activePin, setActivePin] = useState(null);

  const telemetryMarkers = [
    {
      id: 'soil-health',
      top: '68%',
      left: '36%',
      icon: FlaskConical,
      label: t('farmOverlay.soil') || 'Soil Health',
      status: t('farmOverlay.soilStatus') || 'pH 6.8 (Good)',
      detail: 'Rich alluvial loam with balanced N-P-K reserves',
      badgeColor: 'bg-[#8A5A2B] text-white border-[#D9B98A]',
      glow: 'shadow-black/25'
    },
    {
      id: 'crop-health',
      top: '56%',
      left: '32%',
      icon: Leaf,
      label: t('farmOverlay.cropHealth') || 'Crop Health',
      status: t('farmOverlay.cropHealthStatus') || 'Healthy (94% Vigor)',
      detail: 'Vegetable plots: Tomato, Cabbage & Leafy Greens',
      badgeColor: 'bg-[#3F7D3A] text-white border-[#B9D9A8]',
      glow: 'shadow-black/25'
    },
    {
      id: 'irrigation',
      top: '65%',
      left: '52%',
      icon: Droplets,
      label: t('farmOverlay.water') || 'Irrigation',
      status: t('farmOverlay.waterStatus') || 'Optimal Level',
      detail: 'Drip sprinklers & water reservoir pump active',
      badgeColor: 'bg-[#2F6F73] text-white border-[#A9CFCF]',
      glow: 'shadow-black/25'
    },
    {
      id: 'greenhouse',
      top: '58%',
      left: '66%',
      icon: ShieldCheck,
      label: t('farmOverlay.greenhouse') || 'Greenhouse',
      status: t('farmOverlay.greenhouseStatus') || 'Controlled Climate',
      detail: 'Temperature 24°C | Humidity 65% | UV Shield',
      badgeColor: 'bg-[#55753F] text-white border-[#C4D6A8]',
      glow: 'shadow-black/25'
    },
    {
      id: 'drone',
      top: '42%',
      left: '68%',
      icon: Cpu,
      label: 'Drone Surveillance',
      status: 'Active Scanning',
      detail: 'Multispectral NDVI map generation in progress',
      badgeColor: 'bg-[#5B4B3A] text-white border-[#CDBBA3]',
      glow: 'shadow-black/25'
    },
    {
      id: 'weather',
      top: '54%',
      left: '75%',
      icon: Sun,
      label: t('farmOverlay.weather') || 'Weather',
      status: t('farmOverlay.weatherStatus') || '28°C Sunshine',
      detail: 'Wind: 12 km/h NE | Solar Radiation: High',
      badgeColor: 'bg-[#B9822B] text-white border-[#EBCF9B]',
      glow: 'shadow-black/25'
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] select-none pointer-events-auto">
      
      {/* Optional Standalone Background Image */}
      {showBackground && (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#07130e] rounded-3xl">
          <img
            src="/AgriSphere.png"
            alt="AgriSphere Smart Farm Landscape"
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </div>
      )}

      {/* TOP BRANDING TELEMETRY OVERLAY BADGE */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#FBF6E9]/95 dark:bg-[#091A13]/90 border border-[#DCCFB0] dark:border-[#1F7A4D]/30 shadow-md text-slate-900 dark:text-white">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#14532D] dark:text-emerald-300">
            SMART FARM LIVE TELEMETRY
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300 border-l border-slate-300 pl-2">
            Real-time IoT & AI Monitoring Active
          </span>
        </div>
      </div>

      {/* FLOATING INTERACTIVE TELEMETRY MARKERS */}
      {isInteractive && telemetryMarkers.map((marker) => {
        const Icon = marker.icon;
        const isActive = activePin === marker.id;

        return (
          <div
            key={marker.id}
            style={{ top: marker.top, left: marker.left }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
          >
            <div className="relative group/pin">
              
              {/* Radar Pulse Ring */}
              <div className="absolute -inset-2 rounded-full bg-[#FBF5E3]/30 animate-pulse pointer-events-none" />

              {/* Marker Button */}
              <button
                onClick={() => {
                  setActivePin(isActive ? null : marker.id);
                  if (onSelectTelemetry) onSelectTelemetry(marker);
                }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-md transition-all transform hover:-translate-y-px active:scale-95 ${marker.badgeColor} ${marker.glow}`}
                title={marker.label}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] font-semibold whitespace-nowrap">
                  {marker.label}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              </button>

              {/* Hover / Active Telemetry Glassmorphism Detail Card */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-2xl bg-[#FBF6E9] dark:bg-[#091A13] border border-[#DCCFB0] dark:border-[#1F7A4D]/30 shadow-lg transition-all duration-200 pointer-events-none z-30 ${
                  isActive ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 group-hover/pin:opacity-100 group-hover/pin:scale-100 group-hover/pin:translate-y-0'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-xl ${marker.badgeColor}`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#14532D] dark:text-white leading-tight">
                      {marker.label}
                    </h5>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {marker.status}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-snug">
                  {marker.detail}
                </p>
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}
