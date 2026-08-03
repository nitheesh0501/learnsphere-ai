import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle2, Search, Shield, Activity, FileText, Zap } from 'lucide-react';
import { generateStudentPDFReport } from '../utils/pdfExport';
import { calculateReadiness, getWeakSubject, getWeakSubjects, getSafeLocalStorage } from '../utils/readiness';

// HARDCODED VALID FACULTY ROSTER DATA (8 DISTINCT STUDENTS INCLUDING NITHEESH)
const facultyRosterData = [
  {
    id: "NI_H",
    name: "Nitheesh",
    student_name: "Nitheesh",
    rollNo: "CSE-2026-018",
    student_code: "CSE-2026-018",
    weakSubject: "2321CSS301J — Embedded System Design (ESD)",
    weak_subject: "2321CSS301J — Embedded System Design (ESD)",
    subTopics: ["GPIO Timers", "PWM Generation"],
    concept_gaps: ["GPIO Timers", "PWM Generation"],
    readinessScore: "51%",
    readiness_score: 51.0,
    riskStatus: "Needs Review",
    risk_level: "Needs Review",
    interventionStatus: "On Track",
    status: "On Track",
    avatar: "NI",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 42, max: 50, status: 'Strong' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 34, max: 50, status: 'Average' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 31, max: 50, status: 'Weak' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & Machine Learning (FAIML)', score: 38, max: 50, status: 'Average' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 28, max: 50, status: 'Weak' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 22.5, max: 50, status: 'Weak' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 46, max: 50, status: 'Strong' }
    ],
    recommendations: [
      "Targeted revision on Embedded System Design GPIO Timers & PWM generation.",
      "Complete 2 LeetCode Medium challenges on Advanced DSA (Red-Black Trees & DP)."
    ]
  },
  {
    id: "SA",
    name: "Santhosh",
    student_name: "Santhosh",
    rollNo: "CSE-2026-042",
    student_code: "CSE-2026-042",
    weakSubject: "2321CSC301T — Computer Networks (CN)",
    weak_subject: "2321CSC301T — Computer Networks (CN)",
    subTopics: ["TCP Handshake", "Subnetting"],
    concept_gaps: ["TCP Handshake", "Subnetting"],
    readinessScore: "82%",
    readiness_score: 82.0,
    riskStatus: "Low Risk",
    risk_level: "Low Risk",
    interventionStatus: "Resolved",
    status: "Resolved",
    avatar: "SA",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 45, max: 50, status: 'Strong' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 32, max: 50, status: 'Average' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 41, max: 50, status: 'Strong' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 44, max: 50, status: 'Strong' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 42, max: 50, status: 'Strong' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 39, max: 50, status: 'Average' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 44, max: 50, status: 'Strong' }
    ],
    recommendations: [
      "Targeted revision on Computer Networks OSI routing protocols & TCP Handshake.",
      "Maintain high accuracy across Discrete Math & AI/ML modules."
    ]
  },
  {
    id: "NI",
    name: "Nidhish",
    student_name: "Nidhish",
    rollNo: "CSE-2026-089",
    student_code: "CSE-2026-089",
    weakSubject: "2321MAB301T — Discrete Mathematics (DM)",
    weak_subject: "2321MAB301T — Discrete Mathematics (DM)",
    subTopics: ["Logic & Set Theory", "Recurrence Relations"],
    concept_gaps: ["Logic & Set Theory", "Recurrence Relations"],
    readinessScore: "58%",
    readiness_score: 58.0,
    riskStatus: "Needs Review",
    risk_level: "Needs Review",
    interventionStatus: "Remedial Assigned",
    status: "Remedial Assigned",
    avatar: "NI",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 22, max: 50, status: 'Weak' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 34, max: 50, status: 'Average' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 31, max: 50, status: 'Weak' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 35, max: 50, status: 'Average' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 24, max: 50, status: 'Weak' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 28, max: 50, status: 'Weak' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 29, max: 50, status: 'Weak' }
    ],
    recommendations: [
      "Practice set theory and graph logic in Discrete Mathematics.",
      "Complete hands-on GPIO microcontrollers laboratory practice in ESD."
    ]
  },
  {
    id: "SL",
    name: "Salih",
    student_name: "Salih",
    rollNo: "CSE-2026-112",
    student_code: "CSE-2026-112",
    weakSubject: "2321CSC302J — Advanced Data Structures & Algorithms (ADSA)",
    weak_subject: "2321CSC302J — Advanced Data Structures & Algorithms (ADSA)",
    subTopics: ["Red-Black Trees", "DP Memoization"],
    concept_gaps: ["Red-Black Trees", "DP Memoization"],
    readinessScore: "44%",
    readiness_score: 44.0,
    riskStatus: "High Risk",
    risk_level: "High Risk",
    interventionStatus: "Remedial Assigned",
    status: "Remedial Assigned",
    avatar: "SL",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 19, max: 50, status: 'Weak' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 20, max: 50, status: 'Weak' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 18, max: 50, status: 'Weak' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 25, max: 50, status: 'Weak' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 24, max: 50, status: 'Weak' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 22, max: 50, status: 'Weak' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 26, max: 50, status: 'Weak' }
    ],
    recommendations: [
      "Urgent 1-on-1 tutoring required for ADSA Red-Black trees & DP.",
      "Review TCP 3-way handshake and network subnetting fundamentals."
    ]
  },
  {
    id: "NA",
    name: "Nadya",
    student_name: "Nadya",
    rollNo: "CSE-2026-145",
    student_code: "CSE-2026-145",
    weakSubject: "2321CSS301J — Embedded System Design (ESD)",
    weak_subject: "2321CSS301J — Embedded System Design (ESD)",
    subTopics: ["GPIO Timers", "SPI Protocols"],
    concept_gaps: ["GPIO Timers", "SPI Protocols"],
    readinessScore: "91%",
    readiness_score: 91.0,
    riskStatus: "Low Risk",
    risk_level: "Low Risk",
    interventionStatus: "Resolved",
    status: "Resolved",
    avatar: "NA",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 48, max: 50, status: 'Strong' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 46, max: 50, status: 'Strong' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 45, max: 50, status: 'Strong' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 47, max: 50, status: 'Strong' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 38, max: 50, status: 'Average' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 46, max: 50, status: 'Strong' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 48, max: 50, status: 'Strong' }
    ],
    recommendations: [
      "Maintain excellence across all Semester 3 modules.",
      "Refine RTOS latency concepts for Embedded System Design."
    ]
  },
  {
    id: "ME",
    name: "Meghan",
    student_name: "Meghan",
    rollNo: "CSE-2026-018",
    student_code: "CSE-2026-018",
    weakSubject: "2321CSC303J — Fundamentals of AI & ML (FAIML)",
    weak_subject: "2321CSC303J — Fundamentals of AI & ML (FAIML)",
    subTopics: ["Supervised Learning", "Loss Functions"],
    concept_gaps: ["Supervised Learning", "Loss Functions"],
    readinessScore: "68%",
    readiness_score: 68.0,
    riskStatus: "Needs Review",
    risk_level: "Needs Review",
    interventionStatus: "Resolved",
    status: "Resolved",
    avatar: "ME",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 39, max: 50, status: 'Average' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 38, max: 50, status: 'Average' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 28, max: 50, status: 'Weak' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 26, max: 50, status: 'Weak' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 34, max: 50, status: 'Average' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 36, max: 50, status: 'Average' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 37, max: 50, status: 'Average' }
    ],
    recommendations: [
      "Focus on Supervised Machine Learning algorithms & Loss functions.",
      "Solve LeetCode Medium problem set on Dijkstra's Algorithm."
    ]
  },
  {
    id: "NT",
    name: "Nitish",
    student_name: "Nitish",
    rollNo: "CSE-2026-056",
    student_code: "CSE-2026-056",
    weakSubject: "2321CSC304R — OOP using Java (OOPJ)",
    weak_subject: "2321CSC304R — OOP using Java (OOPJ)",
    subTopics: ["Inheritance", "Multithreading"],
    concept_gaps: ["Inheritance", "Multithreading"],
    readinessScore: "52%",
    readiness_score: 52.0,
    riskStatus: "Needs Review",
    risk_level: "Needs Review",
    interventionStatus: "Flagged",
    status: "Flagged",
    avatar: "NT",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 23, max: 50, status: 'Weak' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 30, max: 50, status: 'Weak' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 27, max: 50, status: 'Weak' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 29, max: 50, status: 'Weak' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 28, max: 50, status: 'Weak' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 21, max: 50, status: 'Weak' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 25, max: 50, status: 'Weak' }
    ],
    recommendations: [
      "Practice Java OOP inheritance, polymorphism, and multithreading.",
      "Review discrete mathematical logic & recurrence relations."
    ]
  },
  {
    id: "PR",
    name: "Prajwant",
    student_name: "Prajwant",
    rollNo: "CSE-2026-074",
    student_code: "CSE-2026-074",
    weakSubject: "2321SDA301L — Career Skill Development III (CSD)",
    weak_subject: "2321SDA301L — Career Skill Development III (CSD)",
    subTopics: ["Quantitative Aptitude", "Reasoning"],
    concept_gaps: ["Quantitative Aptitude", "Reasoning"],
    readinessScore: "76%",
    readiness_score: 76.0,
    riskStatus: "Low Risk",
    risk_level: "Low Risk",
    interventionStatus: "Flagged",
    status: "Flagged",
    avatar: "PR",
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 40, max: 50, status: 'Average' },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 39, max: 50, status: 'Average' },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 38, max: 50, status: 'Average' },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 41, max: 50, status: 'Strong' },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 38, max: 50, status: 'Average' },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 39, max: 50, status: 'Average' },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 31, max: 50, status: 'Weak' }
    ],
    recommendations: [
      "Practice quantitative speed conversions and logical aptitude problem sets.",
      "Maintain high baseline scores across core CSE courses."
    ]
  }
];

