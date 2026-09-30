import React, { useEffect, useRef } from 'react';
import AgriSphereLogo from './AgriSphereLogo';

export default function AiCenterpiece({ isAnalyzing = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    const width = (canvas.width = 240);
    const height = (canvas.height = 240);
    const centerX = width / 2;
    const centerY = height / 2;

    let angle = 0;

    const render = () => {
      angle += isAnalyzing ? 0.03 : 0.008;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft Warm Volumetric Ambient Light Halo
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 15, centerX, centerY, 105);
      bgGlow.addColorStop(0, isAnalyzing ? 'rgba(67, 160, 71, 0.25)' : 'rgba(234, 179, 8, 0.15)');
      bgGlow.addColorStop(0.5, 'rgba(46, 125, 50, 0.08)');
      bgGlow.addColorStop(1, 'rgba(247, 248, 242, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 105, 0, Math.PI * 2);
      ctx.fill();

      // 2. Transparent Glass Sphere & Inner Botanical Orbit
      ctx.save();
      ctx.translate(centerX, centerY);

      // Primary Glass Meridian Orbit
      ctx.rotate(angle * 0.6);
      ctx.strokeStyle = isAnalyzing ? 'rgba(67, 160, 71, 0.45)' : 'rgba(46, 125, 50, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 88, 38, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary Refractive Equatorial Glass Ring
      ctx.rotate(-angle * 0.9);
      ctx.strokeStyle = isAnalyzing ? 'rgba(234, 179, 8, 0.45)' : 'rgba(234, 179, 8, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, 78, 30, -Math.PI / 3, 0, Math.PI * 2);
      ctx.stroke();

      // Soft Light Particles / Glowing Energy Nodes (Only during analysis or subtle breathing)
      if (isAnalyzing) {
        for (let i = 0; i < 3; i++) {
          const nodeAngle = angle * 2.5 + (i * Math.PI * 2) / 3;
          const nx = Math.cos(nodeAngle) * 78;
          const ny = Math.sin(nodeAngle) * 30;
          ctx.beginPath();
          ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#43A047';
          ctx.shadowColor = '#EAB308';
          ctx.shadowBlur = 10;
          ctx.fill();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAnalyzing]);

  return (
    <div className="relative flex items-center justify-center my-3 py-1 select-none">
      
      {/* 3D Glass Sphere Atmosphere & Orbit Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute w-[240px] h-[240px] pointer-events-none transition-opacity duration-700"
      />

      {/* Centerpiece 3D Glass Seed/Leaf Core */}
      <div className={`relative z-10 w-24 h-24 rounded-3xl p-4 bg-gradient-to-br from-white/90 via-[#E8F5E9]/90 to-[#F7F8F2]/95 backdrop-blur-2xl border border-emerald-500/25 shadow-xl shadow-emerald-900/10 flex items-center justify-center transition-all duration-700 ${
        isAnalyzing
          ? 'scale-105 border-emerald-500/60 shadow-emerald-500/30'
          : 'hover:scale-102 hover:border-emerald-500/40 hover:shadow-2xl'
      }`}>
        {/* Soft Internal Sun/Green Breathing Glow */}
        <div className="absolute inset-2 rounded-2xl bg-gradient-to-tr from-emerald-500/15 via-amber-400/10 to-transparent blur-md animate-pulse" />
        
        <div className="relative z-10 w-full h-full text-emerald-700 dark:text-emerald-500 drop-shadow-[0_4px_8px_rgba(46,125,50,0.25)]">
          <AgriSphereLogo className="w-full h-full" />
        </div>
      </div>

    </div>
  );
}
