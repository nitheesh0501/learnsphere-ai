import React from 'react';
import { Play, Clock, BookOpen } from 'lucide-react';

export const RECOMMENDED_VIDEOS = [
  {
    id: "1",
    title: "Java Interfaces, Polymorphism & Abstract Classes Complete Guide",
    subjectCode: "2321CSC304R • OOPJ",
    categoryTag: "Fundamental Remedial",
    focusText: "Focus: Pointers, References & Interface Contracts",
    source: "NPTEL • IIT Kharagpur",
    duration: "24 mins",
    thumbnail: "https://i3.ytimg.com/vi/hdI2bkO3458/maxresdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=hdI2bkO3458"
  },
  {
    id: "2",
    title: "Embedded Systems: Microcontroller Timers, Counters & SPI Waveforms",
    subjectCode: "2321CSS301J • ESD",
    categoryTag: "Core Hardware Practice",
    focusText: "Focus: GPIO Timers & SPI Protocols",
    source: "MIT OpenCourseWare",
    duration: "32 mins",
    thumbnail: "https://i3.ytimg.com/vi/3V9EQ3yS2d0/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=3V9EQ3yS2d0"
  },
  {
    id: "3",
    title: "Red–Black Trees Insertion, Deletion & Height Proof Derivations",
    subjectCode: "2321CSC302J • ADSA",
    categoryTag: "Algorithm Mastery",
    focusText: "Focus: Red–Black Tree Rotations & DP Memoization",
    source: "Stanford Computer Science",
    duration: "28 mins",
    thumbnail: "https://i3.ytimg.com/vi/v6i2O5_S_6M/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=v6i2O5_S_6M"
  },
  {
    id: "4",
    title: "Introduction to Operating Systems & Kernel Architecture Functions",
    subjectCode: "2321CSC302T • OS",
    categoryTag: "System Concepts",
    focusText: "Focus: System Calls, Process Control Blocks & Kernel Modes",
    source: "Gate Smashers",
    duration: "19 mins",
    thumbnail: "https://i3.ytimg.com/vi/WJ-UaAaumNA/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=WJ-UaAaumNA"
  },
  {
    id: "5",
    title: "SQL & Relational Database Design Full University Course",
    subjectCode: "2321CSC303T • DBMS",
    categoryTag: "Database Mastery",
    focusText: "Focus: Entity-Relationship Diagrams, Normalization & Joins",
    source: "freeCodeCamp",
    duration: "45 mins",
    thumbnail: "https://i3.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=HXV3zeQKqGY"
  },
  {
    id: "6",
    title: "Computer Networks: OSI 7-Layer Architecture Explained",
    subjectCode: "2321CSC301T • CN",
    categoryTag: "Network Protocols",
    focusText: "Focus: Encapsulation, Packet Headers & Protocol Stacks",
    source: "Gate Smashers",
    duration: "22 mins",
    thumbnail: "https://i3.ytimg.com/vi/4D55Cmj2t-A/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=4D55Cmj2t-A"
  },
  {
    id: "7",
    title: "Machine Learning: Gradient Descent, Loss Functions & Neural Nets",
    subjectCode: "2321CSC303J • FAIML",
    categoryTag: "Concept Enrichment",
    focusText: "Focus: Supervised Learning & Binary Cross-Entropy Loss",
    source: "MIT OpenCourseWare",
    duration: "35 mins",
    thumbnail: "https://i3.ytimg.com/vi/aircAruvnKk/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=aircAruvnKk"
  },
  {
    id: "8",
    title: "Discrete Math: Propositional Logic Proofs & Recurrence Relations",
    subjectCode: "2321MAB301T • DM",
    categoryTag: "Advanced Drills",
    focusText: "Focus: Propositional Logic, Truth Tables & Mathematical Proofs",
    source: "Stanford Computer Science",
    duration: "19 mins",
    thumbnail: "https://i3.ytimg.com/vi/tyDKR4fg3Yw/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=tyDKR4fg3Yw"
  },
  {
    id: "9",
    title: "0/1 Knapsack Problem Using Dynamic Programming & Memoization",
    subjectCode: "2321CSC302J • ADSA",
    categoryTag: "Problem Solving",
    focusText: "Focus: Overlapping Subproblems & Tabulation Optimization",
    source: "Abdul Bari",
    duration: "30 mins",
    thumbnail: "https://i3.ytimg.com/vi/nLmhmB6NzcM/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1516116211223-4c7141326c6c?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=nLmhmB6NzcM"
  },
  {
    id: "10",
    title: "System Design: Microservices, Load Balancers & Distributed Caching",
    subjectCode: "2321CSC304T • SD",
    categoryTag: "System Architecture",
    focusText: "Focus: Scalability, CAP Theorem & High Availability Systems",
    source: "Gaurav Sen",
    duration: "38 mins",
    thumbnail: "https://i3.ytimg.com/vi/xpDnVSmNfx0/hqdefault.jpg",
    fallbackThumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop",
    url: "https://www.youtube.com/watch?v=xpDnVSmNfx0"
  }
];

export default function VideoRecommendationGrid({ videos = RECOMMENDED_VIDEOS }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  if (target.src !== vid.fallbackThumbnail) {
                    target.src = vid.fallbackThumbnail;
                  }
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
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#701C34] transition-colors line-clamp-2">
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
