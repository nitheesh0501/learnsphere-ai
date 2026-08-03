import React from 'react';
import { Play, Clock, BookOpen } from 'lucide-react';

export const RECOMMENDED_VIDEOS = [
  // --- SUBJECT 1: DATA STRUCTURES & ALGORITHMS ---
  {
    id: "1",
    title: "Introduction to Data Structures & Algorithms for Beginners",
    subjectCode: "2321CSC301 • DSA",
    categoryTag: "Basics & Arrays",
    focusText: "Focus: Memory allocation, Arrays, Stacks & Queues",
    source: "Gate Smashers",
    duration: "18 mins",
    thumbnail: "https://images.unsplash.com/photo-1516116211223-4c7141326c6c?w=800&auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=aAInI-U4sX0"
  },
  {
    id: "2",
    title: "Binary Tree Traversal Techniques (Inorder, Preorder, Postorder)",
    subjectCode: "2321CSC301 • DSA",
    categoryTag: "Trees & Graphs",
    focusText: "Focus: Tree nodes, DFS & BFS Traversal basics",
    source: "Abdul Bari",
    duration: "24 mins",
    thumbnail: "https://img.youtube.com/vi/gm8DUJJhmY4/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=gm8DUJJhmY4"
  },

  // --- SUBJECT 2: OPERATING SYSTEMS ---
  {
    id: "3",
    title: "Introduction to Operating System & Its Core Functions",
    subjectCode: "2321CSC302 • OS",
    categoryTag: "Kernel Basics",
    focusText: "Focus: System calls, Process Management & Kernel Modes",
    source: "Gate Smashers",
    duration: "19 mins",
    thumbnail: "https://img.youtube.com/vi/WJ-UaAaumNA/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=WJ-UaAaumNA"
  },
  {
    id: "4",
    title: "CPU Scheduling Algorithms: FCFS, SJF & Round Robin",
    subjectCode: "2321CSC302 • OS",
    categoryTag: "Process Scheduling",
    focusText: "Focus: Gantt charts, Waiting time & Context switching",
    source: "Neso Academy",
    duration: "21 mins",
    thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=ew9_p5i8vYk"
  },

  // --- SUBJECT 3: DATABASE MANAGEMENT SYSTEMS ---
  {
    id: "5",
    title: "Introduction to DBMS & ER Diagrams Made Easy",
    subjectCode: "2321CSC303 • DBMS",
    categoryTag: "Database Basics",
    focusText: "Focus: Entities, Attributes, Keys & Relationships",
    source: "Gate Smashers",
    duration: "16 mins",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=c5HAwT4QU8w"
  },
  {
    id: "6",
    title: "SQL Tutorial for Beginners: SELECT, WHERE & JOINS",
    subjectCode: "2321CSC303 • DBMS",
    categoryTag: "SQL Queries",
    focusText: "Focus: Basic SQL queries, INNER JOIN & Filter clauses",
    source: "freeCodeCamp",
    duration: "35 mins",
    thumbnail: "https://img.youtube.com/vi/HXV3zeQKqGY/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY"
  },

  // --- SUBJECT 4: COMPUTER NETWORKS ---
  {
    id: "7",
    title: "OSI 7 Layer Model Explained with Real Life Examples",
    subjectCode: "2321CSC304 • CN",
    categoryTag: "Network Stacks",
    focusText: "Focus: Encapsulation, Packet flow & Layer responsibilities",
    source: "Gate Smashers",
    duration: "22 mins",
    thumbnail: "https://img.youtube.com/vi/4D55Cmj2t-A/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=4D55Cmj2t-A"
  },
  {
    id: "8",
    title: "IP Addressing & Subnetting Basics for Beginners",
    subjectCode: "2321CSC304 • CN",
    categoryTag: "IP & Routing",
    focusText: "Focus: IPv4 classes, Subnet masks & Network ID",
    source: "Neso Academy",
    duration: "20 mins",
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=vc2U35e1Lno"
  },

  // --- SUBJECT 5: OBJECT-ORIENTED PROGRAMMING ---
  {
    id: "9",
    title: "Object-Oriented Programming (OOPs) Fundamentals",
    subjectCode: "2321CSC305 • OOP",
    categoryTag: "OOP Pillars",
    focusText: "Focus: Classes, Objects, Inheritance & Encapsulation",
    source: "freeCodeCamp",
    duration: "28 mins",
    thumbnail: "https://img.youtube.com/vi/pTB0EiLXUC8/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=pTB0EiLXUC8"
  },
  {
    id: "10",
    title: "Polymorphism & Abstraction in Java / C++",
    subjectCode: "2321CSC305 • OOP",
    categoryTag: "Method Overloading",
    focusText: "Focus: Overloading vs Overriding & Abstract classes",
    source: "Gate Smashers",
    duration: "18 mins",
    thumbnail: "https://img.youtube.com/vi/Ht02t8vZ_Ww/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=Ht02t8vZ_Ww"
  },

  // --- SUBJECT 6: THEORY OF COMPUTATION & COMPILER DESIGN ---
  {
    id: "11",
    title: "Introduction to Automata Theory & Finite Automata (DFA/NFA)",
    subjectCode: "2321CSC306 • TOC",
    categoryTag: "Automata Basics",
    focusText: "Focus: Alphabet, Languages & State transitions",
    source: "Neso Academy",
    duration: "25 mins",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=405j499EwJ0"
  },
  {
    id: "12",
    title: "Phases of a Compiler Architecture Simplified",
    subjectCode: "2321CSC306 • CD",
    categoryTag: "Compiler Stages",
    focusText: "Focus: Lexical Analysis, Syntax Trees & Code Generation",
    source: "Gate Smashers",
    duration: "17 mins",
    thumbnail: "https://img.youtube.com/vi/Qkwj65l_96I/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=Qkwj65l_96I"
  },

  // --- SUBJECT 7: SOFTWARE ENGINEERING & SYSTEM DESIGN ---
  {
    id: "13",
    title: "Software Development Life Cycle (SDLC) & Agile Methodology",
    subjectCode: "2321CSC307 • SE",
    categoryTag: "SDLC & Process",
    focusText: "Focus: Waterfall vs Agile, Scrum & Requirements",
    source: "Gate Smashers",
    duration: "19 mins",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=7j_mI7T2Nq4"
  },
  {
    id: "14",
    title: "System Design for Beginners: Monolith vs Microservices",
    subjectCode: "2321CSC307 • SD",
    categoryTag: "System Architecture",
    focusText: "Focus: Load Balancers, API Gateways & Database scaling",
    source: "Gaurav Sen",
    duration: "26 mins",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    url: "https://www.youtube.com/watch?v=xpDnVSmNfx0"
  }
];

