import React, { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';
import { GlassCard } from '../../components/StatCard';
import { Users, Search, Filter, ArrowRight, Eye, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    teacherAPI.getStudents()
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.usn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || s.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-400" /> Student Performance Directory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse student IA records, machine learning risk classifications, and readiness scores.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name or USN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-semibold">Filter Risk:</span>
          {['ALL', 'High', 'Moderate', 'Low'].map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                riskFilter === r
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Students Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">USN</th>
                <th className="p-4">Department</th>
                <th className="p-4">Readiness Score</th>
                <th className="p-4">Predicted GPA</th>
                <th className="p-4">Risk Level</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`}
                      alt={s.name}
                      className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
                    />
                    <span>{s.name}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-mono text-xs">{s.usn}</td>
                  <td className="p-4 text-slate-400 text-xs">{s.department}</td>
                  <td className="p-4 font-extrabold text-purple-400">{s.readiness_score}%</td>
                  <td className="p-4 text-slate-200 font-bold">{s.predicted_gpa} / 10</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      s.risk_level === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      s.risk_level === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {s.risk_level} Risk
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => navigate(`/teacher/student/${s.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
