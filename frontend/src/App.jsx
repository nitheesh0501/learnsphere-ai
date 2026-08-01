import React, { useState } from 'react';
import Header from './components/Header';
import StudentHub from './pages/StudentHub';
import AdaptiveQuiz from './pages/AdaptiveQuiz';
import FacultyAnalytics from './pages/FacultyAnalytics';
import Toast from './components/Toast';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'quiz' | 'analytics'
  const [quizSubject, setQuizSubject] = useState(null);
  const [readinessScore, setReadinessScore] = useState(78.0);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigateToQuiz = (subject = null) => {
    if (subject) {
      setQuizSubject(subject);
    }
    setActiveTab('quiz');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* Navigation Header Bar */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          readinessScore={readinessScore} 
        />

        {/* Main View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'hub' && (
            <StudentHub
              onNavigateToQuiz={handleNavigateToQuiz}
              readinessScore={readinessScore}
              setReadinessScore={setReadinessScore}
              addToast={addToast}
            />
          )}
          {activeTab === 'quiz' && (
            <AdaptiveQuiz
              initialSubject={quizSubject}
              addToast={addToast}
            />
          )}
          {activeTab === 'analytics' && (
            <FacultyAnalytics
              addToast={addToast}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500 font-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-700">LearnSphere AI • Early Academic Intervention Platform</span>
            </div>
            <p>© 2026 Academic Analytics Engine. All rights reserved.</p>
          </div>
        </footer>

        {/* Global Toast Notification Container */}
        <Toast toasts={toasts} removeToast={removeToast} />

      </div>
    </AuthProvider>
  );
}
