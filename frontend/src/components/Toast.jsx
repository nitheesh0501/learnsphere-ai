import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-slate-900 border-emerald-500/40 text-white'
              : toast.type === 'warning'
              ? 'bg-slate-900 border-amber-500/40 text-white'
              : 'bg-slate-900 border-red-500/40 text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <div>
              <p className="text-xs font-bold text-slate-100">{toast.title}</p>
              {toast.message && <p className="text-[11px] text-slate-400 mt-0.5">{toast.message}</p>}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors ml-3 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
