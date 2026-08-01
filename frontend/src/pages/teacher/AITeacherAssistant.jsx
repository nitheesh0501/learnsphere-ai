import React, { useState } from 'react';
import { GlassCard } from '../../components/StatCard';
import { Sparkles, Bot, AlertTriangle, TrendingUp, BookOpen, Send } from 'lucide-react';

export const AITeacherAssistant = () => {
  const [selectedCategory, setSelectedCategory] = useState('Intervention');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (category) => {
    setSelectedCategory(category);
    setLoading(true);

    setTimeout(() => {
      if (category === 'Intervention') {
        setOutput({
          title: 'Students Needing Immediate IA Intervention',
          students: ['Rahul Sharma (1DS21CS102) - Data Structures (31/50), Computer Networks (29/50)'],
          action: 'Schedule 1-on-1 counseling session before IA-2 exams.',
          draft: 'Dear Rahul, I noticed your IA-1 marks in Data Structures and Computer Networks. Let us schedule a 15-minute review session after class to clear your gap topics.'
        });
      } else if (category === 'Rapid Improvers') {
        setOutput({
          title: 'Rapidly Improving Students (+15% Score Jump)',
          students: ['Ananya Verma (1DS21CS014) - 92.5% Semester Readiness'],
          action: 'Recommend for Student Teaching Assistant role and honors projects.',
          draft: 'Exceptional work, Ananya! Your adaptive quiz consistency in Operating Systems and DBMS is outstanding. Keep up the high standard!'
        });
      } else {
        setOutput({
          title: 'Targeted Homework & Practice Suggestions',
          suggestions: [
            'Data Structures: 5 Binary Tree traversal derivations and dynamic programming practice sets.',
            'Computer Networks: Subnetting numericals and TCP 3-way handshake sequence diagrams.',
            'Operating Systems: Process synchronization semaphore problems.'
          ],
          action: 'Broadcast practice problems to Student Portal Learning Resources.'
        });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-purple-400" /> Gemini AI Teacher Assistant
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Automated AI analysis generating customized student feedback, intervention alerts, and homework sets.
        </p>
      </div>

      {/* Action Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => handleGenerate('Intervention')}
          className={`p-5 rounded-2xl border text-left transition flex items-center justify-between ${
            selectedCategory === 'Intervention'
              ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-lg shadow-rose-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div>
            <span className="text-[10px] font-extrabold text-rose-400 uppercase">Alert</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Students Needing Intervention</h4>
          </div>
          <AlertTriangle className="w-6 h-6 text-rose-400" />
        </button>

        <button
          onClick={() => handleGenerate('Rapid Improvers')}
          className={`p-5 rounded-2xl border text-left transition flex items-center justify-between ${
            selectedCategory === 'Rapid Improvers'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div>
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase">Highlights</span>
            <h4 className="text-sm font-bold text-white mt-0.5">Rapidly Improving Students</h4>
          </div>
          <TrendingUp className="w-6 h-6 text-emerald-400" />
        </button>

        <button
          onClick={() => handleGenerate('Homework')}
          className={`p-5 rounded-2xl border text-left transition flex items-center justify-between ${
            selectedCategory === 'Homework'
              ? 'bg-purple-500/20 border-purple-500/50 text-white shadow-lg shadow-purple-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <div>
            <span className="text-[10px] font-extrabold text-purple-400 uppercase">Curriculum</span>
            <h4 className="text-sm font-bold text-white mt-0.5">AI Homework Suggestions</h4>
          </div>
          <BookOpen className="w-6 h-6 text-purple-400" />
        </button>
      </div>

      {/* Output Card */}
      <GlassCard className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-purple-400">
            <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2" /> Gemini AI is analyzing class marksheets...
          </div>
        ) : output ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bot className="w-5 h-5 text-purple-400" /> {output.title}
            </h3>

            {output.students && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Identified Students:</h4>
                {output.students.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white">
                    {s}
                  </div>
                ))}
              </div>
            )}

            {output.suggestions && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Recommended Practice Problems:</h4>
                {output.suggestions.map((sug, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
                    🔹 {sug}
                  </div>
                ))}
              </div>
            )}

            {output.draft && (
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase">AI Drafted Message to Student</span>
                <p className="text-xs text-slate-200 italic">"{output.draft}"</p>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-900 text-xs text-slate-300">
              💡 <strong>Recommended Strategy:</strong> {output.action}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            Click one of the categories above to run Gemini AI analysis for your class.
          </div>
        )}
      </GlassCard>
    </div>
  );
};
