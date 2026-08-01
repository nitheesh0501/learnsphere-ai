import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, ArrowRight, RotateCcw, Award, Sliders, BookOpen } from 'lucide-react';
import { studentAPI } from '../services/api';

const WEEKLY_QUESTION_BANK = {
  1: [
    {
      id: 101,
      subject: "Programming in C++",
      difficulty: "Easy",
      question: "Which keyword is used to declare an integer variable in C++?",
      options: ["int", "num", "integer", "var"],
      correct: 0
    },
    {
      id: 102,
      subject: "Physics II",
      difficulty: "Easy",
      question: "What is the SI unit of electric current?",
      options: ["Volt", "Ampere", "Joule", "Watt"],
      correct: 1
    },
    {
      id: 103,
      subject: "Mathematics III",
      difficulty: "Easy",
      question: "What is the derivative of f(x) = x^2 with respect to x?",
      options: ["x", "2x", "x^3 / 3", "2"],
      correct: 1
    },
    {
      id: 104,
      subject: "Programming in C++",
      difficulty: "Easy",
      question: "Which header file is required for std::cout and std::cin?",
      options: ["<iostream>", "<stdio.h>", "<stdlib.h>", "<conio.h>"],
      correct: 0
    }
  ],
  2: [
    {
      id: 201,
      subject: "Programming in C++",
      difficulty: "Easy",
      question: "What is the memory size of a pointer variable on a 64-bit architecture?",
      options: ["4 bytes", "8 bytes", "2 bytes", "16 bytes"],
      correct: 1
    },
    {
      id: 202,
      subject: "Physics II",
      difficulty: "Medium",
      question: "In simple harmonic motion (SHM), where is the velocity of the oscillating object maximum?",
      options: ["At maximum displacement", "At the mean equilibrium position", "Halfway to amplitude", "At zero acceleration only"],
      correct: 1
    },
    {
      id: 203,
      subject: "Mathematics III",
      difficulty: "Easy",
      question: "What is the derivative of f(x) = e^(2x)?",
      options: ["e^(2x)", "2 * e^(2x)", "0.5 * e^(2x)", "2x * e^(2x)"],
      correct: 1
    },
    {
      id: 204,
      subject: "Programming in C++",
      difficulty: "Medium",
      question: "Which C++ feature allows dynamic binding at runtime?",
      options: ["Operator Overloading", "Virtual Functions", "Function Templates", "Inline Functions"],
      correct: 1
    }
  ],
  3: [
    {
      id: 301,
      subject: "Programming in C++",
      difficulty: "Medium",
      question: "Which data structure follows the Last-In-First-Out (LIFO) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1
    },
    {
      id: 302,
      subject: "Physics II",
      difficulty: "Medium",
      question: "What is the period T of a simple pendulum of length L under gravity g?",
      options: ["2π √(g/L)", "2π √(L/g)", "π √(L/g)", "√(L/g)"],
      correct: 1
    },
    {
      id: 303,
      subject: "Mathematics III",
      difficulty: "Medium",
      question: "If matrix A is 2x3 and matrix B is 3x4, what are the dimensions of matrix product AB?",
      options: ["3x3", "2x4", "4x2", "Undefined"],
      correct: 1
    },
    {
      id: 304,
      subject: "Programming in C++",
      difficulty: "Medium",
      question: "What is the worst-case time complexity of inserting an element into a dynamic array?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
      correct: 1
    }
  ],
  4: [
    {
      id: 401,
      subject: "Programming in C++",
      difficulty: "Medium",
      question: "Which access specifier makes class members accessible only within the class and derived classes?",
      options: ["public", "private", "protected", "friend"],
      correct: 2
    },
    {
      id: 402,
      subject: "Physics II",
      difficulty: "Hard",
      question: "In Young's double-slit experiment, how does fringe width change if slit separation d is halved?",
      options: ["Fringe width is halved", "Fringe width is doubled", "Fringe width quadruples", "No change"],
      correct: 1
    },
    {
      id: 403,
      subject: "Mathematics III",
      difficulty: "Medium",
      question: "What is the Laplace transform of L{1}?",
      options: ["1/s", "1/s^2", "s", "1"],
      correct: 0
    },
    {
      id: 404,
      subject: "Programming in C++",
      difficulty: "Hard",
      question: "What occurs if memory allocated via 'new' is not deallocated using 'delete'?",
      options: ["Dangling Pointer", "Memory Leak", "Stack Overflow", "Segmentation Fault"],
      correct: 1
    }
  ],
  5: [
    {
      id: 501,
      subject: "Programming in C++",
      difficulty: "Hard",
      question: "What is the primary difference between a reference (int &ref = a) and a pointer (int *ptr = &a)?",
      options: ["References can be NULL", "Pointers cannot be reassigned", "References cannot be reassigned to point to another object", "Pointers use less memory"],
      correct: 2
    },
    {
      id: 502,
      subject: "Physics II",
      difficulty: "Hard",
      question: "According to Faraday's Law, the induced electromotive force (EMF) in a circuit is proportional to what?",
      options: ["Magnetic Field Strength", "Rate of change of magnetic flux", "Total Electric Charge", "Resistance of loop"],
      correct: 1
    },
    {
      id: 503,
      subject: "Mathematics III",
      difficulty: "Hard",
      question: "What are the eigenvalues of the 2x2 identity matrix I?",
      options: ["0, 1", "1, 1", "1, -1", "0, 0"],
      correct: 1
    },
    {
      id: 504,
      subject: "Programming in C++",
      difficulty: "Hard",
      question: "Which smart pointer in C++11 provides exclusive ownership of a dynamically allocated resource?",
      options: ["std::shared_ptr", "std::unique_ptr", "std::weak_ptr", "std::auto_ptr"],
      correct: 1
    }
  ],
  6: [
    {
      id: 601,
      subject: "Programming in C++",
      difficulty: "Hard",
      question: "In C++, what happens when a virtual destructor is omitted in a base class with virtual functions?",
      options: ["Compilation Error", "Undefined behavior when deleting a derived object via a base pointer", "Memory is automatically freed", "Virtual table is corrupted"],
      correct: 1
    },
    {
      id: 602,
      subject: "Physics II",
      difficulty: "Hard",
      question: "What is the de Broglie wavelength λ of a particle with momentum p?",
      options: ["λ = h / p", "λ = h * p", "λ = p / h", "λ = h / p^2"],
      correct: 0
    },
    {
      id: 603,
      subject: "Mathematics III",
      difficulty: "Hard",
      question: "Which theorem relates a line integral around a closed curve C to a double integral over the region D bounded by C?",
      options: ["Stokes' Theorem", "Green's Theorem", "Divergence Theorem", "Taylor's Theorem"],
      correct: 1
    },
    {
      id: 604,
      subject: "Programming in C++",
      difficulty: "Hard",
      question: "What is the computational complexity of searching an element in a balanced Red-Black Tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1
    }
  ]
};

