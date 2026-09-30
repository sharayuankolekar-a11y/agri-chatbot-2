import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Search, Filter, ShieldAlert, X, ChevronRight, Eye } from 'lucide-react';
import { getHistory } from '../services/api';
import { formatDate, getRiskColor } from '../utils/formatters';
import ResultCard from '../components/ResultCard';

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedScan, setSelectedScan] = useState(null);

  const categories = [
    'ALL',
    'Phishing',
    'Job/Internship Scam',
    'Banking Scam',
    'UPI/Payment Scam',
    'Shopping Scam',
    'Investment Scam',
    'Social Media Scam',
    'Government Impersonation',
    'Prize/Lottery Scam',
    'Fake Customer Support',
    'Other Suspicious Activity'
  ];

  async function loadData() {
    setLoading(true);
    const data = await getHistory({
      riskLevel: riskFilter,
      category: categoryFilter,
      search
    });
    if (data.success && Array.isArray(data.scans)) {
      setScans(data.scans);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [riskFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
          <HistoryIcon className="w-4 h-4" />
          <span>AUDIT & REPOSITORY</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Scan History Log
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Review previous risk assessments, inspect detected red flags, and search past analyses.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scans by text or explanation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">🔴 High Risk</option>
            <option value="SUSPICIOUS">🟡 Suspicious</option>
            <option value="LOW">🟢 Low Risk</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* History Grid / List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm font-bold animate-pulse">
          Loading scan records...
        </div>
      ) : scans.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No scan history found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your filters or run a new scan from the Home page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {scans.map((scan, idx) => {
            const colors = getRiskColor(scan.riskLevel);
            return (
              <div
                key={scan._id || idx}
                onClick={() => setSelectedScan(scan)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm flex items-center justify-between gap-4 cursor-pointer transition-all hover:scale-[1.005]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`px-3 py-1 rounded-xl text-xs font-black shrink-0 ${colors.bg} ${colors.text}`}>
                    {colors.dot} {scan.riskLevel}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm truncate">
                        {scan.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {scan.mode || 'AUTO'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-xl">
                      {scan.sanitizedContent || scan.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-black text-slate-900 dark:text-white">
                      Score: {scan.riskScore}/100
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDate(scan.createdAt)}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Drawer for Viewing Detailed Scan Entry */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-50 dark:bg-[#0b132b] rounded-3xl p-6 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-10">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                Scan Details Audit
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedScan.category}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Scanned on {formatDate(selectedScan.createdAt)}
              </p>
            </div>

            <ResultCard result={selectedScan} onReset={() => setSelectedScan(null)} />
          </div>
        </div>
      )}

    </div>
  );
}
