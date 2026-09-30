import React from 'react';
import { Info, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AgriSphereLogo from './AgriSphereLogo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#1F7A4D]/20 bg-white text-slate-700 py-10 transition-colors relative z-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm">
                <AgriSphereLogo className="w-full h-full" />
              </div>
              <span className="font-black text-xl tracking-tight text-[#14532D]">
                Agri<span className="text-[#1F7A4D]">Sphere</span>
              </span>
            </div>
            
            <p className="text-xs font-black text-[#14532D]">
              "{t('footer.tagline')}"
            </p>
            
            <p className="text-xs text-slate-600 max-w-md leading-relaxed font-bold">
              {t('footer.desc')}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#1F7A4D] font-black">
              <ShieldCheck className="w-4 h-4 text-[#1F7A4D] shrink-0" />
              <span>{t('footer.multilingual')}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-black text-[#14532D] text-xs uppercase tracking-wider mb-3.5">
              {t('footer.navTitle')}
            </h4>
            <ul className="space-y-2.5 text-xs font-bold">
              <li><Link to="/" className="hover:text-[#1F7A4D] transition-colors">{t('nav.assistant')}</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#1F7A4D] transition-colors">{t('nav.dashboard')}</Link></li>
              <li><Link to="/crops" className="hover:text-[#1F7A4D] transition-colors">{t('nav.crops')}</Link></li>
              <li><Link to="/consultations" className="hover:text-[#1F7A4D] transition-colors">{t('nav.consultations')}</Link></li>
              <li><Link to="/learn" className="hover:text-[#1F7A4D] transition-colors">{t('nav.learn')}</Link></li>
            </ul>
          </div>

          {/* Agricultural Advisory Notice */}
          <div>
            <h4 className="font-black text-[#14532D] text-xs uppercase tracking-wider mb-3.5">
              {t('footer.noticeTitle')}
            </h4>
            <div className="p-4 rounded-2xl bg-[#F6F3E8] border border-[#1F7A4D]/20 text-[11px] leading-relaxed space-y-2 shadow-sm">
              <div className="flex items-start gap-1.5 text-[#14532D] font-black">
                <Info className="w-4 h-4 text-[#1F7A4D] shrink-0 mt-0.5" />
                <span>{t('footer.safety')}</span>
              </div>
              <p className="text-slate-600 font-semibold">
                {t('footer.disclaimer')}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1F7A4D]/10 text-center text-xs font-bold text-slate-500">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
