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
  Lock,
  Download,
  Info,
  FileText
} from 'lucide-react';
import { generateStudentPDFReport } from '../utils/pdfExport';
import { calculateReadiness, notifyMarksUpdated, getWeakSubject, getWeakSubjects, getAssessmentScores } from '../utils/readiness';

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
    const saved = localStorage.getItem('studentMarks') || localStorage.getItem('learnsphere_subjects');
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

  // Assessment Quiz Practice scores state (real-time sync)
  const [assessmentScores, setAssessmentScores] = useState(getAssessmentScores);

  // Interactive 6-Week Recovery Roadmap completed weeks state
  const [completedWeeks, setCompletedWeeks] = useState(() => {
    const saved = localStorage.getItem('learnsphere_completed_weeks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [1]; // Default Week 1 is completed
  });

  const toggleWeekCompleted = (weekNum) => {
    let updated;
    if (completedWeeks.includes(weekNum)) {
      updated = completedWeeks.filter((w) => w !== weekNum);
    } else {
      updated = [...completedWeeks, weekNum];
    }
    setCompletedWeeks(updated);
    localStorage.setItem('learnsphere_completed_weeks', JSON.stringify(updated));
    window.dispatchEvent(new Event('learnsphere-marks-updated'));
    if (addToast) {
      addToast('Study Plan Re-balanced', `Week ${weekNum} status updated & roadmap dynamically recalculated.`, 'success');
    }
  };

  useEffect(() => {
    const syncQuizScores = () => {
      setAssessmentScores(getAssessmentScores());
      const savedWeeks = localStorage.getItem('learnsphere_completed_weeks');
      if (savedWeeks) {
        try {
          const parsed = JSON.parse(savedWeeks);
          if (Array.isArray(parsed)) setCompletedWeeks(parsed);
        } catch (e) {}
      }
    };
    window.addEventListener('storage', syncQuizScores);
    window.addEventListener('learnsphere-marks-updated', syncQuizScores);
    return () => {
      window.removeEventListener('storage', syncQuizScores);
      window.removeEventListener('learnsphere-marks-updated', syncQuizScores);
    };
  }, []);

  // Auto-save subjects state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studentMarks', JSON.stringify(subjects));
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

  // Dynamically compute overall readiness score using shared utility
  const updateOverallReadiness = (subjectList) => {
    const avgScore = calculateReadiness(subjectList);
    if (avgScore !== null) {
      setReadinessScore(avgScore);
      return avgScore;
    }
    return 0;
  };

  const handleUpdateSubjectMark = (id, rawValue) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, internalMarks: rawValue } : s));
    setSubjects(updated);
    notifyMarksUpdated(updated);

    const calculated = calculateReadiness(updated);
    if (calculated !== null) {
      setReadinessScore(calculated);
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

  // FEATURE 1 & 6: DOWNLOAD FORMATTED STUDENT READINESS PDF REPORT FOR NITHEESH
  const handleDownloadReport = () => {
    if (hasInvalidMarks) {
      if (addToast) {
        addToast('Download Error', 'Please fix invalid mark entries exceeding 50 before downloading.', 'warning');
      }
      return;
    }

    const formattedSubjects = subjects.map((sub) => ({
      code: sub.code,
      name: sub.name,
      score: sub.internalMarks !== '' ? sub.internalMarks : 0,
      max: sub.maxMarks || 50,
      status: Number(sub.internalMarks) > 40 ? 'Strong' : Number(sub.internalMarks) >= 35 ? 'Average' : 'Weak'
    }));

    const weakSubs = subjects.filter(s => Number(s.internalMarks) < 35).map(s => s.name);

    generateStudentPDFReport({
      name: "Nitheesh",
      studentCode: "CSE-2026-018",
      institution: "Easwari Engineering College",
      department: "Department of Computer Science & Engineering",
      semester: "Semester 3 (CSE)",
      readinessScore: isAllMarksEntered ? readinessScore : 0,
      riskLevel: readinessScore >= 75 ? "On Track / Low Risk" : readinessScore >= 60 ? "Moderate Risk" : "High Risk",
      subjects: formattedSubjects,
      recommendations: weakSubs.length > 0
        ? weakSubs.map(w => `Focus on foundational practice and code derivations in ${w}.`)
        : ["Maintain academic pacing with daily diagnostic drills."]
    });

    if (addToast) {
      addToast('PDF Download Triggered', 'Personalized Semester 3 PDF Report generated for Nitheesh.', 'success');
    }
  };

  // REACTIVE 6-WEEK RECOVERY ROADMAP (LOGICAL STAGES & INTERACTIVE RE-BALANCING)
  const dynamicRoadmap = useMemo(() => {
    if (hasInvalidMarks) return [];

    const sortedByLowest = [...subjects]
      .filter((s) => s.internalMarks !== '' && s.internalMarks !== null && !isNaN(Number(s.internalMarks)))
      .sort((a, b) => {
        const scoreA = Number(a.internalMarks) / Number(a.maxMarks || 50);
        const scoreB = Number(b.internalMarks) / Number(b.maxMarks || 50);
        return scoreA - scoreB;
      });

    const activeList = sortedByLowest.length > 0 ? sortedByLowest : subjects;

    const basePlan = [
      {
        week: 1,
        stage: "Concept Foundations",
        title: `W1: Concept Foundations — ${activeList[0] ? activeList[0].code : 'ESD'}`,
        desc: `Core concepts & formula derivations in ${activeList[0] ? activeList[0].name.split('(')[0] : 'ESD'}`
      },
      {
        week: 2,
        stage: "Sub-topic Mastery",
        title: `W2: Sub-topic Mastery — ${activeList[0] ? activeList[0].code : 'ESD'} Key Modules`,
        desc: activeList[0] ? `GPIO Timers & PWM drills (${activeList[0].internalMarks}/50)` : "Sub-topic practice"
      },
      {
        week: 3,
        stage: "Sub-topic Mastery",
        title: `W3: Sub-topic Mastery — ${activeList[1] ? activeList[1].code : 'ADSA'} Intensive`,
        desc: activeList[1] ? `Red-Black Trees & DP Memoization (${activeList[1].internalMarks}/50)` : "Advanced data structures"
      },
      {
        week: 4,
        stage: "Sub-topic Mastery",
        title: `W4: Sub-topic Mastery — ${activeList[2] ? activeList[2].code : 'CN'} Deep Dive`,
        desc: activeList[2] ? `TCP 3-Way Handshake & Subnetting (${activeList[2].internalMarks}/50)` : "Network protocol drills"
      },
      {
        week: 5,
        stage: "LeetCode Practice",
        title: "W5: LeetCode Practice — Algorithms & DSA",
        desc: "Solve 10 algorithm problem sets for ADSA, CN & OOPJ"
      },
      {
        week: 6,
        stage: "Final Assessment",
        title: "W6: Final Assessment — Comprehensive Mock Exam",
        desc: "Full 50-mark Semester 3 mock assessment evaluation"
      }
    ];

    // Find first incomplete week
    let currentWeekNum = 1;
    for (let w = 1; w <= 6; w++) {
      if (!completedWeeks.includes(w)) {
        currentWeekNum = w;
        break;
      }
    }

    return basePlan.map((w) => {
      const isDone = completedWeeks.includes(w.week);
      const isCurrent = !isDone && w.week === currentWeekNum;
      return {
        ...w,
        status: isDone ? 'Done' : isCurrent ? 'Current' : 'Upcoming'
      };
    });
  }, [subjects, hasInvalidMarks, completedWeeks]);

  // REACTIVE AI STUDY PRIORITIES QUEUE (SORTED BY LOWEST SCORE FIRST)
  const dynamicPriorities = useMemo(() => {
    if (hasInvalidMarks) return [];

    const list = subjects.map((sub) => {
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

    return list.sort((a, b) => a.score - b.score);
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

        <div className="flex items-center space-x-2.5 self-stretch md:self-auto shrink-0 flex-wrap sm:flex-nowrap">
          {/* Download PDF Report Button */}
          <button
            onClick={handleDownloadReport}
            disabled={hasInvalidMarks}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-900/60 hover:bg-rose-900 border border-rose-400/40 text-white rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
            title="Download PDF Readiness Report for Nitheesh"
          >
            <Download className="w-4 h-4 text-rose-200" />
            <span>Download PDF Report</span>
          </button>

          {/* Re-Run AI Audit Button */}
          <button
            onClick={handleReRunAudit}
            disabled={isAuditing || hasInvalidMarks || !isAllMarksEntered}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-white hover:bg-rose-50 text-[#701C34] disabled:bg-slate-800 disabled:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl font-extrabold text-xs transition-all shadow-lg"
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
                          {/* Score Input */}
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

          {/* Assessment Footer Action */}
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
                  
                  {/* Title & READINESS METHODOLOGY TOOLTIP */}
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-[#701C34]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Overall Semester 3 Readiness Score
                    </span>
                    
                    {/* Hover Tooltip (ⓘ) */}
                    <div className="relative group inline-flex items-center z-20">
                      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-[#701C34] cursor-pointer transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white text-[11px] font-medium rounded-xl shadow-xl pointer-events-none leading-relaxed border border-slate-800">
                        Adaptive Readiness Score is calculated using a weighted formula combining Semester 3 assessment marks, Focus Mode practice accuracy, and topic weakness distribution.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                      </div>
                    </div>
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

                {/* Speedometer-Style Horizontal Linear Progress Bar */}
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
              <span>Identified Weak Subject(s): <strong className="text-[#701C34]">{getWeakSubject(subjects)}</strong></span>
            </span>
            <span className="text-[#701C34] font-bold">Auto-updated</span>
          </div>
        </div>
      </div>

      {/* SECTION: Recent Assessment Performance & Test Scores */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#701C34]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Recent Assessment Performance & Test Scores
              </h2>
              <span className="bg-rose-50 text-[#701C34] text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded border border-rose-200">
                Official Marks & Quiz Metrics
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              Exact internal assessment test scores out of 50, computed percentages, and focus practice accuracy scores for all 7 Semester 3 subjects.
            </p>
          </div>
        </div>

        {/* 7 Subject Assessment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const rawVal = sub.internalMarks !== '' && sub.internalMarks !== null && !isNaN(Number(sub.internalMarks)) ? Number(sub.internalMarks) : 0;
            const formattedVal = rawVal < 10 ? `0${rawVal}` : `${rawVal}`;
            const pct = Math.round((rawVal / (sub.maxMarks || 50)) * 100);

            // Fetch quiz practice accuracy score for this subject
            const qData = assessmentScores[sub.code] || { score: 7, total: 10, pct: 70 };
            const qScoreStr = `Quiz Score: ${qData.score}/${qData.total} (${qData.pct}%)`;

            // Status Badge: Critical (<50%), Baseline (50-74%), Honors (>=75%)
            let statusLabel = 'Baseline';
            let badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
            if (pct < 50) {
              statusLabel = 'Critical';
              badgeBg = 'bg-rose-100 text-[#701C34] border-rose-200';
            } else if (pct >= 75) {
              statusLabel = 'Honors';
              badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            }

            const mneCode = sub.code ? sub.code.split('30')[0] || 'SUB' : 'SUB';

            return (
              <div
                key={sub.id}
                className="bg-slate-50/80 border border-slate-200 hover:border-rose-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-2xs transition-all hover:bg-white"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {sub.code}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${badgeBg}`}>
                      {statusLabel} ({pct}%)
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mt-1 line-clamp-1">{sub.name}</h4>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Internal Assessment:</span>
                    <span className="font-black text-[#701C34]">
                      {mneCode}: {formattedVal} / 50 Marks
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Computed Subject Pct:</span>
                    <span className="font-black text-slate-900">{pct}%</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-xl border border-slate-200 font-semibold text-slate-700">
                    <div className="flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#701C34]" />
                      <span className="font-extrabold text-slate-900">{qScoreStr}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CARD 3: 6-Week Adaptive Study Roadmap */}
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

        {/* Stepper Roadmap Container */}
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
              {dynamicRoadmap.map((step) => {
                const isCompleted = step.status === 'Done';
                return (
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
                    <div className="mt-3 space-y-1.5 w-full flex flex-col items-start lg:items-center">
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
                      
                      {/* INTERACTIVE TOPIC COMPLETION BUTTON (REAL-TIME RE-BALANCING) */}
                      <button
                        onClick={() => toggleWeekCompleted(step.week)}
                        className={`mt-2 w-full lg:w-auto px-2.5 py-1 rounded-lg text-[10px] font-black transition-all flex items-center justify-center space-x-1 border shadow-2xs ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-50 hover:text-[#701C34] hover:border-rose-200'
                        }`}
                        title={`Click to mark Week ${step.week} as ${isCompleted ? 'Incomplete' : 'Completed'}`}
                      >
                        <CheckCircle2 className={`w-3 h-3 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{isCompleted ? 'Completed' : 'Mark as Done'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SECTION: Recommended Resources & Practice */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#701C34]" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Recommended Resources & Practice
              </h2>
              <span className="bg-rose-50 text-[#701C34] text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded border border-rose-200">
                Curated Tutorials & Focus Mode
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Curated NPTEL & video lecture tutorials mapped directly to identified weak topics, paired with 10-question Focus Mode diagnostic quizzes.
            </p>
          </div>

          <button
            onClick={() => onNavigateToQuiz && onNavigateToQuiz()}
            className="px-4 py-2 bg-[#701C34] hover:bg-[#581427] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Launch Focus Mode Quiz</span>
          </button>
        </div>

        {/* Video Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "GPIO Timers & PWM Generation in ESD",
              course: "2321CSS301J — ESD",
              platform: "NPTEL / YouTube",
              duration: "24 mins",
              weakTopic: "GPIO Timers",
              link: "https://www.youtube.com/results?search_query=embedded+system+design+gpio+timers+pwm",
              bg: "bg-rose-50/70 border-rose-200"
            },
            {
              title: "Red-Black Trees & Dynamic Programming",
              course: "2321CSC302J — ADSA",
              platform: "MIT OpenCourseWare",
              duration: "32 mins",
              weakTopic: "Red-Black Trees",
              link: "https://www.youtube.com/results?search_query=red+black+trees+dynamic+programming+adsa",
              bg: "bg-amber-50/70 border-amber-200"
            },
            {
              title: "TCP 3-Way Handshake & Subnetting",
              course: "2321CSC301T — CN",
              platform: "NPTEL Video Series",
              duration: "28 mins",
              weakTopic: "TCP Handshake",
              link: "https://www.youtube.com/results?search_query=computer+networks+tcp+three+way+handshake",
              bg: "bg-slate-50 border-slate-200"
            },
            {
              title: "Set Theory, Logic & Recurrence Relations",
              course: "2321MAB301T — DM",
              platform: "NPTEL Mathematics",
              duration: "30 mins",
              weakTopic: "Logic & Recurrence",
              link: "https://www.youtube.com/results?search_query=discrete+mathematics+recurrence+relations",
              bg: "bg-emerald-50/70 border-emerald-200"
            }
          ].map((vid, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${vid.bg} flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md transition-all`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#701C34] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {vid.course}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{vid.duration}</span>
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">{vid.title}</h4>
                <p className="text-[10px] font-semibold text-slate-500">{vid.platform}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[9px] font-extrabold text-[#701C34] bg-white px-1.5 py-0.5 rounded border border-rose-200">
                  Target: {vid.weakTopic}
                </span>
                <a
                  href={vid.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-[#701C34] hover:bg-[#581427] text-white rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 shadow-2xs"
                >
                  <span>Watch</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CARD 4: AI SUGGESTED STUDY PRIORITIES */}
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
