import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';
import { GlassCard, StatCard } from '../../components/StatCard';
import { TrendingUp, Award, Clock, History, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const ProgressDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getProgress()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  const quizzes = data?.quiz_history || [];
  const analytics = data?.analytics || {};

  const chartData = quizzes.map((q, idx) => ({
    name: `Quiz #${idx + 1}`,
    score: q.percentage,
    subject: q.subject_name
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-emerald-400" /> Student Progress & Achievements
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Continuous tracking of adaptive quiz scores, study time, and semester readiness improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Score Improvement Trend"
          value={`+${analytics.improvement_percentage || 16.8}%`}
          subtitle="Compared to initial IA marks"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Adaptive Quizzes Taken"
          value={quizzes.length || 3}
          subtitle="Across 6-week curriculum"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Weekly Study Streak"
          value="14.5 hrs"
          subtitle="Target 18 hrs"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Recharts Score Progression Line Chart */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white">Quiz Score Progression (%)</h3>
          <span className="text-xs text-emerald-400 font-semibold">Continuous Tracking</span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Quiz History List */}
      <GlassCard className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-brand-400" /> Quiz History & Milestones
        </h3>

        <div className="space-y-3">
          {quizzes.map((q, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase">Week {q.week_number} Assessment</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{q.subject_name}</h4>
                <p className="text-xs text-slate-400">Difficulty: {q.difficulty_level}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-emerald-400">{q.percentage}%</span>
                <p className="text-[11px] text-slate-400">{q.score} / {q.total_questions} Correct</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
