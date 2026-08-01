import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, BookOpen, Zap, BarChart3, Bell, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileDrawer from './ProfileDrawer';

export default function Header({ activeTab, setActiveTab, readinessScore = 78.0 }) {
  const { user } = useAuth();

  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Mathematics III Alert",
      message: "IA Score 44/50 achieved. Recommended for Advanced Linear Algebra.",
      time: "10m ago",
      read: false,
      type: "success"
    },
    {
      id: 2,
      title: "Faculty Nudge Received",
      message: "Prof. Sharma assigned dynamic practice set for C++ Pointers & Memory.",
      time: "1h ago",
      read: false,
      type: "alert"
    },
    {
      id: 3,
      title: "Weekly Readiness Audit",
      message: "Semester readiness score updated to 78.0% (On Track).",
      time: "1d ago",
      read: true,
      type: "info"
    }
  ]);

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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-2">
            
            {/* Left Side: Clean Brand Logo without version badge */}
            <div className="flex items-center space-x-4 sm:space-x-8">
              <div 
                className="flex items-center space-x-2.5 cursor-pointer group" 
                onClick={() => setActiveTab('hub')}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-700 to-rose-600 flex items-center justify-center shadow-lg shadow-red-600/25 group-hover:scale-105 transition-transform duration-200">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  LearnSphere <span className="text-red-600">AI</span>
                </span>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTab('hub')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'hub'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Student Hub</span>
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Adaptive Quiz</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
                  className="relative p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors focus:outline-none"
                  aria-label="Academic Notifications"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown Popover */}
                {isBellOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-red-600" />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Academic Alerts</h4>
                        {unreadCount > 0 && (
                          <span className="bg-rose-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
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
                                  notif.type === 'alert' ? 'text-red-700' : notif.type === 'success' ? 'text-emerald-700' : 'text-slate-800'
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

              <div className="h-8 w-px bg-slate-200 hidden sm:block" />

              {/* Student Profile Pill */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 pr-3.5 rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center font-black text-white text-xs shadow-sm">
                  N
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Nitheesh'}</p>
                  <p className="text-[10px] font-medium text-slate-500">{user?.semester || 'Sem 4 • CSE'}</p>
                </div>
              </button>

            </div>
          </div>

          {/* Mobile Navigation Bar */}
          <div className="md:hidden py-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
            <nav className="flex items-center justify-around gap-1 px-2 min-w-max">
              <button
                onClick={() => setActiveTab('hub')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'hub'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Student Hub</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Adaptive Quiz</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
