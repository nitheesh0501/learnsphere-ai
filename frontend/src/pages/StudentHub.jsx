import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  ArrowRight,
  BarChart3,
  Calendar,
  Target,
  Sparkles,
  Clock,
  Award,
  AlertCircle,
  Zap,
  Calculator
} from 'lucide-react';

export default function StudentHub({ onNavigateToQuiz, readinessScore, setReadinessScore, addToast }) {
  // State for subjects list out of 50
  const [subjects, setSubjects] = useState([
    { id: '1', name: 'Mathematics III', internalMarks: 44, maxMarks: 50, credits: 4 },
    { id: '2', name: 'Physics II', internalMarks: 31, maxMarks: 50, credits: 4 },
    { id: '3', name: 'Programming in C++', internalMarks: 22.5, maxMarks: 50, credits: 3 },
  ]);

  // Form state for adding a new subject entry
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [newSubjectScore, setNewSubjectScore] = useState('');
  const [newSubjectCredits, setNewSubjectCredits] = useState('3');

  // AI Audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState(null);

  // Input clamping helper: clamps typed or pasted values strictly between min and max
  const clampValue = (val, max = 50, min = 0) => {
    if (val === '' || val === null || val === undefined) return '';
    const num = Number(val);
    if (isNaN(num)) return '';
    if (num > max) return max;
    if (num < min) return min;
    return num;
  };

  // Helper for risk classification (>40: Strong/Emerald, 35-40: Average/Amber, <35: Weak/Red)
  const calculateRisk = (scoreOutof50) => {
    const score = Number(scoreOutof50) || 0;
    const pct = Math.round((score / 50.0) * 100);

    if (score > 40) {
      return { status: 'Strong', pct, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
    } else if (score >= 35) {
      return { status: 'Average', pct, bg: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
    } else {
      return { status: 'Weak', pct, bg: 'bg-rose-100 text-red-800 border-rose-200', bar: 'bg-red-600' };
    }
  };

  // Dynamically compute overall readiness score
  const updateOverallReadiness = (subjectList) => {
    if (!subjectList || subjectList.length === 0) return 0;
    const totalPct = subjectList.reduce((acc, sub) => {
      return acc + ((Number(sub.internalMarks) || 0) / (Number(sub.maxMarks) || 50)) * 100;
    }, 0);
    const avgScore = Number((totalPct / subjectList.length).toFixed(1));
    setReadinessScore(avgScore);
    return avgScore;
  };

  const handleUpdateSubject = (id, field, value) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setSubjects(updated);
    updateOverallReadiness(updated);
  };

  const handleDeleteSubject = (id) => {
    if (subjects.length <= 1) {
      if (addToast) addToast('Cannot Delete', 'At least one subject is required for readiness analysis.', 'warning');
      return;
    }
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    updateOverallReadiness(updated);
    if (addToast) addToast('Subject Removed', 'Subject was removed from assessment roster.', 'info');
  };

  // Handler: Calculate Readiness & Add Subject
  const handleCalculateAndAdd = () => {
    if (!newSubjectTitle.trim()) {
      const score = updateOverallReadiness(subjects);
      if (addToast) {
        addToast('Readiness Calculated', `Overall semester readiness updated to ${score}%.`, 'success');
      }
      return;
    }

    const scoreNum = Number(newSubjectScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 50) {
      if (addToast) addToast('Invalid Score', 'Please enter a valid IA score between 0 and 50.', 'warning');
      return;
    }

    const newSub = {
      id: Date.now().toString(),
      name: newSubjectTitle.trim(),
      internalMarks: scoreNum,
      maxMarks: 50,
      credits: Number(newSubjectCredits) || 3
    };

    const updated = [...subjects, newSub];
    setSubjects(updated);
    const newReadiness = updateOverallReadiness(updated);

    setNewSubjectTitle('');
    setNewSubjectScore('');
    setNewSubjectCredits('3');

    if (addToast) {
      addToast('Subject Added & Readiness Calculated', `New readiness score: ${newReadiness}%`, 'success');
    }
  };

  // Handler: Re-Run AI Audit
  const handleReRunAudit = () => {
    setIsAuditing(true);
    setAuditMessage('Analyzing Internal Assessment Trends...');

    setTimeout(() => {
      setIsAuditing(false);
      setAuditMessage(null);
      const newScore = updateOverallReadiness(subjects);
      if (addToast) {
        addToast('AI Audit Complete', `Analyzed IA performance trends. Readiness: ${newScore}%`, 'success');
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* Banner Welcome Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-red-950 via-rose-950 to-slate-900 p-6 rounded-2xl border border-red-900/60 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Early Intervention Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Academic Assessment & Personalized Study Hub
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Input Internal Assessment (IA) test scores out of 50 to calculate overall semester readiness, detect knowledge gaps, and receive targeted adaptive study roadmaps.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-stretch md:self-auto shrink-0">
          <button
            onClick={handleReRunAudit}
            disabled={isAuditing}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-600/30"
          >
            <Zap className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing...' : 'Re-Run AI Audit'}</span>
          </button>
        </div>
      </div>

      {/* AI Audit Loading Banner */}
      {isAuditing && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3 text-red-900 text-xs font-bold">
            <RefreshCw className="w-4 h-4 text-red-600 animate-spin" />
            <span>{auditMessage}</span>
          </div>
          <span className="text-[11px] font-semibold text-red-700">Pacing IA Analytics Engine...</span>
        </div>
      )}

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* CARD 1: Manual Score Entry Assessment Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-sm relative">
          <div>
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-red-600" />
                  <span>Manual Score Entry Assessment</span>
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Enter Subject Title & IA score (out of 50)</p>
              </div>
              <span className="text-[11px] font-bold bg-rose-50 text-red-700 px-2.5 py-1 rounded-lg border border-rose-200 shrink-0">
                IA Out of 50
              </span>
            </div>

            {/* Existing Subjects Roster */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1 uppercase tracking-wider">
                <span>Subject Title</span>
                <div className="flex items-center space-x-4">
                  <span>IA Score (/50)</span>
                  <span>Credits</span>
                  <span>Action</span>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {subjects.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2"
                  >
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => handleUpdateSubject(sub.id, 'name', e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-semibold focus:outline-none focus:border-red-600 flex-1 min-w-[120px]"
                      placeholder="Subject Name"
                    />

                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="flex items-center space-x-1">
                        {/* Number Input with strict min/max and instant clamping */}
                        <input
                          type="number"
                          min="0"
                          max={sub.maxMarks || 50}
                          value={sub.internalMarks}
                          onChange={(e) => {
                            const clamped = clampValue(e.target.value, sub.maxMarks || 50, 0);
                            handleUpdateSubject(sub.id, 'internalMarks', clamped);
                          }}
                          onInput={(e) => {
                            const clamped = clampValue(e.target.value, sub.maxMarks || 50, 0);
                            if (e.target.value !== '' && Number(e.target.value) !== clamped) {
                              e.target.value = clamped;
                            }
                          }}
                          className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-center text-slate-900 font-bold focus:outline-none focus:border-red-600 w-14 sm:w-16"
                        />
                        <span className="text-xs text-slate-400 font-bold">/{sub.maxMarks || 50}</span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={sub.credits}
                        onChange={(e) => {
                          const clamped = clampValue(e.target.value, 6, 1);
                          handleUpdateSubject(sub.id, 'credits', clamped);
                        }}
                        className="bg-white border border-slate-300 rounded-lg px-1.5 py-1 text-xs text-center text-slate-900 font-semibold focus:outline-none focus:border-red-600 w-10"
                      />
                      <button
                        onClick={() => handleDeleteSubject(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Subject Row Inputs */}
              <div className="pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-2.5">
                <p className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                  <Plus className="w-3.5 h-3.5 text-red-600" />
                  <span>Add New Subject Entry</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Subject Title (e.g. Data Structures)"
                    value={newSubjectTitle}
                    onChange={(e) => setNewSubjectTitle(e.target.value)}
                    className="sm:col-span-6 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-600"
                  />
                  {/* New Subject IA score input with instant min/max clamping */}
                  <input
                    type="number"
                    placeholder="IA Score (/50)"
                    min="0"
                    max="50"
                    value={newSubjectScore}
                    onChange={(e) => setNewSubjectScore(clampValue(e.target.value, 50, 0))}
                    onInput={(e) => {
                      const clamped = clampValue(e.target.value, 50, 0);
                      if (e.target.value !== '' && Number(e.target.value) !== clamped) {
                        e.target.value = clamped;
                      }
                    }}
                    className="sm:col-span-4 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-red-600"
                  />
                  <input
                    type="number"
                    placeholder="Credits"
                    min="1"
                    max="6"
                    value={newSubjectCredits}
                    onChange={(e) => setNewSubjectCredits(clampValue(e.target.value, 6, 1))}
                    className="sm:col-span-2 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center text-slate-900 font-semibold focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Assessment Footer Action */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
              Out of 50 IA Evaluation Mode
            </span>
            <button
              onClick={handleCalculateAndAdd}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-md shadow-red-600/20"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Readiness & Add Subject</span>
            </button>
          </div>
        </div>

        {/* CARD 2: TOP RIGHT CARD (Performance Analysis & Semester Readiness) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  <span>Performance Analysis & Risk Classification</span>
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Core subject IA score risk & semester readiness</p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                <span>Semester 4</span>
              </div>
            </div>

            <div className="mt-5 space-y-6">
              
              {/* Dynamic Horizontal Bar Charts */}
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const risk = calculateRisk(sub.internalMarks);
                  return (
                    <div key={sub.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{sub.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 font-semibold">{sub.internalMarks} / 50</span>
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border ${risk.bg}`}>
                            <span>{risk.status} ({risk.pct}%)</span>
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${risk.bar}`}
                          style={{ width: `${risk.pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Semester Readiness Progress Gauge */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Overall Semester Readiness Score
                    </span>
                  </div>
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                    readinessScore >= 75
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : readinessScore >= 60
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-100 text-red-800 border-rose-200'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{readinessScore}% • {readinessScore >= 75 ? 'On Track' : readinessScore >= 60 ? 'Review Rec.' : 'At Risk'}</span>
                  </span>
                </div>

                {/* Speedometer-Style Horizontal Linear Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300 relative">
                    <div
                      className="bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${Math.min(100, Math.max(0, readinessScore))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
                    <span>0% (Critical)</span>
                    <span>50% (Baseline)</span>
                    <span className="text-red-600 font-extrabold">{readinessScore}% Current</span>
                    <span>100% (Dean's Honor)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Performance Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Primary Weak Area: {subjects.find(s => Number(s.internalMarks) < 35)?.name || 'None identified'}</span>
            </span>
            <span className="text-red-600 font-bold">Auto-updated</span>
          </div>
        </div>
      </div>

      {/* CARD 3: 6-Week Adaptive Study Roadmap */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">6-Week Adaptive Study Roadmap</h2>
              <span className="bg-rose-50 text-red-800 text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded border border-rose-200">
                AI Scheduled
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Sequential learning milestones tailored to eliminate your specific subject performance gaps
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 shrink-0">
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span>Pacing: 6 hrs/week</span>
          </div>
        </div>

        {/* Stepper Roadmap Container */}
        <div className="mt-8 mb-2 relative px-2">
          
          <div className="hidden lg:block absolute top-[28px] left-[40px] right-[40px] h-[4px] bg-slate-200 z-0">
            <div className="bg-gradient-to-r from-emerald-500 via-red-600 to-slate-200 h-full w-[33%] rounded-full" />
          </div>

          {/* 6 Step Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
            
            {/* Wk 1 (Done) */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center group bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none">
              <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-emerald-500 p-1 flex items-center justify-center shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-900 font-black text-sm">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  Wk 1 • Done
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Data Structures
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Arrays, Stacks & Queues</p>
              </div>
            </div>

            {/* Wk 2 (Current) */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center group bg-rose-50/50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none">
              <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-red-600 p-1 flex items-center justify-center shadow-md ring-4 ring-rose-100">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-red-900 font-black text-sm">
                  <span className="text-red-600 font-black text-base">W2</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-extrabold text-red-800 uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                  Wk 2 • Current
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  Calculus Refresher
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Derivatives & Integration</p>
              </div>
            </div>

            {/* Wk 3 */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center group bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none">
              <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-slate-300 p-1 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-sm">
                  <span className="text-slate-700 font-bold text-xs">W3</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Wk 3
                </span>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  Classical Mechanics
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Harmonic Waves</p>
              </div>
            </div>

            {/* Wk 4 */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center group bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none">
              <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-slate-300 p-1 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-sm">
                  <span className="text-slate-700 font-bold text-xs">W4</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Wk 4
                </span>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  OOP & Pointers
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Memory Allocation</p>
              </div>
            </div>

            {/* Wk 5 */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center group bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none">
              <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-slate-300 p-1 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-sm">
                  <span className="text-slate-700 font-bold text-xs">W5</span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Wk 5
                </span>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  Electromagnetism
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Circuit Theory</p>
              </div>
            </div>

            {/* Wk 6 */}
            <div className="flex flex-col items-start lg:items-center text-left lg:text-center group bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none">
              <div className="relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-slate-300 p-1 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-900 font-bold text-sm">
                  <Award className="w-6 h-6 text-slate-700" />
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Wk 6
                </span>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  Final Mock Exam
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Full Evaluation</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CARD 4: AI Suggested Study Priorities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-red-600" />
              <span>AI-Suggested Study Priorities</span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Priority-ranked modules recommended based on your recent IA grade analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white border border-rose-200 hover:border-red-400 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-xl group-hover:bg-red-600/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-100 text-red-800 border border-rose-200">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  <span>High Priority</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Est. 45 mins</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                Object-Oriented Programming & Pointers
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Your programming IA score is currently at <strong className="text-red-600">22.5/50 (45%)</strong>. Master dynamic memory allocation, class inheritance, and pointer arithmetic.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold">3 Interactive Drills</span>
              <button
                onClick={() => onNavigateToQuiz && onNavigateToQuiz('Programming in C++')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-amber-200 hover:border-amber-400 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Review Needed</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Est. 30 mins</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Wave Mechanics & Harmonic Oscillations
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Physics standing is at <strong className="text-amber-600">31/50 (62%)</strong>. Practice standing wave equations, Doppler effect formulas, and damping coefficients.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold">5 Problem Sets</span>
              <button
                onClick={() => onNavigateToQuiz && onNavigateToQuiz('Physics II')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-emerald-200 hover:border-emerald-400 rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Maintain Pace</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Est. 15 mins</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Linear Algebra & Matrix Operations
              </h3>
              <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                Mathematics is strong at <strong className="text-emerald-600">44/50 (88%)</strong>. Keep speed high with quick eigen-vector calculations and matrix transformation drills.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-semibold">1 Refresh Quiz</span>
              <button
                onClick={() => onNavigateToQuiz && onNavigateToQuiz('Mathematics III')}
                className="px-4 py-2 bg-white hover:bg-rose-50 border-2 border-red-600 text-red-600 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
