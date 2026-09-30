import React, { useEffect, useState } from 'react';
import { Activity, Sprout, Droplets, FlaskConical, BarChart3, Clock, ArrowRight, ShieldCheck, Sun, Leaf, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import FarmCanvas from '../components/FarmCanvas';
import { getDashboardStats } from '../services/api';
import { formatDate } from '../utils/formatters';

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await getDashboardStats();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    }
    loadData();
  }, []);

  const defaultStats = stats || {
    totalConsultations: 142,
    plantHealthCases: 54,
    irrigationGuidance: 38,
    fertilizerSoil: 32,
    pestManagement: 18,
    categories: [
      { category: 'Plant Disease', count: 54 },
      { category: 'Irrigation Guidance', count: 38 },
      { category: 'Fertilizers & Soil', count: 32 },
      { category: 'Pest Management', count: 18 },
      { category: 'Crop Selection', count: 14 }
    ],
    recentConsultations: []
  };

  const chartColors = ['#1F7A4D', '#0284C7', '#D9A441', '#7C3AED', '#059669'];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-hidden bg-[#F6F3E8] text-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Farm Intelligence Header Card with Interactive Farm Visualization Map */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F7A4D]/10 text-[#14532D] text-xs font-black mb-2">
                <Activity className="w-4 h-4 text-[#1F7A4D]" />
                <span>{t('dashboard.badge')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#14532D] tracking-tight">
                {t('dashboard.title')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black shrink-0 self-start md:self-center shadow-sm">
              {t('dashboard.liveBadge')}
            </span>
          </div>

          {/* Embedded 3D Farm Map Visualization */}
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#1F7A4D]/20 shadow-inner">
            <FarmCanvas isInteractive={true} />
          </div>
        </div>

        {/* 4 Core Intelligence Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-md space-y-2 hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{t('dashboard.totalInquiries')}</span>
              <div className="p-2.5 rounded-2xl bg-[#1F7A4D]/10 text-[#1F7A4D]">
                <Sprout className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#14532D]">
              {defaultStats.totalConsultations}
            </p>
            <p className="text-xs font-bold text-slate-600">{t('dashboard.totalDesc')}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-md space-y-2 hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{t('dashboard.diseaseChecks')}</span>
              <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-[#1F7A4D]">
              {defaultStats.plantHealthCases}
            </p>
            <p className="text-xs font-bold text-slate-600">{t('dashboard.diseaseDesc')}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-md space-y-2 hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{t('dashboard.irrigationAdvice')}</span>
              <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-800">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-sky-800">
              {defaultStats.irrigationGuidance}
            </p>
            <p className="text-xs font-bold text-slate-600">{t('dashboard.irrigationDesc')}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-md space-y-2 hover:scale-[1.01] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{t('dashboard.soilFertilizer')}</span>
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-800">
              {defaultStats.fertilizerSoil}
            </p>
            <p className="text-xs font-bold text-slate-600">{t('dashboard.soilDesc')}</p>
          </div>

        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1F7A4D]" />
              <h3 className="font-black text-[#14532D] text-base">
                {t('dashboard.breakdownTitle')}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold">{t('dashboard.breakdownSub')}</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultStats.categories} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#475569', fontWeight: 'bold' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#475569', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#1F7A4D',
                    borderRadius: '16px',
                    color: '#0F172A',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                  {defaultStats.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Consultations Table */}
        {defaultStats.recentConsultations && defaultStats.recentConsultations.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1F7A4D]" />
                <h3 className="font-black text-[#14532D] text-base">
                  {t('dashboard.recentTitle')}
                </h3>
              </div>
              <Link
                to="/consultations"
                className="text-xs font-black text-[#1F7A4D] hover:underline flex items-center gap-1"
              >
                <span>{t('dashboard.viewFullHistory')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-black">
                    <th className="pb-3">{t('dashboard.colDate')}</th>
                    <th className="pb-3">{t('dashboard.colCrop')}</th>
                    <th className="pb-3">{t('dashboard.colTopic')}</th>
                    <th className="pb-3">{t('dashboard.colAssessment')}</th>
                    <th className="pb-3 text-right">{t('dashboard.colConfidence')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                  {defaultStats.recentConsultations.map((item, idx) => (
                    <tr key={item._id || idx} className="hover:bg-[#1F7A4D]/5 transition-colors">
                      <td className="py-3.5 font-bold">{formatDate(item.createdAt)}</td>
                      <td className="py-3.5 font-black text-[#14532D]">{item.crop}</td>
                      <td className="py-3.5">{item.category}</td>
                      <td className="py-3.5 truncate max-w-xs">{item.assessment}</td>
                      <td className="py-3.5 text-right font-black text-[#1F7A4D]">
                        {item.confidence}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
