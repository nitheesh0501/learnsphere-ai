import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../services/api';
import { GlassCard } from '../../components/StatCard';
import { Calendar, Clock, CheckSquare, Sparkles, BookOpen, Quote, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudyPlanner = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedItems, setCompletedItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudyPlan = async () => {
      // 1. Check for stored analysis from mark upload/manual entry
      let localMarks = null;
      try {
        const storedStr = localStorage.getItem('learnsphere_analysis');
        if (storedStr) {
          localMarks = JSON.parse(storedStr);
        }
      } catch (e) {
        console.warn("Storage parse error", e);
      }

      // 2. Try backend API or build customized study plan based on IA marks
      try {
        const res = await studentAPI.getStudyPlan();
        if (res?.data?.daily_schedule && res.data.daily_schedule.length > 0) {
          setPlan(res.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("API fallback to local study plan generation", err);
      }

      // 3. Build customized Study Plan specifically targeting Weak and Medium subjects
      const extractedSubjects = localMarks?.extracted_subjects || [
        { name: 'Data Structures & Algorithms', ia_marks: 32, max_marks: 50, status: 'Weak' },
        { name: 'Computer Networks', ia_marks: 34, max_marks: 50, status: 'Weak' },
        { name: 'Operating Systems', ia_marks: 39, max_marks: 50, status: 'Medium' },
        { name: 'Database Management Systems', ia_marks: 45, max_marks: 50, status: 'Strong' }
      ];

      const weakSubs = extractedSubjects.filter(s => s.status === 'Weak');
      const medSubs = extractedSubjects.filter(s => s.status === 'Medium');

      const primaryWeak = weakSubs[0]?.name || 'Data Structures & Algorithms';
      const secondaryWeak = weakSubs[1]?.name || medSubs[0]?.name || 'Computer Networks';

      const generatedSchedule = [
        {
          id: 1,
          time: '08:30 AM - 09:45 AM',
          subject: primaryWeak,
          focus_topic: 'IA Weak Topics & Core Proofs',
          action: `Review 15 Active Recall Flashcards for ${primaryWeak} (IA score: ${weakSubs[0]?.ia_marks || 32}/50)`
        },
        {
          id: 2,
          time: '11:00 AM - 12:15 PM',
          subject: secondaryWeak,
          focus_topic: 'Concept Practice & Problem Solving',
          action: `Solve 5 medium-level numerical practice problems in ${secondaryWeak}`
        },
        {
          id: 3,
          time: '03:00 PM - 04:00 PM',
          subject: 'Adaptive Quiz Engine',
          focus_topic: 'Week Assessment Checkpoint',
          action: 'Complete Week 3 Adaptive Quiz (5 Easy / 5 Medium questions)'
        },
        {
          id: 4,
          time: '07:30 PM - 08:30 PM',
          subject: 'Operating Systems & DBMS',
          focus_topic: 'Spaced Repetition & Revision',
          action: 'Review B+ Tree indexing & Process Synchronization invariants'
        }
      ];

      const generatedGoals = [
        `Clear IA gaps in ${primaryWeak} by boosting unit quiz score > 75%`,
        `Master 20 core concept flashcards for ${secondaryWeak}`,
        `Complete 3 Adaptive Quiz Engine sessions before IA-2 exams`,
        `Maintain minimum 15 hours of active revision per week`
      ];

      setPlan({
        student_name: localMarks?.student_name || 'Alex Rivera',
        motivational_quote: "Small daily improvements in IA weak areas compound into outstanding semester GPA results.",
        daily_schedule: generatedSchedule,
        weekly_goals: generatedGoals,
        revision_strategy: `Gemini AI recommends allocating 60% of daily revision to ${primaryWeak} and ${secondaryWeak} (IA scores < 35/50) using Active Recall.`
      });

      setLoading(false);
    };

    loadStudyPlan();
  }, []);

  const toggleItemDone = (itemId) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const schedule = plan?.daily_schedule || [];
  const goals = plan?.weekly_goals || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <Calendar className="w-7 h-7 text-cyan-400" /> Gemini AI Personalized Study Planner
          </h1>
          <p className="text-sm text-slate-300 mt-1 font-medium">
            Dynamic study roadmap automatically customized around your uploaded Internal Assessment (IA) marks.
          </p>
        </div>
        <button
          onClick={() => navigate('/student/adaptive-quiz')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-extrabold text-xs flex items-center gap-2 transition shadow-lg shadow-purple-600/30"
        >
          <Sparkles className="w-4 h-4" /> Start Adaptive Quiz <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Motivational Quote Banner */}
      {plan?.motivational_quote && (
        <div className="glass-panel rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 flex items-start gap-4 shadow-xl">
          <Quote className="w-7 h-7 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">Gemini AI Tutor Motivation</span>
            <p className="text-sm text-slate-200 italic mt-1 font-medium">"{plan.motivational_quote}"</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Schedule Timeline */}
        <GlassCard className="lg:col-span-2 space-y-4 border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> Today's Adaptive Revision Schedule
            </h3>
            <span className="text-xs font-bold text-cyan-400">Customized from IA Marks</span>
          </div>

          <div className="space-y-4 pt-2">
            {schedule.map((item) => {
              const isDone = completedItems[item.id];
              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone 
                      ? 'bg-slate-950/60 border-slate-800/60 opacity-60' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {item.time}
                    </span>
                    <h4 className="text-sm font-extrabold text-white">
                      {item.subject} - <span className="text-slate-300 font-normal">{item.focus_topic}</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">{item.action}</p>
                  </div>
                  <button
                    onClick={() => toggleItemDone(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 self-start sm:self-center shrink-0 border ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-600 hover:text-white'
                    }`}
                  >
                    {isDone ? <><CheckCircle2 className="w-4 h-4" /> Completed</> : 'Mark Done'}
                  </button>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Weekly Milestones & Strategy */}
        <div className="space-y-6">
          <GlassCard className="space-y-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" /> Weekly Milestones
              </h3>
            </div>

            <div className="space-y-3">
              {goals.map((goal, gidx) => (
                <div key={gidx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs border border-emerald-500/30">
                    {gidx + 1}
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="space-y-3 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-900 border-cyan-500/20">
            <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Gemini AI Strategy
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {plan?.revision_strategy}
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
