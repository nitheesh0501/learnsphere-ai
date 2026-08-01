import React, { useEffect, useState } from 'react';
import { teacherAPI } from '../../services/api';
import { GlassCard } from '../../components/StatCard';
import { MessageSquare, Send, User, CheckCircle2 } from 'lucide-react';

export const TeacherMessages = () => {
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    teacherAPI.getMessages().then(res => setMessages(res.data)).catch(err => console.error(err));
    teacherAPI.getStudents().then(res => setStudents(res.data)).catch(err => console.error(err));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedStudentId) return;

    try {
      const selectedStudent = students.find(s => s.id === parseInt(selectedStudentId));
      const res = await teacherAPI.sendMessage({
        receiver_id: selectedStudent?.user_id,
        content: inputText
      });
      setMessages([res.data, ...messages]);
      setInputText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-purple-400" /> Student Broadcast & Messaging System
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Send direct messages, IA interventions, and motivational advice to student portals.
        </p>
      </div>

      <GlassCard className="space-y-6">
        <form onSubmit={handleSend} className="space-y-4 border-b border-slate-800 pb-6">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1.5">Select Recipient Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.usn}) - {s.risk_level} Risk
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1.5">Message Body</label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to send directly to student notification feed..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || !selectedStudentId}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>

        {/* Message Log */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Message Log</h3>
          {messages.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-start justify-between gap-3">
              <div>
                <span className="font-bold text-purple-400">{m.sender_name}</span>
                <p className="text-slate-200 mt-1 leading-relaxed">{m.content}</p>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">
                {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
