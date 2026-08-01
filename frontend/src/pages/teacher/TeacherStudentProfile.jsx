import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';
import { GlassCard, StatCard } from '../../components/StatCard';
import { User, Award, AlertTriangle, Clock, BookOpen, Send, Sparkles, History, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const TeacherStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Encouragement');
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    teacherAPI.getStudentDetail(id)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      await teacherAPI.sendFeedback({
        student_id: parseInt(id),
        feedback_text: feedbackText,
        category: feedbackCategory
      });
      setFeedbackSent(true);
      setFeedbackText('');
      setTimeout(() => setFeedbackSent(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const student = data?.student || {};
  const ml = data?.ml_summary || {};
  const subjects = data?.subjects || [];
  const quizzes = data?.quiz_history || [];
  const aiInsights = data?.ai_teacher_insights || {};

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/teacher/students')}
        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Directory
      </button>

      {/* Student Profile Header */}
      <GlassCard className="p-6 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
            alt={student.name}
            className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-purple-500/40 p-1"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{student.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                USN: {student.usn}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {student.department} • Semester {student.semester} • Target GPA: {student.target_gpa}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Readiness</span>
            <h4 className="text-xl font-extrabold text-purple-400">{ml.readiness_score}%</h4>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Risk Status</span>
            <h4 className={`text-xl font-extrabold ${ml.risk_level === 'High' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {ml.risk_level}
            </h4>
          </div>
        </div>
      </GlassCard>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard title="Predicted GPA" value={`${ml.predicted_gpa || 7.8} / 10`} color="purple" icon={Award} />
        <StatCard title="Weak Subjects" value={ml.weak_subjects?.length || 0} color="rose" icon={AlertTriangle} />
        <StatCard title="Quizzes Taken" value={quizzes.length} color="blue" icon={History} />
        <StatCard title="Weekly Study" value="14.5 hrs" color="emerald" icon={Clock} />
      </div>

      {/* AI Teacher Insights Banner */}
      <GlassCard className="space-y-3 bg-gradient-to-br from-purple-950/20 via-slate-900 to-slate-900 border-purple-500/30">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> AI Teacher Assistant Recommendation
          </h3>
          <span className="text-[10px] text-purple-400 font-bold uppercase">Automated Insight</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">{aiInsights.summary}</p>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
          💡 <strong>Action Item:</strong> {aiInsights.recommended_action}
        </div>
      </GlassCard>

      {/* Subjects & Quiz History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> IA Subject Scores (Out of 50)
          </h3>
          <div className="space-y-3">
            {subjects.map((sub, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{sub.name}</h4>
                  <span className="text-[11px] text-slate-400">{sub.ia_marks} / 50 Marks</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  sub.status === 'Strong' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  sub.status === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Send Direct Teacher Feedback Form */}
        <GlassCard className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-400" /> Send Personalized Teacher Feedback
          </h3>

          <form onSubmit={handleSendFeedback} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1.5">Feedback Category</label>
              <div className="flex gap-2">
                {['Encouragement', 'Intervention', 'Study Advice'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFeedbackCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      feedbackCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-1.5">Feedback Message</label>
              <textarea
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write motivational note or specific advice for IA-2 exam..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {feedbackSent && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Feedback delivered to student portal notification feed!
              </div>
            )}

            <button
              type="submit"
              disabled={!feedbackText.trim()}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" /> Dispatch Feedback & Motivation
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
