import React, { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';
import { GlassCard } from '../../components/StatCard';
import { BarChart3, PieChart as PieIcon, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const SubjectAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getAnalytics()
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const subjects = data?.subject_analytics || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-purple-400" /> Class Subject Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed distribution of Strong, Medium, and Weak student counts across computer science subjects.
        </p>
      </div>

      {/* Recharts Stacked Subject Distribution Chart */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white">Subject Wise Performance Distribution</h3>
          <div className="flex gap-3 text-xs">
            <span className="text-emerald-400">■ Strong (&gt;40)</span>
            <span className="text-amber-400">■ Medium (35-40)</span>
            <span className="text-rose-400">■ Weak (&lt;35)</span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjects}>
              <XAxis dataKey="subject_name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              <Legend />
              <Bar dataKey="strong" name="Strong (>40)" fill="#10b981" stackId="a" />
              <Bar dataKey="medium" name="Medium (35-40)" fill="#f59e0b" stackId="a" />
              <Bar dataKey="weak" name="Weak (<35)" fill="#ef4444" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub, idx) => (
          <GlassCard key={idx} className="space-y-3 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-bold text-white">{sub.subject_name}</h4>
              <span className="text-xs text-purple-400 font-extrabold">Avg: {sub.avg_ia_marks} / 50</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Strong</span>
                <h5 className="text-lg font-extrabold text-emerald-400">{sub.strong}</h5>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Medium</span>
                <h5 className="text-lg font-extrabold text-amber-400">{sub.medium}</h5>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Weak</span>
                <h5 className="text-lg font-extrabold text-rose-400">{sub.weak}</h5>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
