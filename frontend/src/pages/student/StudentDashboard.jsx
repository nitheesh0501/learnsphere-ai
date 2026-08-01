import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';
import { StatCard, GlassCard } from '../../components/StatCard';
import { 
  Award, AlertTriangle, CheckCircle2, Clock, Upload, 
  Play, Sparkles, TrendingUp, BookOpen, ArrowRight, Target, ShieldCheck, Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    studentAPI.getDashboard()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard load error", err);
        // Fallback demo data matching Figma UI model
        setData({
          student: { name: 'Alex Rivera', usn: '1LS22CS045', target_gpa: 8.8 },
          ml_summary: { readiness_score: 76, risk_level: 'Moderate', predicted_gpa: 7.9 },
          analytics: { weekly_study_hours: 15.5 },
          subjects: [
            { name: 'Data Structures & Algorithms', ia_marks: 32, max_marks: 50, percentage: 64, status: 'Weak' },
            { name: 'Computer Networks', ia_marks: 34, max_marks: 50, percentage: 68, status: 'Weak' },
            { name: 'Operating Systems', ia_marks: 39, max_marks: 50, percentage: 78, status: 'Medium' },
            { name: 'Database Management Systems', ia_marks: 45, max_marks: 50, percentage: 90, status: 'Strong' },
            { name: 'Software Engineering', ia_marks: 47, max_marks: 50, percentage: 94, status: 'Strong' }
          ]
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const subjects = data?.subjects || [];
  const ml = data?.ml_summary || {};
  const analytics = data?.analytics || {};

  const getBarColor = (status) => {
    if (status === 'Strong') return '#10b981'; // Green
    if (status === 'Medium') return '#f59e0b'; // Amber
    return '#ef4444'; // Red (Weak < 35)
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Active Academic Intervention Model
              </span>
              <span className="text-xs font-bold text-slate-400">USN: {data?.student?.usn || '1LS22CS045'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">{data?.student?.name || 'Alex Rivera'}</span> 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Personal Academic Intervention Assistant is actively tracking your <strong>Internal Assessment 1 (IA-1)</strong> scores (out of 50) to optimize semester exam readiness.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
            <button
              onClick={() => navigate('/student/upload')}
              className="flex-1 sm:flex-initial px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-600/30"
            >
              <Upload className="w-4 h-4" /> Upload IA Marksheet
            </button>
            <button
              onClick={() => navigate('/student/adaptive-quiz')}
              className="flex-1 sm:flex-initial px-5 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-purple-600/30"
            >
              <Play className="w-4 h-4" /> Launch Adaptive Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Semester Readiness Score"
          value={`${ml.readiness_score || 76}%`}
          subtitle="RandomForest ML Readiness Score"
          icon={Award}
          trend="+4.2%"
          color="cyan"
        />
        <StatCard
          title="Academic Risk Level"
          value={ml.risk_level || 'Moderate'}
          subtitle="IA Scores < 35/50 Flagged"
          icon={AlertTriangle}
          color={ml.risk_level === 'High' ? 'rose' : ml.risk_level === 'Moderate' ? 'amber' : 'emerald'}
        />
        <StatCard
          title="Predicted Semester GPA"
          value={`${ml.predicted_gpa || 7.9} / 10`}
          subtitle={`Target SGPA: ${data?.student?.target_gpa || 8.8}`}
          icon={TrendingUp}
          trend="+0.4"
          color="purple"
        />
        <StatCard
          title="Weekly Revision Hours"
          value={`${analytics.weekly_study_hours || 15.5} hrs`}
          subtitle="Targeting 18 hrs/week"
          icon={Clock}
          color="emerald"
        />
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IA Marks Chart Card */}
        <GlassCard className="lg:col-span-2 space-y-4 border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <BarChart className="w-5 h-5 text-cyan-400" /> Internal Assessment Marks Breakdown (Out of 50)
              </h3>
              <p className="text-xs text-slate-400 font-medium">Out of 50: Weak (&lt;35) | Medium (35–40) | Strong (&gt;40)</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Strong (&gt;40)</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium (35-40)</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Weak (&lt;35)</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjects} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 50]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val} / 50 Marks`, 'IA Marks']}
                />
                <Bar dataKey="ia_marks" radius={[8, 8, 0, 0]}>
                  {subjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Subject Classifications & Gap Alerts */}
        <GlassCard className="space-y-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Subject Level Classification
            </h3>
            <button
              onClick={() => navigate('/student/gaps')}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              Report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {subjects.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition">
                <div>
                  <h4 className="text-xs font-extrabold text-white">{s.name}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{s.ia_marks} / 50 Marks ({s.percentage}%)</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  s.status === 'Strong' ? 'badge-strong' :
                  s.status === 'Medium' ? 'badge-medium' :
                  'badge-weak'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 font-medium leading-relaxed">
            💡 <strong>AI Recommendation:</strong> Focus on <em>Data Structures & Computer Networks</em> today to clear IA gap topics.
          </div>
        </GlassCard>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => navigate('/student/study-plan')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">AI Daily Study Planner</h4>
              <p className="text-xs text-slate-400 font-medium">Personalized revision timetable</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </div>

        <div 
          onClick={() => navigate('/student/adaptive-quiz')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">Adaptive Quiz Engine</h4>
              <p className="text-xs text-slate-400 font-medium">Weeks 1–6 difficulty curve</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
        </div>

        <div 
          onClick={() => navigate('/student/chat')}
          className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">AI & Faculty Chat</h4>
              <p className="text-xs text-slate-400 font-medium">Solve academic doubts instantly</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
