import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle2, Search, Shield, Activity, FileText, BookOpen, Layers, X, ArrowRight, Zap, Check } from 'lucide-react';
import { teacherAPI } from '../services/api';
import { generateStudentPDFReport } from '../utils/pdfExport';

// 7 DISTINCT FACULTY ROSTER STUDENTS STRICTLY MAPPED TO OFFICIAL SEMESTER 3 COURSES
const DEFAULT_ROSTER = [
  {
    id: 1,
    student_name: 'Santhosh',
    student_code: 'CSE-2026-042',
    weak_subject: '2321CSC301T - Computer Networks (CN) (32/50)',
    weak_code: '2321CSC301T',
    subtopic_breakdown: 'CN -> OSI Routing Protocols & Subnetting Calculations',
    internal_score: 32.0,
    max_score: 50,
    percentage: 82.0,
    readiness_score: 82.0,
    risk_level: 'Low Risk',
    status: 'Flagged',
    avatar: 'SA',
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 45, max: 50 },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 32, max: 50 },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 41, max: 50 },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 44, max: 50 },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 42, max: 50 },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 39, max: 50 },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 44, max: 50 }
    ],
    recommendations: [
      "Targeted revision on Computer Networks OSI routing protocols.",
      "Maintain high accuracy across Discrete Math & AI/ML modules."
    ]
  },
  {
    id: 2,
    student_name: 'Nidhish',
    student_code: 'CSE-2026-089',
    weak_subject: '2321MAB301T - DM (22/50), 2321CSS301J - ESD (24/50)',
    weak_code: '2321MAB301T',
    subtopic_breakdown: 'DM -> Set Theory Logic; ESD -> GPIO Microcontroller Timers',
    internal_score: 22.0,
    max_score: 50,
    percentage: 58.0,
    readiness_score: 58.0,
    risk_level: 'Moderate Risk',
    status: 'Remedial Assigned',
    avatar: 'NI',
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 22, max: 50 },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 34, max: 50 },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 31, max: 50 },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 35, max: 50 },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 24, max: 50 },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 28, max: 50 },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 29, max: 50 }
    ],
    recommendations: [
      "Practice set theory and graph logic in Discrete Mathematics.",
      "Complete hands-on GPIO microcontrollers laboratory practice in ESD."
    ]
  },
  {
    id: 3,
    student_name: 'Salih',
    student_code: 'CSE-2026-112',
    weak_subject: '2321CSC302J - ADSA (18/50), CN (20/50), DM (19/50)',
    weak_code: '2321CSC302J',
    subtopic_breakdown: 'ADSA -> DP Memoization & Red-Black Trees; CN -> TCP 3-Way Handshake',
    internal_score: 18.0,
    max_score: 50,
    percentage: 44.0,
    readiness_score: 44.0,
    risk_level: 'High Risk',
    status: 'Flagged',
    avatar: 'SL',
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 19, max: 50 },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 20, max: 50 },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 18, max: 50 },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 25, max: 50 },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 24, max: 50 },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 22, max: 50 },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 26, max: 50 }
    ],
    recommendations: [
      "Urgent 1-on-1 tutoring required for ADSA Red-Black trees & DP.",
      "Review TCP 3-way handshake and network subnetting fundamentals."
    ]
  },
  {
    id: 4,
    student_name: 'Nadya',
    student_code: 'CSE-2026-145',
    weak_subject: '2321CSS301J - Embedded System Design (ESD) (38/50)',
    weak_code: '2321CSS301J',
    subtopic_breakdown: 'ESD -> RTOS Task Pacing & Latency Vectors',
    internal_score: 38.0,
    max_score: 50,
    percentage: 91.0,
    readiness_score: 91.0,
    risk_level: 'Dean Honor / Low Risk',
    status: 'Performance Improved',
    avatar: 'NA',
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 48, max: 50 },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 46, max: 50 },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 45, max: 50 },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 47, max: 50 },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 38, max: 50 },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 46, max: 50 },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 48, max: 50 }
    ],
    recommendations: [
      "Maintain excellence across all Semester 3 modules.",
      "Refine RTOS latency concepts for Embedded System Design."
    ]
  },
  {
    id: 5,
    student_name: 'Meghan',
    student_code: 'CSE-2026-018',
    weak_subject: '2321CSC303J - FAIML (26/50), ADSA (28/50)',
    weak_code: '2321CSC303J',
    subtopic_breakdown: 'FAIML -> Supervised Loss Functions; ADSA -> Dijkstra Shortest Path',
    internal_score: 26.0,
    max_score: 50,
    percentage: 68.0,
    readiness_score: 68.0,
    risk_level: 'Moderate Risk',
    status: 'Remedial Assigned',
    avatar: 'ME',
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 39, max: 50 },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 38, max: 50 },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 28, max: 50 },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 26, max: 50 },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 34, max: 50 },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 36, max: 50 },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 37, max: 50 }
    ],
    recommendations: [
      "Focus on Supervised Machine Learning algorithms & Loss functions.",
      "Solve LeetCode Medium problem set on Dijkstra's Algorithm."
    ]
  },
  {
    id: 6,
    student_name: 'Nitish',
    student_code: 'CSE-2026-056',
    weak_subject: '2321CSC304R - OOP Java (21/50), DM (23/50)',
    weak_code: '2321CSC304R',
    subtopic_breakdown: 'OOPJ -> Polymorphism & Stack Memory; DM -> Recurrence Relations',
    internal_score: 21.0,
    max_score: 50,
    percentage: 52.0,
    readiness_score: 52.0,
    risk_level: 'High Risk',
    status: 'Flagged',
    avatar: 'NT',
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 23, max: 50 },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 30, max: 50 },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 27, max: 50 },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 29, max: 50 },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 28, max: 50 },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 21, max: 50 },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 25, max: 50 }
    ],
    recommendations: [
      "Practice Java OOP inheritance, polymorphism, and memory stack/heap.",
      "Review discrete mathematical logic & recurrence relations."
    ]
  },
  {
    id: 7,
    student_name: 'Prajwant',
    student_code: 'CSE-2026-074',
    weak_subject: '2321SDA301L - CSD III (31/50)',
    weak_code: '2321SDA301L',
    subtopic_breakdown: 'CSD III -> Quantitative Aptitude & Speed Conversions',
    internal_score: 31.0,
    max_score: 50,
    percentage: 76.0,
    readiness_score: 76.0,
    risk_level: 'Low Risk',
    status: 'Flagged',
    avatar: 'PR',
    subjects: [
      { code: '2321MAB301T', name: 'Discrete Mathematics (DM)', score: 40, max: 50 },
      { code: '2321CSC301T', name: 'Computer Networks (CN)', score: 39, max: 50 },
      { code: '2321CSC302J', name: 'Advanced Data Structures & Algorithms (ADSA)', score: 38, max: 50 },
      { code: '2321CSC303J', name: 'Fundamentals of AI & ML (FAIML)', score: 41, max: 50 },
      { code: '2321CSS301J', name: 'Embedded System Design (ESD)', score: 38, max: 50 },
      { code: '2321CSC304R', name: 'Object Oriented Programming using Java (OOPJ)', score: 39, max: 50 },
      { code: '2321SDA301L', name: 'Career Skill Development III (CSD)', score: 31, max: 50 }
    ],
    recommendations: [
      "Practice quantitative speed conversions and logical aptitude problem sets.",
      "Maintain high baseline scores across core CSE courses."
    ]
  }
];

