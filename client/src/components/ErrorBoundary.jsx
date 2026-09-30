import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 React ErrorBoundary caught an unhandled rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-white dark:bg-[#091A13] border border-[#1F7A4D]/25 shadow-2xl space-y-4 text-left">
          <div className="flex items-center gap-3 text-[#14532D] dark:text-emerald-400 font-extrabold text-sm">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#1F7A4D]" />
            </div>
            <span>AgriSphere Assistant</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
            Sorry, I couldn't process your question right now. Please try asking again.
          </p>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-[#1F7A4D] hover:bg-[#14532D] text-white text-xs font-black transition-all flex items-center gap-2 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ask Another Question</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
