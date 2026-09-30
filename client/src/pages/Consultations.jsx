import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Search, Filter, Sprout, X, Eye, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import FarmCanvas from '../components/FarmCanvas';
import { getHistory } from '../services/api';
import { formatDate, getCategoryBadge } from '../utils/formatters';
import AgriResultCard from '../components/AgriResultCard';

export default function Consultations() {
  const { t } = useLanguage();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const categories = [
    'ALL',
    'Plant Disease',
    'Pest Management',
    'Fertilizers & Soil',
    'Irrigation Guidance',
    'Crop Selection',
    'General Agriculture'
  ];

  async function loadData() {
    setLoading(true);
    const data = await getHistory({
      category: categoryFilter,
      search
    });
    if (data.success) {
      const items = data.consultations || data.scans || [];
      setConsultations(items);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-x-hidden bg-[#F6F3E8] text-slate-900">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F7A4D]/10 text-[#14532D] text-xs font-black mb-2">
            <HistoryIcon className="w-4 h-4 text-[#1F7A4D]" />
            <span>{t('consultations.badge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#14532D] tracking-tight">
            {t('consultations.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
            {t('consultations.subtitle')}
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-3xl bg-white border border-[#1F7A4D]/20 shadow-md flex flex-col md:flex-row items-center gap-3">
          
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('consultations.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F6F3E8] border border-[#1F7A4D]/20 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F7A4D]/40"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2.5 rounded-2xl bg-[#F6F3E8] border border-[#1F7A4D]/20 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F7A4D]/40"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? t('consultations.allTopics') : cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Timeline List Format */}
        {loading ? (
          <div className="p-12 text-center text-slate-600 text-xs font-black animate-pulse">
            {t('consultations.loading')}
          </div>
        ) : consultations.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#1F7A4D]/20 text-center space-y-3 shadow-md">
            <Sprout className="w-10 h-10 text-[#1F7A4D] mx-auto" />
            <h3 className="font-black text-[#14532D] text-lg">
              {t('consultations.noLogs')}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto font-bold">
              {t('consultations.noLogsSub')}
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1F7A4D]/30">
            {consultations.map((item, idx) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div key={item._id || idx} className="relative group">
                  {/* Timeline node marker */}
                  <span className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-[#1F7A4D] border-2 border-white shadow-md group-hover:scale-125 transition-transform" />

                  <div
                    onClick={() => setSelectedConsultation(item)}
                    className="p-5 rounded-3xl bg-white border border-[#1F7A4D]/20 hover:border-[#1F7A4D] shadow-md flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.002]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`px-3 py-1 rounded-xl text-xs font-black shrink-0 shadow-sm ${badge.bg}`}>
                        {badge.dot} {item.crop || 'Crop Query'}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-[#14532D] text-base truncate">
                            {item.assessment || item.category}
                          </span>
                          <span className="text-[10px] font-extrabold text-[#1F7A4D] bg-[#1F7A4D]/10 px-2.5 py-0.5 rounded-md">
                            {item.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 truncate mt-1 max-w-xl font-bold">
                          "{item.queryText}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-black text-[#1F7A4D]">
                          {item.confidence || 85}% {t('consultations.match')}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-bold justify-end mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-[#1F7A4D]/10 text-[#1F7A4D] hover:bg-[#1F7A4D]/20 transition-colors">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Audit Drawer */}
        {selectedConsultation && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 border border-[#1F7A4D]/30 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
              
              <button
                onClick={() => setSelectedConsultation(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-10">
                <span className="text-xs font-black text-[#1F7A4D] uppercase tracking-wider block">
                  {t('consultations.auditBadge')}
                </span>
                <h3 className="text-xl font-black text-[#14532D] mt-0.5">
                  {selectedConsultation.crop} — {selectedConsultation.category}
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  {t('consultations.loggedOn')} {formatDate(selectedConsultation.createdAt)}
                </p>
              </div>

              <AgriResultCard result={selectedConsultation} onReset={() => setSelectedConsultation(null)} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
