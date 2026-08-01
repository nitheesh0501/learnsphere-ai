import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle2, Send, Search, Shield, Activity, FileText, Download } from 'lucide-react';
import { teacherAPI } from '../services/api';
import { generateStudentPDFReport } from '../utils/pdfExport';

// 7 DISTINCT FACULTY ROSTER STUDENTS WITH UNIQUE MARKS, READINESS SCORES & SUBJECT WEAKNESSES
const DEFAULT_ROSTER = [
  {
    id: 1,
    student_name: 'Santhosh',
    student_code: 'CSE-2026-042',
    weak_subject: '2321CSC301T - Computer Networks (CN) (32/50)',
    internal_score: 32.0,
    max_score: 50,
    percentage: 82.0,
    readiness_score: 82.0,
    risk_level: 'Low Risk',
    status: 'Flagged',
    last_action: 'Requires Nudge',
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
    internal_score: 22.0,
    max_score: 50,
    percentage: 58.0,
    readiness_score: 58.0,
    risk_level: 'Moderate Risk',
    status: 'Nudge Sent',
    last_action: 'Nudge sent yesterday',
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
    internal_score: 18.0,
    max_score: 50,
    percentage: 44.0,
    readiness_score: 44.0,
    risk_level: 'High Risk',
    status: 'Flagged',
    last_action: 'Action Required',
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
    internal_score: 38.0,
    max_score: 50,
    percentage: 91.0,
    readiness_score: 91.0,
    risk_level: 'Dean Honor / Low Risk',
    status: 'Resolved',
    last_action: 'High Performance',
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
    internal_score: 26.0,
    max_score: 50,
    percentage: 68.0,
    readiness_score: 68.0,
    risk_level: 'Moderate Risk',
    status: 'Resolved',
    last_action: 'Completed Wk 1 Quiz',
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
    internal_score: 21.0,
    max_score: 50,
    percentage: 52.0,
    readiness_score: 52.0,
    risk_level: 'High Risk',
    status: 'Flagged',
    last_action: 'Pending Quiz Review',
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
    internal_score: 31.0,
    max_score: 50,
    percentage: 76.0,
    readiness_score: 76.0,
    risk_level: 'Low Risk',
    status: 'Flagged',
    last_action: 'Scheduled Mentoring',
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
  const [filterStatus, setFilterStatus] = useState('All');
  const [loadingId, setLoadingId] = useState(null);

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

  const handleIntervention = async (studentId, action) => {
    setLoadingId(studentId);
    await teacherAPI.interveneStudent(studentId, action).catch(() => null);

    const studentObj = students.find((s) => s.id === studentId);
    const studentName = studentObj ? studentObj.student_name : 'Student';

    const updated = students.map((s) => {
      if (s.id === studentId) {
        if (action === 'nudge') {
          return { ...s, status: 'Nudge Sent', last_action: 'Nudge notification sent' };
        } else if (action === 'resolve') {
          return { ...s, status: 'Resolved', last_action: 'Intervention resolved' };
        }
      }
      return s;
    });

    setStudents(updated);
    setLoadingId(null);

    if (addToast) {
      if (action === 'nudge') {
        addToast('Nudge Notification Sent', `Academic nudge successfully sent to ${studentName}.`, 'success');
      } else if (action === 'resolve') {
        addToast('Intervention Resolved', `Academic intervention status for ${studentName} updated to Resolved.`, 'success');
      }
    }
  };

  // FEATURE 5: FACULTY INDIVIDUAL STUDENT PDF REPORT DOWNLOAD HANDLER
  const handleDownloadStudentPDF = (stu) => {
    generateStudentPDFReport({
      name: stu.student_name,
      studentCode: stu.student_code,
      institution: "Easwari Engineering College",
      department: "Department of Computer Science & Engineering",
      semester: "Semester 3 (CSE)",
      readinessScore: stu.readiness_score,
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

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.student_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.weak_subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalEnrolled = 128;
  const atRiskCount = students.filter((s) => s.status !== 'Resolved').length;
  const resolvedCount = students.filter((s) => s.status === 'Resolved').length;

  // Calculate class average readiness percentage across the 7 roster students
  const classAvgPct = (students.reduce((acc, s) => acc + s.readiness_score, 0) / students.length).toFixed(1);

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
            Faculty Academic Intervention & PDF Export Center
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Monitor students flagged for low Internal Assessment (IA) test scores out of 50 in Semester 3 courses, send targeted nudges, and export individual student PDF performance reports.
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
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">At-Risk Student Count</p>
            <p className="text-3xl font-black text-[#701C34] mt-1">{atRiskCount}</p>
            <p className="text-[11px] text-[#701C34] font-bold mt-1">Requires Early Intervention</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#701C34] shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Resolved Interventions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Interventions</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{resolvedCount}</p>
            <p className="text-[11px] text-emerald-700 font-bold mt-1">Improved Baseline Performance</p>
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
        
        {/* Roster Controls */}
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

            {/* Status Filter */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
              {['All', 'Flagged', 'Nudge Sent', 'Resolved'].map((st) => (
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
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Sem 3 Weak Course(s)</th>
                <th className="py-3 px-3">Readiness Score</th>
                <th className="py-3 px-3">Risk Status</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">PDF & Actions</th>
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

                  {/* Weak Subject */}
                  <td className="py-3.5 px-3 font-bold text-slate-800 max-w-[220px]">
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
                        : stu.status === 'Nudge Sent'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      <span>{stu.status}</span>
                    </span>
                  </td>

                  {/* Interactive Action Buttons & PDF Export */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      
                      {/* FEATURE 5: FACULTY INDIVIDUAL STUDENT PDF REPORT BUTTON */}
                      <button
                        onClick={() => handleDownloadStudentPDF(stu)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 active:scale-95"
                        title={`Download Printable PDF Report for ${stu.student_name}`}
                      >
                        <FileText className="w-3.5 h-3.5 text-[#701C34]" />
                        <span>PDF Report</span>
                      </button>

                      {stu.status !== 'Resolved' && (
                        <button
                          disabled={loadingId === stu.id}
                          onClick={() => handleIntervention(stu.id, 'nudge')}
                          className="px-3 py-1.5 bg-[#701C34] hover:bg-[#581427] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 active:scale-95"
                        >
                          <Send className="w-3 h-3" />
                          <span>Nudge</span>
                        </button>
                      )}

                      {stu.status !== 'Resolved' ? (
                        <button
                          disabled={loadingId === stu.id}
                          onClick={() => handleIntervention(stu.id, 'resolve')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 active:scale-95"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolve</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          Resolved
                        </span>
                      )}

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
