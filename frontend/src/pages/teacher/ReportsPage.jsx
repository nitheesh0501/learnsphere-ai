import React, { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';
import { GlassCard } from '../../components/StatCard';
import { FileText, Download, Printer, CheckCircle2 } from 'lucide-react';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherAPI.getReports()
      .then(res => {
        setReports(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

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
            <FileText className="w-7 h-7 text-purple-400" /> Export Department Performance Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Formal Academic Report summarizing IA-1 marks, readiness scores, and AI risk predictions.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-purple-600/30"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF Report
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">ISTE Hackathon 2026 • Official IA Report</h3>
            <p className="text-xs text-slate-400">Class: 6th Semester Computer Science & Engineering</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Validated by LearnSphere ML Model
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">USN</th>
                <th className="p-3.5">Sem Readiness</th>
                <th className="p-3.5">Predicted GPA</th>
                <th className="p-3.5">Risk Status</th>
                <th className="p-3.5">Weak Subjects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reports.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-bold text-white">{r.name}</td>
                  <td className="p-3.5 text-slate-300 font-mono text-xs">{r.usn}</td>
                  <td className="p-3.5 font-extrabold text-purple-400">{r.readiness_score}%</td>
                  <td className="p-3.5 text-slate-200 font-bold">{r.predicted_gpa}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      r.risk_level === 'Low' ? 'text-emerald-400 bg-emerald-500/10' :
                      r.risk_level === 'Moderate' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {r.risk_level}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-slate-300">
                    {r.weak_subjects?.length ? r.weak_subjects.join(', ') : 'None (All Clear)'}
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
