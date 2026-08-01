import React, { useState, useEffect, useRef } from 'react';
import { studentAPI } from '../../services/api';
import { GlassCard } from '../../components/StatCard';
import { MessageSquare, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';

export const StudentChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = () => {
    studentAPI.getChat()
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText;
    setInputText('');
    setLoading(true);

    try {
      await studentAPI.sendChat({
        message: userText,
        ask_ai: true
      });
      fetchMessages();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-brand-400" /> AI & Teacher Doubt Solver
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Ask questions to Gemini AI 24/7 or message your professor for IA intervention guidance.
        </p>
      </div>

      <GlassCard className="flex flex-col h-[550px] p-0 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Gemini AI Academic Assistant <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              </h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online • Instant Doubt Solver
              </p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.is_ai ? 'justify-start' : 'justify-end'}`}
            >
              {m.is_ai && (
                <div className="w-8 h-8 rounded-xl bg-brand-600/30 text-brand-400 flex items-center justify-center border border-brand-500/30 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed ${
                m.is_ai
                  ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  : 'bg-brand-600 text-white rounded-tr-none font-medium shadow-md shadow-brand-600/20'
              }`}>
                <div className="text-[10px] font-bold opacity-75 mb-1">{m.sender_name}</div>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>

              {!m.is_ai && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-brand-400 bg-slate-900/80 p-3 rounded-xl max-w-xs border border-slate-800">
              <RefreshCw className="w-4 h-4 animate-spin" /> Gemini AI is formulating your step-by-step solution...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Gemini AI or Professor a question about your IA topics..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </GlassCard>
    </div>
  );
};
