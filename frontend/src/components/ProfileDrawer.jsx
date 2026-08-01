import React from 'react';
import { X, Award, User, CheckCircle2, ShieldCheck, Mail, Hash, Building2, Calendar } from 'lucide-react';

export default function ProfileDrawer({ isOpen, onClose, readinessScore = 78.0 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Drawer Header with Dark Wine Accent */}
          <div className="p-6 bg-gradient-to-r from-red-900 via-red-800 to-rose-900 text-white relative flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-red-700 font-black text-lg flex items-center justify-center shadow-lg">
                N
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Nitheesh</h3>
                <p className="text-xs text-rose-200 font-medium">Sem 4 • Computer Science & Eng.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            
            {/* Baseline Readiness Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-600" />
                  Baseline Readiness Score
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  On Track
                </span>
              </div>
              
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-slate-900">{readinessScore}%</span>
                <span className="text-xs text-slate-500 font-semibold">Semester 4 Baseline</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                Academic Profile Information
              </h4>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <User className="w-4 h-4 text-slate-400" /> Full Name
                  </span>
                  <span className="font-bold text-slate-900">Nitheesh</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <Hash className="w-4 h-4 text-slate-400" /> Roll Number
                  </span>
                  <span className="font-bold text-slate-900">CSE-2026-018</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <Building2 className="w-4 h-4 text-slate-400" /> Department
                  </span>
                  <span className="font-bold text-slate-900">Computer Science & Eng.</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <Calendar className="w-4 h-4 text-slate-400" /> Current Semester
                  </span>
                  <span className="font-bold text-slate-900">Semester 4 (2026)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-slate-400" /> University Email
                  </span>
                  <span className="font-bold text-slate-900">nitheesh.m@learnsphere.edu</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <p className="text-xs text-slate-500 font-medium">Cumulative GPA</p>
                <p className="text-2xl font-black text-slate-900 mt-1">3.82</p>
                <span className="text-[10px] text-emerald-600 font-bold">Top 12% Ranking</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <p className="text-xs text-slate-500 font-medium">Active Credits</p>
                <p className="text-2xl font-black text-slate-900 mt-1">24.0</p>
                <span className="text-[10px] text-red-600 font-bold">Full Pacing</span>
              </div>
            </div>

            {/* Verification Tag */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center space-x-3 text-red-900 text-xs">
              <ShieldCheck className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Verified Student Credential</p>
                <p className="text-[11px] text-red-700">Official record synced with Academic Office.</p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Close Profile Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