export default function VideoRecommendationGrid({ videos = RECOMMENDED_VIDEOS }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((vid) => (
        <div
          key={vid.id}
          className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 group"
        >
          <div className="space-y-3">
            {/* 1. Thumbnail Container */}
            <a
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-video bg-slate-900 relative rounded-xl overflow-hidden group cursor-pointer block border border-slate-200/60"
            >
              <img
                src={vid.thumbnail}
                alt={vid.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              {/* Dark Gradient Overlay with Maroon Play Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-[#701C34] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              {/* Duration Badge */}
              <span className="absolute bottom-2.5 right-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1 border border-white/10 shadow-sm">
                <Clock className="w-3 h-3 text-rose-300" />
                <span>{vid.duration}</span>
              </span>
            </a>

            {/* 2. Tags Row */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] font-black text-[#701C34] bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                {vid.subjectCode}
              </span>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {vid.categoryTag}
              </span>
            </div>

            {/* 3. Title & Focus Details */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#701C34] transition-colors line-clamp-2">
                {vid.title}
              </h3>
              <p className="text-slate-500 text-xs mt-1 font-medium leading-relaxed">
                {vid.focusText}
              </p>
            </div>
          </div>

          {/* 4. Footer Bar with Working Site Link */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-[#701C34]" />
              <span>{vid.source}</span>
            </span>

            <a
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs font-black text-[#701C34] hover:text-[#581427] hover:underline cursor-pointer transition-colors"
            >
              <span>Watch Lecture</span>
              <span className="text-[11px]">▶</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
