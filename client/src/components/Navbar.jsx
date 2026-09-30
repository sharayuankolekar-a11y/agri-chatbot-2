import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Sprout, Activity, History as HistoryIcon, BookOpen, Globe, Grid } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AgriSphereLogo from './AgriSphereLogo';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav.assistant'), path: '/assistant', icon: Sprout },
    { label: t('nav.dashboard'), path: '/dashboard', icon: Activity },
    { label: t('nav.crops'), path: '/crops', icon: Grid },
    { label: t('nav.consultations'), path: '/consultations', icon: HistoryIcon },
    { label: t('nav.learn'), path: '/learn', icon: BookOpen },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto px-3 sm:px-6 w-full">
      <div className="rounded-2xl bg-white dark:bg-[#091A13] border border-[#1F7A4D]/15 shadow-lg shadow-black/5 transition-all">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6">

          {/* Left: Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
              <AgriSphereLogo className="w-full h-full" />
            </div>
            <div className="flex items-center tracking-tight font-black text-lg sm:text-xl leading-none">
              <span className="text-[#14532D] dark:text-white">Agri</span>
              <span className="text-[#1F7A4D] dark:text-emerald-400">Sphere</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    active
                      ? 'bg-[#1F7A4D] text-white shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:text-[#1F7A4D] dark:hover:text-emerald-400 hover:bg-[#1F7A4D]/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Controls (Global Language Selector & Theme Toggle) */}
          <div className="flex items-center gap-2">
            
            {/* Global Language Selector */}
            <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-[#1F7A4D]/20 bg-[#F6F3E8]/60 dark:bg-slate-900/60 shadow-sm text-xs font-bold text-slate-800 dark:text-slate-200">
              <Globe className="w-3.5 h-3.5 text-[#1F7A4D] dark:text-emerald-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer font-bold text-xs text-slate-900 dark:text-slate-100 pr-1"
                aria-label="Select language"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold">
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className="p-1.5 sm:p-2 rounded-xl border border-[#1F7A4D]/20 bg-[#F6F3E8]/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-[#1F7A4D]/10 transition-colors shadow-sm"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Menu Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-[#1F7A4D]/10"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-[#1F7A4D]/20 bg-white dark:bg-[#091A13] p-3 space-y-1.5 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                  active
                    ? 'bg-[#1F7A4D] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-[#1F7A4D]/10'
                }`}
              >
                <Icon className="w-4 h-4 text-[#1F7A4D]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
