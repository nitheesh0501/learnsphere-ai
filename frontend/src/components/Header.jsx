import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, BookOpen, Zap, BarChart3, Bell, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDrawer from './ProfileDrawer';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "Discrete Mathematics Alert",
    message: "IA Score 42/50 achieved in 2321MAB301T. Recommended for Advanced Graph Logic.",
    time: "10m ago",
    read: false,
    type: "success"
  },
  {
    id: 2,
    title: "Academic Intervention Notice",
    message: "Department assigned dynamic practice set for 2321CSC304R (OOPJ) Pointers & Interfaces.",
    time: "1h ago",
    read: false,
    type: "alert"
  },
  {
    id: 3,
    title: "Weekly Readiness Audit",
    message: "Semester 3 readiness score updated to 78.0% (On Track).",
    time: "1d ago",
    read: true,
    type: "info"
  }
];

export default function Header({ activeTab, setActiveTab, readinessScore = 78.0 }) {
  const { user } = useAuth();

  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize notification state from localStorage or default list
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('learnsphere_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Error parsing saved notifications:', e);
      }
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // Auto-save notifications state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learnsphere_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const bellRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <>
      {/* College Portal App Header: Rich Deep Maroon Bar (#701C34) */}
      <header className="bg-[#701C34] text-white border-b border-[#581427] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-2">
            
            {/* Left Side: College Brand Logo & Navigation */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div 
                className="flex items-center space-x-2.5 cursor-pointer group" 
                onClick={() => setActiveTab('hub')}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-base sm:text-lg text-white tracking-tight leading-tight">
                    LearnSphere <span className="text-rose-200">AI</span>
                  </span>
                  <span className="text-[10px] text-rose-200 font-semibold tracking-wider uppercase">
                    Academic Portal
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center space-x-1 bg-[#581427]/80 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('hub')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'hub'
                      ? 'bg-white text-[#701C34] shadow-sm'
                      : 'text-rose-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Student Hub</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-white text-[#701C34] shadow-sm'
                      : 'text-rose-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Adaptive Quiz</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-white text-[#701C34] shadow-sm'
                      : 'text-rose-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Faculty Analytics</span>
                </button>
              </nav>
            </div>

            {/* Right Side: Bell Popover & Student Profile Pill */}
            <div className="flex items-center space-x-3">
              
              {/* Bell Icon */}
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setIsBellOpen(!isBellOpen)}
                  className="relative p-2.5 text-rose-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors focus:outline-none"
                  aria-label="Academic Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-400 rounded-full ring-2 ring-[#701C34] animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown Popover */}
                {isBellOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-900">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-[#701C34]" />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Academic Alerts</h4>
                        {unreadCount > 0 && (
                          <span className="bg-rose-100 text-[#701C34] text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-bold text-slate-500 hover:text-[#701C34] transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
                          No notifications right now
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 flex items-start justify-between gap-3 transition-colors ${
                              notif.read ? 'bg-white opacity-70' : 'bg-rose-50/40'
                            }`}
                          >
                            <div className="space-y-1 text-left flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${
                                  notif.type === 'alert' ? 'text-[#701C34]' : notif.type === 'success' ? 'text-emerald-700' : 'text-slate-800'
                                }`}>
                                  {notif.title}
                                </span>
                                <span className="text-[10px] text-slate-400">{notif.time}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-snug">{notif.message}</p>
                            </div>
                            <button
                              onClick={() => removeNotification(notif.id)}
                              className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-white/20 hidden sm:block" />

              {/* Student Profile Pill */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 border border-white/15 p-1.5 pr-3.5 rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                <div className="w-8.5 h-8.5 rounded-lg bg-white text-[#701C34] flex items-center justify-center font-black text-xs shadow-sm">
                  N
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Nitheesh'}</p>
                  <p className="text-[10px] font-medium text-rose-200">{user?.semester || 'Sem 3 • CSE'}</p>
                </div>
              </button>

            </div>
          </div>

          {/* Mobile Navigation Bar */}
          <div className="md:hidden py-2 border-t border-white/10 overflow-x-auto no-scrollbar">
            <nav className="flex items-center justify-around gap-1 px-2 min-w-max">
              <button
                onClick={() => setActiveTab('hub')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'hub'
                    ? 'bg-white text-[#701C34] shadow-xs'
                    : 'text-rose-100 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Student Hub</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-white text-[#701C34] shadow-xs'
                    : 'text-rose-100 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Adaptive Quiz</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-white text-[#701C34] shadow-xs'
                    : 'text-rose-100 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Faculty Analytics</span>
              </button>
            </nav>
          </div>

        </div>
      </header>

      {/* Student Profile Interactive Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        readinessScore={readinessScore}
      />
    </>
  );
}
