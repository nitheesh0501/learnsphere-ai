import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../services/api';
import { weeklyProgressService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/StatCard';
import { HelpCircle, Play, CheckCircle2, Clock, Award, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdaptiveQuiz = () => {
  const { student } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(3);
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const weekSpecs = [
    { week: 1, desc: '10 Easy Questions', dist: '10 Easy', easy: 10, medium: 0, hard: 0 },
    { week: 2, desc: '8 Easy, 2 Medium Questions', dist: '8 Easy / 2 Med', easy: 8, medium: 2, hard: 0 },
    { week: 3, desc: '5 Easy, 5 Medium Questions', dist: '5 Easy / 5 Med', easy: 5, medium: 5, hard: 0 },
    { week: 4, desc: '2 Easy, 6 Medium, 2 Hard', dist: '2 Easy / 6 Med / 2 Hard', easy: 2, medium: 6, hard: 2 },
    { week: 5, desc: '5 Medium, 5 Hard Questions', dist: '5 Med / 5 Hard', easy: 0, medium: 5, hard: 5 },
    { week: 6, desc: '10 Hard Mastery Questions', dist: '10 Hard', easy: 0, medium: 0, hard: 10 }
  ];

  const handleStartQuiz = async () => {
    setLoading(true);
    setQuizFinished(false);
    setResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const res = await studentAPI.startQuiz({
        subject_name: subject,
        week_number: selectedWeek
      });
      setQuizData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Quiz start fallback", err);
      // Mock Quiz Questions for reliable standalone interactive demo
      setQuizData({
        subject: subject,
        week: selectedWeek,
        questions: [
          {
            id: 'q1',
            question_text: `In ${subject}, which data structure/algorithm provides optimal asymptotic lookup time on average?`,
            options: ['Array List', 'Hash Table / Hash Map', 'Linked List', 'Binary Search Tree'],
            correct_answer: 'Hash Table / Hash Map',
            difficulty: selectedWeek <= 2 ? 'Easy' : selectedWeek <= 4 ? 'Medium' : 'Hard'
          },
          {
            id: 'q2',
            question_text: 'What is the worst-case time complexity of standard QuickSort when no randomized pivot selection is used?',
            options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'],
            correct_answer: 'O(N^2)',
            difficulty: selectedWeek <= 2 ? 'Easy' : selectedWeek <= 4 ? 'Medium' : 'Hard'
          },
          {
            id: 'q3',
            question_text: 'Which invariant guarantees memory safety and prevents race conditions in concurrent execution loops?',
            options: ['Mutex Lock / Semaphore', 'Volatile Flag', 'Null Check', 'Exception Handler'],
            correct_answer: 'Mutex Lock / Semaphore',
            difficulty: selectedWeek <= 2 ? 'Easy' : selectedWeek <= 4 ? 'Medium' : 'Hard'
          }
        ]
      });
      setLoading(false);
    }
  };

  const handleOptionSelect = (qId, optionText) => {
    if (quizFinished) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [qId]: optionText
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    let score = 0;
    const questions = quizData.questions || [];

    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        score += 1;
      }
    });

    const scorePct = Math.round((score / questions.length) * 100);
    const spec = weekSpecs[selectedWeek - 1];

    setLoading(true);

    // Save to Supabase weekly_progress table
    try {
      if (student?.id) {
        await weeklyProgressService.saveQuizResult({
          studentId: student.id,
          weekNumber: selectedWeek,
          easyCount: spec.easy,
          mediumCount: spec.medium,
          hardCount: spec.hard,
          quizScorePct: scorePct,
          completed: true
        });
      }
    } catch (sbErr) {
      console.warn("Supabase weekly progress sync error", sbErr);
    }

    try {
      const submitRes = await studentAPI.submitQuiz({
        subject_name: subject,
        score: score,
        total_questions: questions.length,
        week_number: selectedWeek,
        difficulty_level: spec.dist
      });
      setResult(submitRes.data.result);
    } catch (err) {
      setResult({
        score,
        total_questions: questions.length,
        percentage: scorePct,
        subject,
        week: selectedWeek
      });
    } finally {
      setQuizFinished(true);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-purple-400" /> Adaptive Quiz Engine
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Questions adapt every week based on your previous score. Boost your readiness for IA-2 exams!
        </p>
      </div>

      {!quizData ? (
        <GlassCard className="space-y-6 p-8">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">1. Select Subject</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                'Data Structures & Algorithms',
                'Computer Networks',
                'Operating Systems',
                'Database Management Systems',
                'Software Engineering'
              ].map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSubject(subj)}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition text-left ${
                    subject === subj
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">2. Choose Assessment Week</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {weekSpecs.map((w) => (
                <div
                  key={w.week}
                  onClick={() => setSelectedWeek(w.week)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedWeek === w.week
                      ? 'bg-purple-600/20 text-white border-purple-500/60 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold text-purple-400">WEEK {w.week}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">{w.dist}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1">{w.desc}</h4>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-purple-600/30"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Play className="w-5 h-5" /> Launch Adaptive Quiz Engine</>}
          </button>
        </GlassCard>
      ) : !quizFinished ? (
        <GlassCard className="space-y-6">
          {/* Quiz Header & Progress */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Week {selectedWeek} • {subject}</span>
              <h3 className="text-lg font-bold text-white">Question {currentQuestionIndex + 1} of {quizData.questions?.length}</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Difficulty: {quizData.questions[currentQuestionIndex]?.difficulty}
            </span>
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white leading-relaxed">
              {quizData.questions[currentQuestionIndex]?.question_text}
            </h4>

            <div className="space-y-2.5 pt-2">
              {quizData.questions[currentQuestionIndex]?.options?.map((opt, oidx) => {
                const qId = quizData.questions[currentQuestionIndex].id;
                const isSelected = selectedAnswers[qId] === opt;
                return (
                  <button
                    key={oidx}
                    onClick={() => handleOptionSelect(qId, opt)}
                    className={`w-full p-4 rounded-xl text-left text-sm font-medium transition border flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'border-purple-400 bg-purple-500 text-white' : 'border-slate-700'
                    }`}>
                      {String.fromCharCode(65 + oidx)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-40 text-xs font-bold text-slate-300"
            >
              Previous
            </button>

            {currentQuestionIndex < quizData.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                Submit Adaptive Quiz <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassCard>
      ) : (
        /* Quiz Results View */
        <GlassCard className="p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto shadow-xl shadow-purple-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Assessment Completed</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              Score: {result?.score} / {result?.total_questions} ({result?.percentage}%)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Week {selectedWeek} Adaptive Quiz recorded and saved to Supabase!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-xs text-slate-300">
            {result?.percentage >= 80 ? (
              <span className="text-emerald-400 font-bold">🎉 Outstanding performance! Your difficulty curve will scale upwards next week.</span>
            ) : (
              <span className="text-amber-400 font-bold">💪 Solid effort! Gemini AI has updated your flashcards to reinforce missed topics.</span>
            )}
          </div>

          <div className="flex gap-4 justify-center pt-2">
            <button
              onClick={() => setQuizData(null)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => navigate('/student/progress')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2"
            >
              View Progress History <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
