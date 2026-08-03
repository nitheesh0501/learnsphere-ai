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
    videoId: "hdI2bkO3458",
    thumbnail: "https://img.youtube.com/vi/hdI2bkO3458/hqdefault.jpg",
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
    videoId: "3V9EQ3yS2d0",
    thumbnail: "https://img.youtube.com/vi/3V9EQ3yS2d0/hqdefault.jpg",
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
    videoId: "v6i2O5_S_6M",
    thumbnail: "https://img.youtube.com/vi/v6i2O5_S_6M/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=v6i2O5_S_6M"
  },
  {
    id: "4",
    title: "Computer Networks: TCP Connection Establishment & Subnet Calculations",
    subjectCode: "2321CSC301T • CN",
    categoryTag: "Network Protocols",
    focusText: "Focus: TCP 3-Way Handshake & Subnet Masking",
    source: "NPTEL",
    duration: "21 mins",
    videoId: "rL8RFIiylyo",
    thumbnail: "https://img.youtube.com/vi/rL8RFIiylyo/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=rL8RFIiylyo"
  },
  {
    id: "5",
    title: "Machine Learning: Gradient Descent, Loss Functions & Neural Nets",
    subjectCode: "2321CSC303J • FAIML",
    categoryTag: "Concept Enrichment",
    focusText: "Focus: Supervised Learning & Binary Cross-Entropy Loss",
    source: "MIT OpenCourseWare",
    duration: "35 mins",
    videoId: "aircAruvnKk",
    thumbnail: "https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=aircAruvnKk"
  },
  {
    id: "6",
    title: "Discrete Math: Propositional Logic Proofs & Homogeneous Recurrences",
    subjectCode: "2321MAB301T • DM",
    categoryTag: "Advanced Drills",
    focusText: "Focus: Logic, Set Theory & Recurrence Relations",
    source: "Stanford Computer Science",
    duration: "19 mins",
    videoId: "tyDKR4fg3Yw",
    thumbnail: "https://img.youtube.com/vi/tyDKR4fg3Yw/hqdefault.jpg",
    url: "https://www.youtube.com/watch?v=tyDKR4fg3Yw"
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`;
                }}
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
