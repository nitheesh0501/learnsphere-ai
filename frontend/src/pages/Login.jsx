import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, LogIn, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password credentials');
      setLoading(false);
    }
  };

  const handleQuickDemo = async (roleType) => {
    setLoading(true);
    try {
      const user = await loginAsDemo(roleType);
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0b0f19]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center shadow-xl shadow-brand-500/20 mx-auto">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            LearnSphere<span className="text-brand-500">.AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Personal Academic Intervention Assistant
          </p>
        </div>

        {/* Quick Demo Access Header */}
        <div className="glass-card rounded-2xl p-4 border border-brand-500/30 bg-brand-950/20 text-center space-y-2">
          <span className="text-xs font-bold text-brand-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Instant Evaluator Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleQuickDemo('student')}
              className="py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition"
            >
              Demo Student
            </button>
            <button
              onClick={() => handleQuickDemo('teacher')}
              className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition"
            >
              Demo Teacher
            </button>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@learnsphere.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-brand-600/30"
            >
              <LogIn className="w-4 h-4" /> Sign In to Portal
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-xs text-slate-400 hover:text-brand-400 hover:underline"
            >
              Need an account? Register new Student / Teacher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
