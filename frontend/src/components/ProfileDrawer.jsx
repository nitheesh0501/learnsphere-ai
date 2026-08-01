import React from 'react';
import { X, GraduationCap, Award, BookOpen, User, CheckCircle2, ShieldCheck, Mail, Hash, Building2, Calendar } from 'lucide-react';

export default function ProfileDrawer({ isOpen, onClose, readinessScore = 78.0 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Drawer Header */}
          <div className="p-6 bg-slate-900 text-white relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-500/30">
                RM
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Rohan Mehta</h3>
                <p className="text-xs text-blue-300 font-medium">Sem 4 • Computer Science & Eng.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                  <Award className="w-4 h-4 text-blue-600" />
                  Baseline Readiness Score
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
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
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 h-full rounded-full transition-all duration-500"
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
                  <span className="font-bold text-slate-900">Rohan Mehta</span>
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
                  <span className="font-bold text-slate-900">rohan.m@learnsphere.edu</span>
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
                <span className="text-[10px] text-blue-600 font-bold">Full Pacing</span>
              </div>
            </div>

            {/* Verification Tag */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center space-x-3 text-blue-900 text-xs">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold">Verified Student Credential</p>
                <p className="text-[11px] text-blue-700">Official record synced with Academic Office.</p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close Profile Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
