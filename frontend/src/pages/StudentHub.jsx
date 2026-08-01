import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  BarChart3,
  Calendar,
  Target,
  Sparkles,
  Clock,
  Award,
  AlertCircle,
  Zap,
  Calculator,
  Lock
} from 'lucide-react';

// OFFICIAL SEMESTER 3 PREDEFINED SUBJECT DATASET (STRICTLY 7 COURSES - LOCKED STRUCTURE)
const DEFAULT_SUBJECTS = [
  { id: '1', code: '2321MAB301T', name: 'Discrete Mathematics (DM)', internalMarks: 42, maxMarks: 50, credits: 4, dept: 'Maths' },
  { id: '2', code: '2321CSC301T', name: 'Computer Networks (CN)', internalMarks: 34, maxMarks: 50, credits: 3, dept: 'CSE' },
  { id: '3', code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', internalMarks: 31, maxMarks: 50, credits: 4, dept: 'CSE' },
  { id: '4', code: '2321CSC303J', name: 'Fundamentals of AI & Machine Learning (FAIML)', internalMarks: 38, maxMarks: 50, credits: 4, dept: 'CSE' },
  { id: '5', code: '2321CSS301J', name: 'Embedded System Design (ESD)', internalMarks: 28, maxMarks: 50, credits: 4, dept: 'ECE' },
  { id: '6', code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', internalMarks: 22.5, maxMarks: 50, credits: 4, dept: 'CSE' },
  { id: '7', code: '2321SDA301L', name: 'Career Skill Development III (CSD)', internalMarks: 46, maxMarks: 50, credits: 2, dept: 'CSE' }
];

export default function StudentHub({ onNavigateToQuiz, readinessScore, setReadinessScore, addToast }) {
  // Initialize subjects state from localStorage or fall back to 7 predefined Semester 3 courses
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('learnsphere_subjects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) return parsed;
      } catch (e) {
        console.warn('Error parsing localStorage subjects:', e);
      }
    }
    return DEFAULT_SUBJECTS;
  });

  // Auto-save subjects state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learnsphere_subjects', JSON.stringify(subjects));
  }, [subjects]);

  // AI Audit state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState(null);

  // VALIDATION 1: Check if any subject mark in the form is invalid (> 50 or < 0)
  const hasInvalidMarks = subjects.some(
    (sub) =>
      sub.internalMarks !== '' &&
      sub.internalMarks !== null &&
      sub.internalMarks !== undefined &&
      !isNaN(Number(sub.internalMarks)) &&
      (Number(sub.internalMarks) > (sub.maxMarks || 50) || Number(sub.internalMarks) < 0)
  );

  // VALIDATION 2: Check if EVERY single subject mark field has a valid completed entry (0 to 50)
  const completedCount = subjects.filter(
    (s) =>
      s.internalMarks !== '' &&
      s.internalMarks !== null &&
      s.internalMarks !== undefined &&
      !isNaN(Number(s.internalMarks)) &&
      Number(s.internalMarks) >= 0 &&
      Number(s.internalMarks) <= (s.maxMarks || 50)
  ).length;

  const isAllMarksEntered = completedCount === 7 && !hasInvalidMarks;

  // Helper for risk classification (>40: Strong/Emerald, 35-40: Average/Amber, <35: Weak/Red)
  const calculateRisk = (scoreOutof50) => {
    if (scoreOutof50 === '' || scoreOutof50 === null || isNaN(Number(scoreOutof50))) {
      return { status: 'Pending', pct: 0, bg: 'bg-slate-100 text-slate-500 border-slate-200', bar: 'bg-slate-300' };
    }
    const score = Number(scoreOutof50) || 0;
    if (score > 50 || score < 0) {
      return { status: 'Invalid (>50)', pct: 100, bg: 'bg-rose-100 text-red-900 border-red-300', bar: 'bg-red-600' };
    }
    const pct = Math.round((score / 50.0) * 100);

    if (score > 40) {
      return { status: 'Strong', pct, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
    } else if (score >= 35) {
      return { status: 'Average', pct, bg: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
    } else {
      return { status: 'Weak', pct, bg: 'bg-rose-100 text-[#701C34] border-rose-200', bar: 'bg-[#701C34]' };
    }
  };

  // Dynamically compute overall readiness score and sync to parent if all 7 marks are valid & completed
  const updateOverallReadiness = (subjectList) => {
    if (!subjectList || subjectList.length < 7 || hasInvalidMarks) return 0;
    const allValid = subjectList.every(
      (sub) =>
        sub.internalMarks !== '' &&
        sub.internalMarks !== null &&
        !isNaN(Number(sub.internalMarks)) &&
        Number(sub.internalMarks) >= 0 &&
        Number(sub.internalMarks) <= (sub.maxMarks || 50)
    );
    if (!allValid) return 0;

    const totalPct = subjectList.reduce((acc, sub) => {
      return acc + ((Number(sub.internalMarks) || 0) / (Number(sub.maxMarks) || 50)) * 100;
    }, 0);
    const avgScore = Number((totalPct / subjectList.length).toFixed(1));
    setReadinessScore(avgScore);
    return avgScore;
  };

  const handleUpdateSubjectMark = (id, rawValue) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, internalMarks: rawValue } : s));
    setSubjects(updated);

    // Check if any mark in the form is > 50
    const invalidExists = updated.some(
      (sub) =>
        sub.internalMarks !== '' &&
        sub.internalMarks !== null &&
        !isNaN(Number(sub.internalMarks)) &&
        (Number(sub.internalMarks) > (sub.maxMarks || 50) || Number(sub.internalMarks) < 0)
    );

    if (!invalidExists) {
      const allFilled = updated.every(
        (s) =>
          s.internalMarks !== '' &&
          s.internalMarks !== null &&
          !isNaN(Number(s.internalMarks)) &&
          Number(s.internalMarks) >= 0 &&
          Number(s.internalMarks) <= (s.maxMarks || 50)
      );
      if (allFilled) {
        updateOverallReadiness(updated);
      }
    }
  };

  // Handler: Calculate Readiness Button Click
  const handleCalculateReadiness = () => {
    if (hasInvalidMarks) {
      if (addToast) {
        addToast('Invalid Marks Detected', 'Cannot calculate readiness: Please fix invalid marks exceeding 50.', 'warning');
      }
      return;
    }

    if (!isAllMarksEntered) {
      if (addToast) {
        addToast('Validation Warning', 'Please enter valid IA marks for all 7 subjects to calculate Semester Readiness.', 'warning');
      }
      return;
    }

    const score = updateOverallReadiness(subjects);
    if (addToast) {
      addToast('Readiness Calculated', `Overall Semester 3 readiness updated to ${score}%.`, 'success');
    }
  };

  // Handler: Re-Run AI Audit
  const handleReRunAudit = () => {
    if (hasInvalidMarks || !isAllMarksEntered) {
      if (addToast) {
        addToast('Validation Error', 'Cannot run AI Audit until all 7 subject marks are valid (<= 50).', 'warning');
      }
      return;
    }

    setIsAuditing(true);
    setAuditMessage('Analyzing Semester 3 Internal Assessment Trends...');

    setTimeout(() => {
      setIsAuditing(false);
      setAuditMessage(null);
      const newScore = updateOverallReadiness(subjects);
      if (addToast) {
        addToast('AI Audit Complete', `Analyzed Sem 3 performance trends. Readiness: ${newScore}%`, 'success');
      }
    }, 1500);
  };

  // REACTIVE 6-WEEK RECOVERY ROADMAP (PREVENTED FROM GENERATING ON INVALID MARKS)
  const dynamicRoadmap = useMemo(() => {
    if (hasInvalidMarks) return [];

    const weakList = subjects.filter(
      (s) => s.internalMarks !== '' && !isNaN(Number(s.internalMarks)) && Number(s.internalMarks) < 40
    );
    const activeList = weakList.length > 0 ? weakList : subjects;

    return [
      { week: 1, title: "Discrete Math Foundations", desc: "Logic & Set Theory Baseline", status: "Done" },
      {
        week: 2,
        title: activeList[0] ? activeList[0].name : "Computer Networks",
        desc: activeList[0] ? `Code: ${activeList[0].code} • Marks: ${activeList[0].internalMarks || 0}/50` : "OSI & Subnetting",
        status: "Current"
      },
      {
        week: 3,
        title: activeList[1] ? activeList[1].name : "Advanced DSA",
        desc: activeList[1] ? `Code: ${activeList[1].code} • Marks: ${activeList[1].internalMarks || 0}/50` : "Red-Black Trees & DP",
        status: "Upcoming"
      },
      {
        week: 4,
        title: activeList[2] ? activeList[2].name : "AI & Machine Learning",
        desc: activeList[2] ? `Code: ${activeList[2].code} • Marks: ${activeList[2].internalMarks || 0}/50` : "Supervised Algorithms",
        status: "Upcoming"
      },
      {
        week: 5,
        title: activeList[3] ? activeList[3].name : "Embedded System Design",
        desc: activeList[3] ? `Code: ${activeList[3].code} • Marks: ${activeList[3].internalMarks || 0}/50` : "Microcontrollers & GPIO",
        status: "Upcoming"
      },
      { week: 6, title: "Semester 3 Final Mock Exam", desc: "Full Comprehensive Evaluation", status: "Upcoming" }
    ];
  }, [subjects, hasInvalidMarks]);

  // REACTIVE AI STUDY PRIORITIES QUEUE (PREVENTED FROM GENERATING ON INVALID MARKS)
  const dynamicPriorities = useMemo(() => {
    if (hasInvalidMarks) return [];

    return subjects.map((sub) => {
      const scoreVal = sub.internalMarks !== '' && !isNaN(Number(sub.internalMarks)) ? Number(sub.internalMarks) : 0;
      const pct = Math.round((scoreVal / (sub.maxMarks || 50)) * 100);

      if (scoreVal < 35) {
        return {
          id: sub.id,
          code: sub.code,
          name: sub.name,
          score: scoreVal,
          pct,
          priority: 'High Priority',
          badgeClass: 'bg-rose-100 text-[#701C34] border-rose-200',
          icon: AlertCircle,
          iconColor: 'text-[#701C34]',
          borderClass: 'border-rose-200 hover:border-[#701C34]',
          estTime: '45 mins',
          desc: `IA score in ${sub.code} is currently at ${sub.internalMarks || '0'}/50 (${pct}%). Focus on core problem solving, code derivations, and domain practice.`
        };
      } else if (scoreVal <= 40) {
        return {
          id: sub.id,
          code: sub.code,
          name: sub.name,
          score: scoreVal,
          pct,
          priority: 'Review Needed',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600',
          borderClass: 'border-amber-200 hover:border-amber-400',
          estTime: '30 mins',
          desc: `IA score in ${sub.code} is at ${sub.internalMarks}/50 (${pct}%). Practice numerical problem sets and core concept reviews.`
        };
      } else {
        return {
          id: sub.id,
          code: sub.code,
          name: sub.name,
          score: scoreVal,
          pct,
          priority: 'Maintain Pace',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          borderClass: 'border-emerald-200 hover:border-emerald-400',
          estTime: '15 mins',
          desc: `Strong performance in ${sub.code} at ${sub.internalMarks}/50 (${pct}%). Maintain speed with quick diagnostic drills.`
        };
      }
    });
  }, [subjects, hasInvalidMarks]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* Banner Welcome Section: Primary College Maroon Header (#701C34) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A1021] via-[#701C34] to-[#581427] p-6 rounded-2xl border border-[#581427] shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Official Syllabus • Semester 3 Curriculum</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Semester 3 Academic Assessment & Study Hub
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Manage your 7 official Semester 3 courses, input Internal Assessment (IA) test scores out of 50, detect knowledge gaps, and follow dynamic adaptive study roadmaps.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-stretch md:self-auto shrink-0">
          <button
            onClick={handleReRunAudit}
            disabled={isAuditing || hasInvalidMarks || !isAllMarksEntered}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-white hover:bg-rose-50 text-[#701C34] disabled:bg-slate-800 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-extrabold text-xs transition-all shadow-lg"
          >
            <Zap className={`w-4 h-4 text-[#701C34] ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing...' : 'Re-Run AI Audit'}</span>
          </button>
        </div>
      </div>

      {/* AI Audit Loading Banner */}
      {isAuditing && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3 text-[#701C34] text-xs font-bold">
            <RefreshCw className="w-4 h-4 text-[#701C34] animate-spin" />
            <span>{auditMessage}</span>
          </div>
          <span className="text-[11px] font-semibold text-[#701C34]">Pacing Sem 3 IA Engine...</span>
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
                  <Sliders className="w-5 h-5 text-[#701C34]" />
                  <span>Semester 3 IA Marks Assessment</span>
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">7 Predefined Official Semester 3 Courses (Locked Structure)</p>
              </div>
              <div className="flex items-center space-x-1.5 bg-rose-50 text-[#701C34] px-2.5 py-1 rounded-lg border border-rose-200 text-[11px] font-bold shrink-0">
                <Lock className="w-3 h-3 text-[#701C34]" />
                <span>Predefined (7/7)</span>
              </div>
            </div>

            {/* Validation Banner: INVALID MARKS EXCEEDING 50 */}
            {hasInvalidMarks ? (
              <div className="mt-4 p-3.5 bg-rose-100 border border-red-300 rounded-xl text-xs font-extrabold text-red-950 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Cannot calculate readiness: Please fix invalid marks (exceeding 50).</span>
              </div>
            ) : !isAllMarksEntered ? (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Please enter marks for all 7 subjects to calculate Semester Readiness.</span>
                </div>
                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 shrink-0 ml-2">
                  {completedCount} / 7 Entered
                </span>
              </div>
            ) : null}

            {/* 7 Predefined Locked Subjects Roster */}
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1 uppercase tracking-wider">
                <span>Course & Subject Title</span>
                <div className="flex items-center space-x-6 pr-2">
                  <span>IA Score (/50)</span>
                  <span>Credits</span>
                </div>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const valNum = Number(sub.internalMarks);
                  const isExceeding = sub.internalMarks !== '' && sub.internalMarks !== null && !isNaN(valNum) && (valNum > (sub.maxMarks || 50) || valNum < 0);

                  return (
                    <div
                      key={sub.id}
                      className={`border rounded-xl p-2.5 transition-colors ${
                        isExceeding
                          ? 'bg-rose-50/80 border-red-400 ring-2 ring-red-200'
                          : sub.internalMarks === '' || sub.internalMarks === null
                          ? 'bg-amber-50/40 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-[150px]">
                          <div className="flex items-center space-x-1.5 mb-0.5">
                            <span className="text-[9px] font-black text-[#701C34] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 uppercase tracking-wider">
                              {sub.code}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">
                              {sub.dept}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 leading-snug">
                            {sub.name}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 shrink-0">
                          {/* Score Input with NO auto-clamping, allowing typed numbers */}
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              placeholder="0-50"
                              value={sub.internalMarks}
                              onChange={(e) => {
                                handleUpdateSubjectMark(sub.id, e.target.value);
                              }}
                              className={`border rounded-lg px-2 py-1 text-xs text-center font-extrabold focus:outline-none w-16 sm:w-18 ${
                                isExceeding
                                  ? 'bg-white border-red-500 text-red-700 ring-2 ring-red-200 font-black'
                                  : sub.internalMarks === '' || sub.internalMarks === null
                                  ? 'bg-white border-amber-300 text-amber-700 placeholder-amber-400 ring-2 ring-amber-100'
                                  : 'bg-white border-slate-300 text-slate-900 focus:border-[#701C34]'
                              }`}
                            />
                            <span className="text-xs text-slate-400 font-bold">/{sub.maxMarks || 50}</span>
                          </div>

                          {/* Locked Read-only Credits Badge */}
                          <span className="text-xs font-extrabold text-slate-700 bg-slate-200/70 px-2 py-1 rounded-md border border-slate-300 w-8 text-center">
                            {sub.credits}
                          </span>
                        </div>
                      </div>

                      {/* INLINE WARNING MESSAGE FOR EXCEEDING 50 */}
                      {isExceeding && (
                        <div className="text-[10px] font-extrabold text-red-600 flex items-center space-x-1 mt-1.5 pt-1 border-t border-red-200">
                          <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
                          <span>Marks above 50 cannot be added!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assessment Footer Action: Solid Maroon Primary Button */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
              Out of 50 IA Evaluation Mode • {completedCount}/7 Completed
            </span>
            <button
              onClick={handleCalculateReadiness}
              disabled={hasInvalidMarks || !isAllMarksEntered}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-md ${
                isAllMarksEntered && !hasInvalidMarks
                  ? 'bg-[#701C34] hover:bg-[#581427] text-white shadow-[#701C34]/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Semester Readiness</span>
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
                  <BarChart3 className="w-5 h-5 text-[#701C34]" />
                  <span>Performance Analysis & Risk Classification</span>
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Semester 3 IA score risk & readiness</p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#701C34]" />
                <span>Semester 3</span>
              </div>
            </div>

            <div className="mt-5 space-y-6">
              
              {/* Dynamic Horizontal Bar Charts */}
              <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const risk = calculateRisk(sub.internalMarks);
                  const isFilled = sub.internalMarks !== '' && sub.internalMarks !== null;

                  return (
                    <div key={sub.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1.5">
                          {sub.code && <span className="text-[9px] font-black text-slate-500">{sub.code}:</span>}
                          <span className="font-bold text-slate-800">{sub.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 font-semibold">
                            {isFilled ? `${sub.internalMarks} / 50` : 'Not Entered'}
                          </span>
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border ${risk.bg}`}>
                            <span>{risk.status} {isFilled ? `(${risk.pct}%)` : ''}</span>
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
                    <Target className="w-4 h-4 text-[#701C34]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Overall Semester 3 Readiness Score
                    </span>
                  </div>

                  {hasInvalidMarks ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border bg-rose-100 text-red-900 border-red-300">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Invalid Input</span>
                    </span>
                  ) : isAllMarksEntered ? (
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                      readinessScore >= 75
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : readinessScore >= 60
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-100 text-[#701C34] border-rose-200'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{readinessScore}% • {readinessScore >= 75 ? 'On Track' : readinessScore >= 60 ? 'Review Rec.' : 'At Risk'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-amber-50 text-amber-800 border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending • Enter All 7 Subject Marks</span>
                    </span>
                  )}
                </div>

                {/* Speedometer-Style Horizontal Linear Progress Bar / INVALID ERROR CALLOUT */}
                {hasInvalidMarks ? (
                  <div className="p-4 bg-rose-100/90 border border-red-300 rounded-xl text-center space-y-1">
                    <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
                    <p className="text-xs font-black text-red-950 leading-snug">
                      Cannot calculate readiness: Please fix invalid marks (exceeding 50).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300 relative">
                      <div
                        className="bg-gradient-to-r from-[#701C34] via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${isAllMarksEntered ? Math.min(100, Math.max(0, readinessScore)) : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
                      <span>0% (Critical)</span>
                      <span>50% (Baseline)</span>
                      <span className="text-[#701C34] font-extrabold">{isAllMarksEntered ? `${readinessScore}% Current` : 'Pending'}</span>
                      <span>100% (Dean's Honor)</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Performance Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#701C34] shrink-0" />
              <span>Primary Weak Area: {subjects.find(s => s.internalMarks !== '' && Number(s.internalMarks) < 35)?.name || 'None identified'}</span>
            </span>
            <span className="text-[#701C34] font-bold">Auto-updated</span>
          </div>
        </div>
      </div>

      {/* CARD 3: 6-Week Adaptive Study Roadmap (PREVENTED FROM GENERATING ON INVALID MARKS) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">6-Week Adaptive Study Roadmap</h2>
              <span className="bg-rose-50 text-[#701C34] text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded border border-rose-200">
                Sem 3 AI Scheduled
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Sequential learning milestones dynamically re-calculated from your 7 official Semester 3 courses
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#701C34]" />
            <span>Pacing: 6 hrs/week</span>
          </div>
        </div>

        {/* Stepper Roadmap Container / INVALID MARKS PLACEHOLDER */}
        {hasInvalidMarks ? (
          <div className="mt-6 p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
            <p className="text-xs font-black text-red-900">
              Roadmap generation paused: Please correct invalid mark entries exceeding 50.
            </p>
          </div>
        ) : (
          <div className="mt-8 mb-2 relative px-2">
            <div className="hidden lg:block absolute top-[28px] left-[40px] right-[40px] h-[4px] bg-slate-200 z-0">
              <div className="bg-gradient-to-r from-emerald-500 via-[#701C34] to-slate-200 h-full w-[33%] rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
              {dynamicRoadmap.map((step) => (
                <div
                  key={step.week}
                  className={`flex flex-col items-start lg:items-center text-left lg:text-center group p-3 lg:p-0 rounded-xl lg:rounded-none transition-all ${
                    step.status === 'Current'
                      ? 'bg-rose-50/50 lg:bg-transparent'
                      : 'bg-slate-50 lg:bg-transparent'
                  }`}
                >
                  <div className={`relative z-10 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white border-2 p-1 flex items-center justify-center shadow-md ${
                    step.status === 'Done'
                      ? 'border-emerald-500'
                      : step.status === 'Current'
                      ? 'border-[#701C34] ring-4 ring-rose-100'
                      : 'border-slate-300'
                  }`}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-900 font-black text-sm">
                      {step.status === 'Done' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : step.week === 6 ? (
                        <Award className="w-6 h-6 text-slate-700" />
                      ) : (
                        <span className={step.status === 'Current' ? 'text-[#701C34] font-black text-base' : 'text-slate-700 font-bold text-xs'}>
                          W{step.week}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      step.status === 'Done'
                        ? 'text-emerald-800 bg-emerald-100 border-emerald-200'
                        : step.status === 'Current'
                        ? 'text-[#701C34] bg-rose-100 border-rose-200'
                        : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}>
                      Wk {step.week} • {step.status}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#701C34] transition-colors line-clamp-1">
                      {step.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CARD 4: AI SUGGESTED STUDY PRIORITIES (PREVENTED FROM GENERATING ON INVALID MARKS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#701C34]" />
              <span>AI-Suggested Study Priorities</span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Priority-ranked modules dynamically re-calculated from your 7 Semester 3 courses
            </p>
          </div>
        </div>

        {hasInvalidMarks ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
            <p className="text-xs font-black text-red-900">
              AI Study Priorities unavailable: Please fix invalid marks exceeding 50.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dynamicPriorities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-md transition-all duration-200 hover:-translate-y-1 relative overflow-hidden group ${item.borderClass}`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#701C34]/5 rounded-full blur-xl group-hover:bg-[#701C34]/10 transition-all" />
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${item.badgeClass}`}>
                        <Icon className={`w-3 h-3 ${item.iconColor}`} />
                        <span>{item.priority}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">Est. {item.estTime}</span>
                    </div>

                    <div className="space-y-1">
                      {item.code && (
                        <span className="text-[10px] font-black text-[#701C34] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {item.code}
                        </span>
                      )}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#701C34] transition-colors pt-1">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-semibold">{item.pct}% Score</span>
                    <button
                      onClick={() => onNavigateToQuiz && onNavigateToQuiz(item.name)}
                      className="px-4 py-2 bg-[#701C34] hover:bg-[#581427] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <span>Start Practice</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
