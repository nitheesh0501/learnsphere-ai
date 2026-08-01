import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, UploadCloud, AlertCircle, Calendar, 
  HelpCircle, TrendingUp, BookOpen, MessageSquare, 
  Users, BarChart3, FileText, Sparkles, Target, Zap
} from 'lucide-react';

export const Sidebar = ({ role = 'student' }) => {
  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/upload', label: 'Upload IA Marksheet', icon: UploadCloud, badge: 'Out of 50' },
    { to: '/student/gaps', label: 'Knowledge Gap Report', icon: AlertCircle },
    { to: '/student/study-plan', label: 'AI Study Planner', icon: Calendar },
    { to: '/student/adaptive-quiz', label: 'Adaptive Quiz Engine', icon: HelpCircle, badge: 'Weeks 1-6' },
    { to: '/student/progress', label: 'Progress Dashboard', icon: TrendingUp },
    { to: '/student/resources', label: 'Learning Resources', icon: BookOpen },
    { to: '/student/chat', label: 'AI Doubt Solver', icon: MessageSquare },
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
    { to: '/teacher/students', label: 'Student Directory', icon: Users },
    { to: '/teacher/analytics', label: 'Subject Analytics', icon: BarChart3 },
    { to: '/teacher/assistant', label: 'AI Teacher Assistant', icon: Sparkles },
    { to: '/teacher/reports', label: 'Export Reports', icon: FileText },
    { to: '/teacher/messages', label: 'Messaging & Feedback', icon: MessageSquare },
  ];

  const links = role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 bg-[#080d1a]/80 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-between">
          <span>{role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}</span>
          <Zap className="w-3 h-3 text-cyan-400" />
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? role === 'teacher'
                      ? 'bg-gradient-to-r from-violet-600/25 to-purple-600/15 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                      : 'bg-gradient-to-r from-cyan-600/25 to-sky-600/15 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-extrabold">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Intervention Engine Widget */}
      <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 bg-gradient-to-b from-cyan-950/30 via-slate-900/40 to-purple-950/20 mt-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-2 mb-1.5">
          <Target className="w-4 h-4 text-cyan-400" />
          <h5 className="text-xs font-extrabold text-white">Personal Academic Intervention Assistant</h5>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-3 font-medium">
          Monitors Internal Assessment (IA) marks out of 50 to flag academic risks before semester finals.
        </p>
        <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-extrabold text-center flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          IA Analysis Engine Active
        </div>
      </div>
    </aside>
  );
};
