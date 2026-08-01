import React, { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';
import { interventionsService } from '../../services/supabase';
import { StatCard, GlassCard } from '../../components/StatCard';
import { Users, Award, AlertTriangle, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Send, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, sbInterventions] = await Promise.all([
          teacherAPI.getDashboard().catch(() => null),
          interventionsService.getInterventions().catch(() => [])
        ]);

        if (dashRes?.data) {
          setData(dashRes.data);
        } else {
          setData({
            total_students: 128,
            average_readiness: 76.5,
            weak_students_count: 6,
            weak_students: [
              { id: '1', name: 'Santhosh', usn: 'CSE-2026-042', weak_subjects: ['Programming in C++'], risk_level: 'Weak', readiness_score: 39 },
              { id: '2', name: 'Nidhish', usn: 'CSE-2026-089', weak_subjects: ['Physics II'], risk_level: 'Weak', readiness_score: 48 },
              { id: '4', name: 'Nadya', usn: 'CSE-2026-145', weak_subjects: ['Programming in C++'], risk_level: 'Weak', readiness_score: 36 }
            ],
            top_performers: [
              { id: '5', name: 'Meghan', usn: 'CSE-2026-018', readiness_score: 92 },
              { id: '6', name: 'Nitish', usn: 'CSE-2026-056', readiness_score: 89 }
            ]
          });
        }

        if (sbInterventions && sbInterventions.length > 0) {
          setInterventions(sbInterventions);
        } else {
          setInterventions([
            { id: '1', student_id: '1', student_name: 'Santhosh', subject: 'Programming in C++', status: 'Flagged' },
            { id: '2', student_id: '2', student_name: 'Nidhish', subject: 'Physics II', status: 'Nudge Sent' },
            { id: '3', student_id: '3', student_name: 'Salih', subject: 'Mathematics III', status: 'Nudge Sent' }
          ]);
        }
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (interventionId, newStatus) => {
    try {
      await interventionsService.updateStatus(interventionId, newStatus);
    } catch (e) {
      console.warn("Supabase intervention status update warning", e);
    }

    setInterventions(prev => prev.map(item => 
      item.id === interventionId ? { ...item, status: newStatus } : item
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const weakStudents = data?.weak_students || [];
  const topPerformers = data?.top_performers || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 bg-gradient-to-r from-red-950/80 via-rose-950/60 to-slate-900/90 border border-red-900/60 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-red-700 border border-rose-200 flex items-center gap-1.5 shadow">
                <Sparkles className="w-3.5 h-3.5 text-red-600" /> Faculty Analytics & Intervention Portal
              </span>
              <span className="text-xs font-bold text-slate-400">CSE Dept • Sem 4</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Faculty Academic Intervention Control Center 🎓
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Track student Internal Assessment (IA) scores (under 35/50 Weak), issue targeted nudges, and resolve academic risks before semester examinations.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/teacher/assistant')}
              className="px-5 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 transition shadow-lg shadow-red-600/30"
            >
              <Sparkles className="w-4 h-4" /> AI Teacher Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students Enrolled"
          value={data?.total_students || 128}
          subtitle="Computer Science & Eng"
          icon={Users}
          color="red"
        />
        <StatCard
          title="Average Class Readiness"
          value={`${data?.average_readiness || 76.5}%`}
          subtitle="Targeting > 80.0%"
          icon={Award}
          trend="+3.5%"
          color="emerald"
        />
        <StatCard
          title="Intervention Needed"
          value={`${data?.weak_students_count || 6} Students`}
          subtitle="IA marks < 35/50 in >= 1 subject"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Top Performers (>88%)"
          value={topPerformers.length}
          subtitle="Ready for Semester Finals"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Interventions Table Section */}
      <GlassCard className="space-y-4 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" /> Active Faculty Interventions
            </h3>
            <p className="text-xs text-slate-500 font-medium">Track and update intervention status: Flagged → Nudge Sent → Resolved</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Target Subject</th>
                <th className="p-3.5">Intervention Status</th>
                <th className="p-3.5 text-right">Faculty Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {interventions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-extrabold text-slate-900">
                    {item.students?.name || item.student_name || 'Santhosh'}
                  </td>
                  <td className="p-3.5 text-slate-700 font-semibold">{item.subject}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      item.status === 'Nudge Sent' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-rose-100 text-red-800 border border-rose-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right flex items-center justify-end gap-2">
                    {item.status === 'Flagged' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'Nudge Sent')}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1 transition shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Nudge
                      </button>
                    )}
                    {item.status !== 'Resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'Resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1 transition shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