export default function FacultyAnalytics({ addToast }) {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('learnsphere_roster');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) return parsed;
      } catch (e) {
        console.warn('Error parsing saved roster:', e);
      }
    }
    return DEFAULT_ROSTER;
  });

  useEffect(() => {
    localStorage.setItem('learnsphere_roster', JSON.stringify(students));
  }, [students]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Students');
  
  // MODAL & PANEL STATES FOR THE TWO NEW FACULTY ACTIONS
  const [remedialModalStudent, setRemedialModalStudent] = useState(null);
  const [weaknessPanelStudent, setWeaknessPanelStudent] = useState(null);
  const [selectedRemedialModule, setSelectedRemedialModule] = useState('recovery_module');

  useEffect(() => {
    const saved = localStorage.getItem('learnsphere_roster');
    if (!saved) {
      teacherAPI.getDashboard().then((res) => {
        if (res && res.roster) {
          setStudents(res.roster);
        }
      }).catch(() => null);
    }
  }, []);

  // ACTION 1: ASSIGN REMEDIAL MODULE HANDLER
  const handleAssignRemedialSubmit = () => {
    if (!remedialModalStudent) return;

    const updated = students.map((s) => {
      if (s.id === remedialModalStudent.id) {
        return {
          ...s,
          status: 'Remedial Assigned'
        };
      }
      return s;
    });

    setStudents(updated);

    if (addToast) {
      addToast(
        'Remedial Modules Assigned',
        `Targeted remedial modules assigned to ${remedialModalStudent.student_name} for ${remedialModalStudent.weak_code || 'Semester 3'}.`,
        'success'
      );
    }

    setRemedialModalStudent(null);
  };

  // FACULTY INDIVIDUAL STUDENT PDF REPORT DOWNLOAD HANDLER
  const handleDownloadStudentPDF = (stu) => {
    generateStudentPDFReport({
      name: stu.student_name,
      studentCode: stu.student_code,
      institution: "Easwari Engineering College",
      department: "Department of Computer Science & Engineering",
      semester: "Semester 3 (CSE)",
      readinessScore: Number(stu.readiness_score) || 0,
      riskLevel: stu.risk_level,
      subjects: stu.subjects,
      recommendations: stu.recommendations || [
        `Targeted intervention for weak subject: ${stu.weak_subject}`,
        "Complete 6-Week Adaptive Recovery Roadmap drills in Focus Mode."
      ]
    });

    if (addToast) {
      addToast('PDF Generated', `Official Semester 3 PDF Report generated for ${stu.student_name}.`, 'success');
    }
  };

  // FILTERING LOGIC
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.student_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.weak_subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'Flagged / At-Risk') {
      matchesFilter = s.status === 'Flagged';
    } else if (filterStatus === 'Remedial Assigned') {
      matchesFilter = s.status === 'Remedial Assigned';
    } else if (filterStatus === 'Performance Improved') {
      matchesFilter = s.status === 'Performance Improved' || s.status === 'Resolved';
    }

    return matchesSearch && matchesFilter;
  });

  const totalEnrolled = 128;
  const atRiskCount = students.filter((s) => s.status === 'Flagged').length;
  const remedialAssignedCount = students.filter((s) => s.status === 'Remedial Assigned').length;
  const resolvedCount = students.filter((s) => s.status === 'Performance Improved' || s.status === 'Resolved').length;

  // SAFE CLASS AVERAGE READINESS CALCULATION (PREVENT NaN%)
  const validReadinesses = students.map(s => Number(s.readiness_score) || Number(s.percentage) || 0);
  const classAvgPct = students.length > 0 
    ? (validReadinesses.reduce((acc, val) => acc + val, 0) / students.length).toFixed(1) 
    : '67.3';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A1021] via-[#701C34] to-[#581427] p-5 sm:p-6 rounded-2xl border border-[#581427] text-white shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-rose-300" />
            <span>Easwari Engineering College • Semester 3</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Faculty Academic Intervention & Remedial Center
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Monitor 7 official Semester 3 courses, assign targeted recovery modules & LeetCode drills, inspect sub-topic weaknesses, and export individual student PDF performance reports.
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
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remedial Active / Improved</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{remedialAssignedCount + resolvedCount}</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">{remedialAssignedCount} Assigned • {resolvedCount} Improved</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* HIGH-LEVEL PROBLEM STATEMENT ANALYTICS SUMMARY BANNER (SAFE CLASS AVG READINESS) */}
      <div className="bg-gradient-to-r from-rose-950 via-[#701C34] to-[#581427] text-white rounded-2xl p-5 shadow-lg border border-rose-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Activity className="w-6 h-6 text-rose-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                Problem Statement Analytics
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
        
        {/* Roster Controls & ACTIONABLE FILTER TABS */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Priority Intervention Roster</h2>
            <p className="text-xs text-slate-500">7 Distinct Semester 3 Students (Santhosh, Nidhish, Salih, Nadya, Meghan, Nitish, Prajwant)</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student, code, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#701C34]"
              />
            </div>

            {/* NEW ACTIONABLE STATUS FILTER TABS */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
              {['All Students', 'Flagged / At-Risk', 'Remedial Assigned', 'Performance Improved'].map((st) => (
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

        {/* Roster Table */}
        <div className="overflow-x-auto no-scrollbar border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Sem 3 Weak Course</th>
                <th className="py-3 px-3">Readiness</th>
                <th className="py-3 px-3">Risk Status</th>
                <th className="py-3 px-3">Intervention Status</th>
                <th className="py-3 px-3 text-right">Faculty Actions & PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Student Info */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8.5 h-8.5 rounded-lg bg-rose-50 text-[#701C34] font-black flex items-center justify-center text-xs border border-rose-200 shrink-0 shadow-2xs">
                        {stu.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{stu.student_name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{stu.student_code}</p>
                      </div>
                    </div>
                  </td>

                  {/* Weak Subject (Strict 7 Sem 3 Courses) */}
                  <td className="py-3.5 px-3 font-bold text-slate-800 max-w-[210px]">
                    <span className="line-clamp-2 leading-snug">{stu.weak_subject}</span>
                  </td>

                  {/* Readiness Score */}
                  <td className="py-3.5 px-3">
                    <span className="font-black text-[#701C34] text-sm">{stu.readiness_score}%</span>
                  </td>

                  {/* Risk Level Badge */}
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                      stu.readiness_score < 60
                        ? 'bg-rose-100 text-[#701C34] border-rose-200'
                        : stu.readiness_score < 75
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {stu.risk_level}
                    </span>
                  </td>

                  {/* Status Tag */}
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border inline-flex items-center space-x-1 ${
                      stu.status === 'Flagged'
                        ? 'bg-rose-100 text-[#701C34] border-rose-200'
                        : stu.status === 'Remedial Assigned'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      <span>{stu.status}</span>
                    </span>
                  </td>

                  {/* TWO NEW HIGHLY FUNCTIONAL FACULTY ACTIONS + PDF BUTTON */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      
                      {/* ACTION 1: ASSIGN REMEDIAL BUTTON */}
                      <button
                        onClick={() => setRemedialModalStudent(stu)}
                        className="px-3 py-1.5 bg-[#701C34] hover:bg-[#581427] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 active:scale-95"
                        title={`Assign 6-Week Recovery Modules or LeetCode set for ${stu.student_name}`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Assign Remedial</span>
                      </button>

                      {/* ACTION 2: VIEW WEAKNESS BREAKDOWN BUTTON */}
                      <button
                        onClick={() => setWeaknessPanelStudent(stu)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 active:scale-95"
                        title={`View sub-topic weakness analysis for ${stu.student_name}`}
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-600" />
                        <span>Weakness</span>
                      </button>

                      {/* PDF REPORT BUTTON */}
                      <button
                        onClick={() => handleDownloadStudentPDF(stu)}
                        className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#701C34] border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 active:scale-95"
                        title={`Download Printable PDF Report for ${stu.student_name}`}
                      >
                        <FileText className="w-3.5 h-3.5 text-[#701C34]" />
                        <span>PDF</span>
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ASSIGN REMEDIAL MODULES MODAL */}
      {/* ========================================================================= */}
      {remedialModalStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setRemedialModalStudent(null)}
          />

          <div className="relative bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl z-10 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-[#701C34] font-black flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-[#701C34]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Assign Academic Remedial Plan</h3>
                  <p className="text-xs text-slate-500">Student: {remedialModalStudent.student_name} ({remedialModalStudent.student_code})</p>
                </div>
              </div>
              <button
                onClick={() => setRemedialModalStudent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Info */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <span className="text-[10px] font-black uppercase text-[#701C34] tracking-wider">Identified Weak Course</span>
                <p className="font-extrabold text-slate-900">{remedialModalStudent.weak_subject}</p>
                <p className="text-[11px] text-slate-600 font-medium mt-1">{remedialModalStudent.subtopic_breakdown}</p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 block uppercase tracking-wider text-[10px]">
                  Select Remedial Intervention Package:
                </label>
                
                <div className="space-y-2.5">
                  <label
                    onClick={() => setSelectedRemedialModule('recovery_module')}
                    className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedRemedialModule === 'recovery_module'
                        ? 'bg-rose-50/60 border-[#701C34] ring-2 ring-rose-200'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="remedial_pkg"
                      checked={selectedRemedialModule === 'recovery_module'}
                      onChange={() => setSelectedRemedialModule('recovery_module')}
                      className="mt-0.5 text-[#701C34] focus:ring-[#701C34]"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">6-Week Adaptive Recovery Roadmap Module</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Assigns targeted diagnostic drills & sequential study milestones directly to student's dashboard.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setSelectedRemedialModule('leetcode_set')}
                    className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedRemedialModule === 'leetcode_set'
                        ? 'bg-rose-50/60 border-[#701C34] ring-2 ring-rose-200'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="remedial_pkg"
                      checked={selectedRemedialModule === 'leetcode_set'}
                      onChange={() => setSelectedRemedialModule('leetcode_set')}
                      className="mt-0.5 text-[#701C34] focus:ring-[#701C34]"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">LeetCode Rotation Practice Set</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Recommends 2-3 LeetCode foundational/medium algorithm challenges in Focus Mode.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                onClick={() => setRemedialModalStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignRemedialSubmit}
                className="px-5 py-2 bg-[#701C34] hover:bg-[#581427] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Assign to Student Dashboard</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SLIDE-OVER PANEL 2: VIEW SUB-TOPIC WEAKNESS BREAKDOWN */}
      {/* ========================================================================= */}
      {weaknessPanelStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setWeaknessPanelStudent(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
              
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-[#4A1021] via-[#701C34] to-[#581427] text-white flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#701C34] font-black text-sm flex items-center justify-center shadow-md">
                    {weaknessPanelStudent.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{weaknessPanelStudent.student_name}</h3>
                    <p className="text-xs text-rose-200 font-medium">{weaknessPanelStudent.student_code} • Sem 3</p>
                  </div>
                </div>
                <button
                  onClick={() => setWeaknessPanelStudent(null)}
                  className="p-2 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                
                {/* Readiness Score Badge */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Readiness Score</span>
                    <span className="text-2xl font-black text-[#701C34]">{weaknessPanelStudent.readiness_score}%</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                    weaknessPanelStudent.readiness_score < 60
                      ? 'bg-rose-100 text-[#701C34] border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {weaknessPanelStudent.risk_level}
                  </span>
                </div>

                {/* Sub-Topic Weakness Breakdown Box */}
                <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase text-[#701C34] flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-[#701C34]" />
                    <span>Sub-Topic Weakness Analysis</span>
                  </h4>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-slate-900 leading-relaxed">
                    {weaknessPanelStudent.subtopic_breakdown}
                  </div>
                </div>

                {/* 7 Semester 3 Course Test Scores Out of 50 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    7 Semester 3 Test Scores (/50)
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    {weaknessPanelStudent.subjects.map((sub) => (
                      <div key={sub.code} className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <div>
                          <span className="font-extrabold text-[#701C34]">{sub.code}: </span>
                          <span className="font-bold text-slate-800">{sub.name}</span>
                        </div>
                        <span className="font-black text-slate-900 shrink-0 ml-2">{sub.score} / 50</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3">
                <button
                  onClick={() => {
                    const stu = weaknessPanelStudent;
                    setWeaknessPanelStudent(null);
                    setRemedialModalStudent(stu);
                  }}
                  className="flex-1 py-2.5 bg-[#701C34] hover:bg-[#581427] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Assign Remedial</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
