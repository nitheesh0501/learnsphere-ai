import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Bell, LogOut, Sparkles, Search, ShieldCheck, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#060913]/85 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-2xl">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => navigate('/')}>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-400">
              LearnSphere<span className="text-cyan-400">.AI</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" /> Active IA Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Personal Academic Intervention Assistant</p>
        </div>
      </div>

      {/* Center Quick Search (Desktop) */}
      <div className="hidden lg:flex items-center bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-1.5 w-72 focus-within:border-cyan-500/50 transition">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search subjects, IA marks, topics..." 
          className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
        />
      </div>

      {/* Right Controls & Role Switcher */}
      <div className="flex items-center gap-4">
        {/* Quick Portal Switcher */}
        <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => loginAsDemo('student').then(() => navigate('/student/dashboard'))}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              user?.role === 'student' 
                ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Student Portal
          </button>
          <button
            onClick={() => loginAsDemo('teacher').then(() => navigate('/teacher/dashboard'))}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              user?.role === 'teacher' 
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-600/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Teacher Portal
          </button>
        </div>

        {/* Notifications */}
        <button className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white relative transition hover:border-slate-700">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
        </button>

        {/* Profile Details */}
        <div className="flex items-center gap-3 border-l border-slate-800/80 pl-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
            alt="User avatar"
            className="w-9 h-9 rounded-xl object-cover border border-cyan-500/30 shadow"
          />
          <div className="hidden md:block text-left">
            <h4 className="text-xs font-extrabold text-white leading-tight">{user?.name || 'Alex Rivera'}</h4>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{user?.role || 'student'}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 transition rounded-xl hover:bg-slate-900"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