export default function AdaptiveQuiz({ initialSubject, addToast }) {
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [filterSubject, setFilterSubject] = useState(initialSubject || null);

  useEffect(() => {
    if (initialSubject) {
      setFilterSubject(initialSubject);
    }
  }, [initialSubject]);

  const difficultyRules = {
    1: { easy: 4, medium: 0, hard: 0, label: "Foundations" },
    2: { easy: 2, medium: 2, hard: 0, label: "Easy -> Medium" },
    3: { easy: 1, medium: 3, hard: 0, label: "Intermediate" },
    4: { easy: 0, medium: 2, hard: 2, label: "Medium -> Hard" },
    5: { easy: 0, medium: 1, hard: 3, label: "Advanced" },
    6: { easy: 0, medium: 0, hard: 4, label: "Advanced Mock" }
  };

  const rawQuestions = WEEKLY_QUESTION_BANK[selectedWeek] || WEEKLY_QUESTION_BANK[1];
  
  const questions = filterSubject
    ? rawQuestions.filter(q => q.subject.toLowerCase() === filterSubject.toLowerCase()).length > 0
      ? rawQuestions.filter(q => q.subject.toLowerCase() === filterSubject.toLowerCase())
      : rawQuestions
    : rawQuestions;

  const currentQ = questions[activeQuestionIndex % questions.length];

  const handleNext = () => {
    const isCorrect = selectedOption === currentQ.correct;
    const newScore = score + (isCorrect ? 1 : 0);

    if (selectedOption === currentQ.correct) {
      setScore(newScore);
    }

    setSelectedOption(null);

    if (activeQuestionIndex + 1 < questions.length) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      setIsFinished(true);
      studentAPI.submitQuiz(newScore, questions.length);
      if (addToast) {
        addToast('Quiz Completed!', `You scored ${newScore} / ${questions.length} on Week ${selectedWeek} Quiz.`, 'success');
      }
    }
  };

  const restartQuiz = () => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  const dist = difficultyRules[selectedWeek];

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Adaptive Quiz Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Week {selectedWeek} Diagnostic Assessment
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Adaptive questions scaling from Foundations (Week 1) to Advanced Mock (Week 6).
          </p>
        </div>

        {/* Week Switcher: Crimson Red Active State */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full no-scrollbar shrink-0">
          {[1, 2, 3, 4, 5, 6].map((w) => (
            <button
              key={w}
              onClick={() => { setSelectedWeek(w); restartQuiz(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedWeek === w
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              W{w}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Notice */}
      {filterSubject && (
        <div className="bg-gradient-to-r from-red-950 to-slate-900 text-white rounded-xl p-3 px-4 flex items-center justify-between text-xs border border-red-900/60 shadow-sm">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span>Focused Practice Subject: <strong>{filterSubject}</strong></span>
          </span>
          <button
            onClick={() => setFilterSubject(null)}
            className="text-xs text-rose-200 hover:text-white underline font-semibold"
          >
            Show All Subjects
          </button>
        </div>
      )}

      {/* Difficulty Mix Indicator */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-red-950 font-medium">
        <span className="font-bold flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-red-600" />
          <span>Week {selectedWeek} Difficulty Level: <strong>{dist.label}</strong></span>
        </span>
        <div className="flex items-center space-x-2 flex-wrap">
          {dist.easy > 0 && (
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-bold border border-emerald-200">
              {dist.easy} Easy
            </span>
          )}
          {dist.medium > 0 && (
            <span className="bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-md font-bold border border-amber-200">
              {dist.medium} Medium
            </span>
          )}
          {dist.hard > 0 && (
            <span className="bg-rose-100 text-red-800 px-2.5 py-0.5 rounded-md font-bold border border-rose-200">
              {dist.hard} Hard
            </span>
          )}
        </div>
      </div>

      {/* Quiz Card */}
      {!isFinished ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-4 gap-2">
            <span className="text-red-600">Question {activeQuestionIndex + 1} of {questions.length}</span>
            <div className="flex items-center space-x-2">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 font-bold border border-slate-200">
                {currentQ.subject}
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-bold border ${
                currentQ.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentQ.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-100 text-red-800 border-rose-200'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between ${
                  selectedOption === idx
                    ? 'border-red-600 bg-rose-50/80 text-red-950 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                {selectedOption === idx && <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={restartQuiz}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Solid Crimson Primary Button */}
            <button
              disabled={selectedOption === null}
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                selectedOption !== null
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{activeQuestionIndex + 1 === questions.length ? 'Submit Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 border border-rose-200 rounded-full flex items-center justify-center mx-auto text-red-600">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Week {selectedWeek} Quiz Completed!</h2>
            <p className="text-slate-500 text-xs mt-1">Your baseline risk profile has been updated automatically.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-sm mx-auto space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Final Score</p>
            <p className="text-4xl font-black text-slate-900">{score} / {questions.length}</p>
            <p className={`text-xs font-extrabold ${
              (score / questions.length) >= 0.75 ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {Math.round((score / questions.length) * 100)}% Accuracy Achieved
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 inline-flex items-center space-x-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Week {selectedWeek} Quiz</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