export default function FacultyAnalytics({ addToast, nitheeshReadiness }) {
  const [students, setStudents] = useState(() => {
    const parsed = getSafeLocalStorage('learnsphere_roster', null);
    if (Array.isArray(parsed) && parsed.length === 8) return parsed;
    return facultyRosterData;
  });

  useEffect(() => {
    localStorage.setItem('learnsphere_roster', JSON.stringify(students));
  }, [students]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Students');

  // REAL-TIME LOCALSTORAGE + EVENT LISTENER SYNC FOR NITHEESH READINESS SCORE
  const [nitheeshReadinessVal, setNitheeshReadinessVal] = useState(() => {
    const parsedMarks = getSafeLocalStorage('studentMarks', getSafeLocalStorage('learnsphere_subjects', null));
    if (parsedMarks) {
      const score = calculateReadiness(parsedMarks);
      if (score !== null) return score;
    }
    return nitheeshReadiness !== undefined ? Math.round(Number(nitheeshReadiness)) : 51;
  });

  useEffect(() => {
    const syncStudentData = () => {
      const parsedMarks = getSafeLocalStorage('studentMarks', getSafeLocalStorage('learnsphere_subjects', null));
      if (parsedMarks) {
        const recalculatedReadiness = calculateReadiness(parsedMarks);
        setNitheeshReadinessVal(recalculatedReadiness);
      } else {
        const savedReadiness = localStorage.getItem('learnsphere_readiness');
        if (savedReadiness && !isNaN(Number(savedReadiness))) {
          setNitheeshReadinessVal(Math.round(Number(savedReadiness)));
        }
      }
    };
    
    window.addEventListener('storage', syncStudentData);
    window.addEventListener('learnsphere-marks-updated', syncStudentData);
    return () => {
      window.removeEventListener('storage', syncStudentData);
      window.removeEventListener('learnsphere-marks-updated', syncStudentData);
    };
  }, []);

  // DIRECT ACTION 1: FACULTY INDIVIDUAL STUDENT PDF REPORT DOWNLOAD HANDLER
  const handleDownloadStudentPDF = (stu) => {
    let numScore = typeof stu.readinessScore === 'string' 
      ? parseFloat(stu.readinessScore) 
      : (stu.readiness_score || 51.0);

    let stuSubjects = stu.subjects;
    let weakSub = stu.weakSubject || stu.weak_subject;

    // DYNAMIC SYNC FOR NITHEESH: Read live subject marks and readiness score from localStorage
    if (stu.id === "NI_H" || stu.name === "Nitheesh") {
      numScore = nitheeshReadinessVal !== null ? nitheeshReadinessVal : 51;
      const savedMarks = localStorage.getItem('studentMarks') || localStorage.getItem('learnsphere_subjects');
      if (savedMarks) {
        try {
          const parsed = JSON.parse(savedMarks);
          if (Array.isArray(parsed) && parsed.length === 7) {
            stuSubjects = parsed.map(s => ({
              code: s.code,
              name: s.name,
              score: Number(s.internalMarks) || 0,
              max: Number(s.maxMarks) || 50,
              status: Number(s.internalMarks) > 40 ? 'Strong' : Number(s.internalMarks) >= 35 ? 'Average' : 'Weak'
            }));
            weakSub = getWeakSubject(parsed);
          }
        } catch (e) {}
      }
    }

    generateStudentPDFReport({
      name: stu.name || stu.student_name,
      studentCode: stu.rollNo || stu.student_code,
      institution: "Easwari Engineering College",
      department: "Department of Computer Science & Engineering",
      semester: "Semester 3 (CSE)",
      readinessScore: numScore,
      riskLevel: stu.riskStatus || stu.risk_level,
      subjects: stuSubjects,
      recommendations: stu.recommendations || [
        `Targeted intervention for weak subject(s): ${weakSub}`,
        "Complete 6-Week Adaptive Recovery Roadmap drills in Focus Mode."
      ]
    });

    if (addToast) {
      addToast('PDF Generated', `Official Semester 3 PDF Report generated for ${stu.name || stu.student_name}.`, 'success');
    }
  };

  // FILTERING LOGIC
  const filteredStudents = students.filter((s) => {
    const sName = s.name || s.student_name || '';
    const sRoll = s.rollNo || s.student_code || '';
    const sWeak = s.weakSubject || s.weak_subject || '';

    const matchesSearch = sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sRoll.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sWeak.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    const currentStatus = s.interventionStatus || s.status || '';

    if (filterStatus === 'Flagged / At-Risk') {
      matchesFilter = currentStatus === 'Flagged' || s.riskStatus === 'High Risk';
    } else if (filterStatus === 'Remedial Assigned') {
      matchesFilter = currentStatus === 'Remedial Assigned';
    } else if (filterStatus === 'Performance Improved / Resolved') {
      matchesFilter = currentStatus === 'Resolved' || currentStatus === 'On Track';
    }

    return matchesSearch && matchesFilter;
  });

  const totalEnrolled = 128;
  const atRiskCount = students.filter((s) => (s.interventionStatus || s.status) === 'Flagged' || s.riskStatus === 'High Risk').length;
  const remedialAssignedCount = students.filter((s) => (s.interventionStatus || s.status) === 'Remedial Assigned').length;
  const resolvedCount = students.filter((s) => (s.interventionStatus || s.status) === 'Resolved' || (s.interventionStatus || s.status) === 'On Track').length;

  // SAFE CLASS AVERAGE READINESS CALCULATION (DYNAMIC FOR NITHEESH)
  const validReadinesses = students.map(s => {
    if (s.id === "NI_H" || s.name === "Nitheesh") {
      return nitheeshReadinessVal !== null ? nitheeshReadinessVal : 0;
    }
    if (typeof s.readinessScore === 'string') return parseFloat(s.readinessScore) || 0;
    return Number(s.readiness_score) || 0;
  });
  const classAvgPct = students.length > 0 
    ? (validReadinesses.reduce((acc, val) => acc + val, 0) / students.length).toFixed(1) 
    : '68.6';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* Header Banner: Faculty Analytics & Intervention Portal — Prof. Madhumitha */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A1021] via-[#701C34] to-[#581427] p-5 sm:p-6 rounded-2xl border border-[#581427] text-white shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-rose-300" />
            <span>Prof. Madhumitha | Course Coordinator — Semester 3 CSE</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Faculty Analytics & Intervention Portal — Prof. Madhumitha
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Easwari Engineering College • Monitor 7 official Semester 3 courses, assign targeted recovery roadmaps, inspect inline weaknesses, and export verified PDF performance reports.
          </p>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* KPI 1: Total Enrolled */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Students</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalEnrolled}</p>
            <p className="text-[11px] text-slate-500 mt-1">Computer Science Dept • Sem 3</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: At-Risk Students */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flagged / At-Risk</p>
            <p className="text-3xl font-black text-[#701C34] mt-1">{atRiskCount}</p>
            <p className="text-[11px] text-[#701C34] font-bold mt-1">Requires Remedial Action</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#701C34] shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Remedial Assigned & Performance Improved */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remedial Active / Resolved</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{remedialAssignedCount + resolvedCount}</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">{remedialAssignedCount} Assigned • {resolvedCount} Resolved/Track</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* HIGH-LEVEL PROBLEM STATEMENT ANALYTICS SUMMARY BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-[#701C34] to-[#581427] text-white rounded-2xl p-5 shadow-lg border border-rose-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Activity className="w-6 h-6 text-rose-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                Faculty Lead: Prof. Madhumitha
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              Semester 3 System Performance Diagnostic
            </h3>
            <p className="text-xs text-rose-100/80 mt-0.5">
              Aggregated early intervention metrics across all 7 core Semester 3 subject domains
            </p>
          </div>
        </div>

        {/* 3 Metric Pill Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] text-rose-200 font-bold uppercase block">Class Avg Readiness</span>
            <span className="text-base font-black text-white">{classAvgPct}%</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] text-rose-200 font-bold uppercase block">High-Risk Identified</span>
            <span className="text-base font-black text-rose-300">{atRiskCount} Students ({Math.round((atRiskCount/students.length)*100)}%)</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] text-rose-200 font-bold uppercase block">Primary Bottleneck</span>
            <span className="text-xs font-extrabold text-white">2321CSC302J (ADSA)</span>
          </div>
        </div>
      </div>

      {/* Priority Intervention Roster Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
        
        {/* Roster Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Priority Intervention Roster</h2>
            <p className="text-xs text-slate-500">8 Distinct Semester 3 Students (Nitheesh, Santhosh, Nidhish, Salih, Nadya, Meghan, Nitish, Prajwant)</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, roll no, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#701C34]"
              />
            </div>

            {/* STATUS FILTER TABS */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
              {['All Students', 'Flagged / At-Risk', 'Remedial Assigned', 'Performance Improved / Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                    filterStatus === st ? 'bg-[#701C34] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roster Table (8 DISTINCT STUDENTS HARDCODED, DYNAMIC MULTI-SUBJECT WEAKNESS SUPPORT) */}
        <div className="overflow-x-auto no-scrollbar border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Sem 3 Weak Course(s) & Sub-Topics</th>
                <th className="py-3 px-3">Readiness</th>
                <th className="py-3 px-3">Risk Status</th>
                <th className="py-3 px-3">Intervention Status</th>
                <th className="py-3 px-3 text-right">PDF & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => {
                const isNitheesh = stu.id === "NI_H" || stu.name === "Nitheesh";
                const sName = stu.name || stu.student_name;
                const sRoll = stu.rollNo || stu.student_code;
                
                // Dynamic multi-subject weak course calculation for Nitheesh when tied
                let sWeak = stu.weakSubject || stu.weak_subject;
                if (isNitheesh) {
                  const parsedMarks = getSafeLocalStorage('studentMarks', getSafeLocalStorage('learnsphere_subjects', null));
                  if (parsedMarks) {
                    sWeak = getWeakSubject(parsedMarks);
                  }
                }

                const sGaps = stu.subTopics || stu.concept_gaps || [];
                
                // Nitheesh's readiness score dynamically fetches via real-time event listener
                let rScoreStr = stu.readinessScore || `${stu.readiness_score}%`;
                let rRisk = stu.riskStatus || stu.risk_level;

                if (isNitheesh) {
                  if (nitheeshReadinessVal === null) {
                    rScoreStr = "Invalid Marks (>50)";
                    rRisk = "Fix Invalid Marks";
                  } else {
                    rScoreStr = `${nitheeshReadinessVal}%`;
                    rRisk = nitheeshReadinessVal >= 75 ? 'Low Risk' : nitheeshReadinessVal >= 60 ? 'Needs Review' : 'Needs Review';
                  }
                }

                const iStatus = stu.interventionStatus || stu.status;
                const sAvatar = stu.avatar || sName.substring(0, 2).toUpperCase();

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Student Info */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8.5 h-8.5 rounded-lg bg-rose-50 text-[#701C34] font-black flex items-center justify-center text-xs border border-rose-200 shrink-0 shadow-2xs">
                          {sAvatar}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 flex items-center gap-1">
                            <span>{sName}</span>
                            {isNitheesh && (
                              <span className="text-[9px] font-extrabold bg-rose-100 text-[#701C34] px-1 py-0.2 rounded border border-rose-200">
                                Live Event Sync
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">{sRoll}</p>
                        </div>
                      </div>
                    </td>

                    {/* Weak Subject(s) & Focus Practice Quiz Score */}
                    <td className="py-3.5 px-3 max-w-[280px]">
                      <p className="font-extrabold text-[#701C34] leading-snug">{sWeak}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5 items-center">
                        {sGaps.map((gap) => (
                          <span key={gap} className="text-[9px] font-extrabold bg-rose-50 text-[#701C34] px-1.5 py-0.5 rounded border border-rose-200">
                            {gap}
                          </span>
                        ))}
                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                          Focus Quiz: {isNitheesh ? '8/10 (80%)' : '7/10 (70%)'}
                        </span>
                      </div>
                    </td>

                    {/* Readiness Score Cell (Real-time synced for Nitheesh) */}
                    <td className="py-3.5 px-3">
                      <span className={`font-bold text-sm ${nitheeshReadinessVal === null && isNitheesh ? 'text-rose-600 text-xs' : 'text-slate-800'}`}>
                        {rScoreStr}
                      </span>
                    </td>

                    {/* Risk Level Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                        rRisk === 'High Risk' || rRisk === 'Fix Invalid Marks'
                          ? 'bg-rose-100 text-[#701C34] border-rose-200'
                          : rRisk === 'Needs Review' || rRisk === 'Moderate Risk'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {rRisk}
                      </span>
                    </td>

                    {/* Status Tag */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border inline-flex items-center space-x-1 ${
                        iStatus === 'Flagged'
                          ? 'bg-rose-100 text-[#701C34] border-rose-200'
                          : iStatus === 'Remedial Assigned'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        <span>{iStatus}</span>
                      </span>
                    </td>

                    {/* ACTION COLUMN: DIRECT PDF REPORT DOWNLOAD */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleDownloadStudentPDF(stu)}
                          className="px-3 py-1.5 bg-[#701C34] hover:bg-[#581427] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer active:scale-95"
                          title={`Download Printable PDF Report for ${sName}`}
                        >
                          <FileText className="w-3.5 h-3.5 text-white" />
                          <span>PDF Report</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
