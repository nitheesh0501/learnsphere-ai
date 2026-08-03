import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("LearnSphere ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-rose-200 p-8 max-w-md w-full text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-[#701C34] flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-[#701C34]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Application Error Recovered</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                LearnSphere AI encountered an unexpected rendering issue. Click below to reload cleanly.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-[#701C34] hover:bg-[#581427] text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
