import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle2, Send, Search, Shield } from 'lucide-react';
import { teacherAPI } from '../services/api';

const DEFAULT_ROSTER = [
  {
    id: 1,
    student_name: 'Santhosh',
    student_code: 'CSE-2026-042',
    weak_subject: 'Programming in C++',
    internal_score: 19.5,
    max_score: 50,
    percentage: 39.0,
    risk_level: 'Weak',
    status: 'Flagged',
    last_action: 'Requires Intervention',
    avatar: 'SA'
  },
  {
    id: 2,
    student_name: 'Nidhish',
    student_code: 'CSE-2026-089',
    weak_subject: 'Physics II',
    internal_score: 24.0,
    max_score: 50,
    percentage: 48.0,
    risk_level: 'Weak',
    status: 'Nudge Sent',
    last_action: 'Nudge sent yesterday',
    avatar: 'NI'
  },
  {
    id: 3,
    student_name: 'Salih',
    student_code: 'CSE-2026-112',
    weak_subject: 'Mathematics III',
    internal_score: 32.5,
    max_score: 50,
    percentage: 65.0,
    risk_level: 'Medium',
    status: 'Nudge Sent',
    last_action: 'Revision plan assigned',
    avatar: 'SL'
  },
  {
    id: 4,
    student_name: 'Nadya',
    student_code: 'CSE-2026-145',
    weak_subject: 'Programming in C++',
    internal_score: 18.0,
    max_score: 50,
    percentage: 36.0,
    risk_level: 'Weak',
    status: 'Flagged',
    last_action: 'Action Required',
    avatar: 'NA'
  },
  {
    id: 5,
    student_name: 'Meghan',
    student_code: 'CSE-2026-018',
    weak_subject: 'Data Structures',
    internal_score: 22.5,
    max_score: 50,
    percentage: 45.0,
    risk_level: 'Weak',
    status: 'Resolved',
    last_action: 'Completed Wk 1 Quiz',
    avatar: 'ME'
  },
  {
    id: 6,
    student_name: 'Nitish',
    student_code: 'CSE-2026-056',
    weak_subject: 'Physics II',
    internal_score: 33.0,
    max_score: 50,
    percentage: 66.0,
    risk_level: 'Medium',
    status: 'Flagged',
    last_action: 'Pending Quiz Review',
    avatar: 'NT'
  },
  {
    id: 7,
    student_name: 'Prajwant',
    student_code: 'CSE-2026-074',
    weak_subject: 'Mathematics III',
    internal_score: 21.0,
    max_score: 50,
    percentage: 42.0,
    risk_level: 'Weak',
    status: 'Flagged',
    last_action: 'Scheduled Mentoring',
    avatar: 'PR'
  }
];

export default function FacultyAnalytics({ addToast }) {
  // Initialize students state from localStorage or default roster
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('learnsphere_roster');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Error parsing saved roster:', e);
      }
    }
    return DEFAULT_ROSTER;
  });

  // Auto-save roster changes to localStorage
  useEffect(() => {
    localStorage.setItem('learnsphere_roster', JSON.stringify(students));
  }, [students]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    // Only fetch remote dashboard if localStorage hasn't stored customized interventions
    const saved = localStorage.getItem('learnsphere_roster');
    if (!saved) {
      teacherAPI.getDashboard().then((res) => {
        if (res && res.roster) {
          setStudents(res.roster);
        }
      });
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

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.student_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalEnrolled = 128;
  const atRiskCount = students.filter((s) => s.status !== 'Resolved').length;
  const resolvedCount = students.filter((s) => s.status === 'Resolved').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-red-950 p-5 sm:p-6 rounded-2xl border border-red-900/60 text-white shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Faculty Intervention Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Early Academic Intervention Dashboard
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Monitor students flagged for low Internal Assessment (IA) test scores out of 50, send targeted nudges, and track intervention resolutions.
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
            <p className="text-[11px] text-slate-500 mt-1">Computer Science Dept • Sem 4</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: At-Risk Students */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">At-Risk Student Count</p>
            <p className="text-3xl font-black text-red-600 mt-1">{atRiskCount}</p>
            <p className="text-[11px] text-red-600 font-bold mt-1">Requires Early Intervention</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-red-600 shrink-0">
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

      {/* Priority Intervention Roster Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6">
        
        {/* Roster Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">Priority Intervention Roster</h2>
            <p className="text-xs text-slate-500">Students flagged based on Mid-Semester IA test scores out of 50</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
              {['All', 'Flagged', 'Nudge Sent', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                    filterStatus === st ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Weak Subject</th>
                <th className="py-3 px-3">IA Score (/50)</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Intervention Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Student Info */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-red-700 font-bold flex items-center justify-center text-xs border border-rose-200 shrink-0">
                        {stu.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{stu.student_name}</p>
                        <p className="text-[10px] text-slate-500">{stu.student_code}</p>
                      </div>
                    </div>
                  </td>

                  {/* Weak Subject */}
                  <td className="py-3.5 px-3 font-bold text-slate-800">
                    {stu.weak_subject}
                  </td>

                  {/* IA Score */}
                  <td className="py-3.5 px-3">
                    <span className="font-black text-slate-900">{stu.internal_score}</span>
                    <span className="text-slate-400 font-semibold"> / 50</span>
                    <span className="text-[10px] text-slate-500 block font-semibold">{stu.percentage}%</span>
                  </td>

                  {/* Risk Level Badge */}
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black border ${
                      stu.risk_level === 'Weak'
                        ? 'bg-rose-100 text-red-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {stu.risk_level}
                    </span>
                  </td>

                  {/* Status Tag */}
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border inline-flex items-center space-x-1 ${
                      stu.status === 'Flagged'
                        ? 'bg-rose-100 text-red-800 border-rose-200'
                        : stu.status === 'Nudge Sent'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      <span>{stu.status}</span>
                    </span>
                  </td>

                  {/* Interactive Action Buttons */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {stu.status !== 'Resolved' && (
                        <button
                          disabled={loadingId === stu.id}
                          onClick={() => handleIntervention(stu.id, 'nudge')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1 active:scale-95"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Nudge</span>
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
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
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
