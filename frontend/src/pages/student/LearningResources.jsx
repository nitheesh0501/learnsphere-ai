import React from 'react';
import { GlassCard } from '../../components/StatCard';
import { BookOpen, ExternalLink, Video, FileText, Code, CheckCircle2 } from 'lucide-react';

export const LearningResources = () => {
  const resources = [
    {
      title: 'Data Structures & Algorithms Mastery',
      category: 'Data Structures',
      type: 'Video Lecture & Code Notes',
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      desc: 'Master Binary Search Trees, Dynamic Programming, and Graph Traversals to clear your IA-1 gap topics.'
    },
    {
      title: 'Computer Networks TCP/IP Protocol Deep Dive',
      category: 'Networks',
      type: 'Documentation & Diagrams',
      url: 'https://nptel.ac.in/courses/106105081',
      desc: 'Step-by-step visual guides on subnetting, CIDR, and TCP 3-way handshakes.'
    },
    {
      title: 'Operating Systems Semaphores & Memory Management',
      category: 'Operating Systems',
      type: 'Interactive Exercises',
      url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
      desc: 'Three Easy Pieces: Process synchronization, page replacement, and deadlock resolution.'
    },
    {
      title: 'Database Systems 3NF & BCNF Normalization Guide',
      category: 'DBMS',
      type: 'Cheat Sheet & Problem Sets',
      url: 'https://db-book.com/',
      desc: 'Complete guide for solving database schema normalization questions in unit tests.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-brand-400" /> Curated Learning Resources
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Hand-picked materials, NPTEL/MIT lectures, and formula cheat sheets mapped to your weak subjects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((item, idx) => (
          <GlassCard key={idx} className="space-y-4 glass-card-hover border-slate-800">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                {item.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> {item.type}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 hover:text-brand-300 hover:underline pt-2"
            >
              Access Resource Material <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
