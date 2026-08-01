import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, ArrowRight, RotateCcw, Award, Sliders, BookOpen, ExternalLink, Code2, Sparkles, Filter } from 'lucide-react';
import { studentAPI } from '../services/api';

// OFFICIAL SEMESTER 3 SUBJECT LIST (7 EXACT COURSES)
const SEM3_SUBJECTS = [
  { code: '2321MAB301T', title: 'Discrete Mathematics', mne: 'DM', dept: 'Maths' },
  { code: '2321CSC301T', title: 'Computer Networks', mne: 'CN', dept: 'CSE' },
  { code: '2321CSC302J', title: 'Advanced Data Structures & Algorithms', mne: 'ADSA', dept: 'CSE' },
  { code: '2321CSC303J', title: 'Fundamentals of AI & Machine Learning', mne: 'FAIML', dept: 'CSE' },
  { code: '2321CSS301J', title: 'Embedded System Design', mne: 'ESD', dept: 'ECE' },
  { code: '2321CSC304R', title: 'Object Oriented Programming using Java', mne: 'OOPJ', dept: 'CSE' },
  { code: '2321SDA301L', title: 'Career Skill Development III', mne: 'CSD', dept: 'CSE' }
];

// STRICT SEMESTER 3 DOMAIN QUESTION BANK ISOLATED BY SUBJECT CODE & MNE
const SEM3_QUESTION_BANK = {
  "Discrete Mathematics": [
    {
      id: 101,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Easy",
      question: "Which logical operation P → Q evaluates to False ONLY when P is True and Q is False?",
      options: ["Conjunction (AND)", "Disjunction (OR)", "Conditional (Implication)", "Biconditional (XOR)"],
      correct: 2
    },
    {
      id: 102,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Medium",
      question: "What is the chromatic number χ(G) of a complete graph K_n with n vertices?",
      options: ["1", "n - 1", "n", "2"],
      correct: 2
    },
    {
      id: 103,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Hard",
      question: "What is the solution to the recurrence relation T(n) = 2T(n/2) + n using the Master Theorem?",
      options: ["O(n)", "O(n log n)", "O(n^2)", "O(2^n)"],
      correct: 1
    }
  ],
  "Computer Networks": [
    {
      id: 201,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Easy",
      question: "Which layer of the OSI model is responsible for end-to-end packet routing across networks?",
      options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
      correct: 1
    },
    {
      id: 202,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Medium",
      question: "In TCP's three-way handshake connection establishment, what is the exact sequence of flag packets sent?",
      options: ["SYN → SYN-ACK → ACK", "ACK → SYN → ACK", "SYN → ACK → FIN", "CONNECT → ACCEPT → READY"],
      correct: 0
    },
    {
      id: 203,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Hard",
      question: "For a Class C IPv4 address with subnet mask 255.255.255.192 (/26), how many usable host IPs exist per subnet?",
      options: ["64", "62", "30", "126"],
      correct: 1
    }
  ],
  "Advanced Data Structures & Algorithms": [
    {
      id: 301,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Easy",
      question: "What is the worst-case time complexity of searching an element in a balanced Red-Black Tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1
    },
    {
      id: 302,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Medium",
      question: "Which algorithm finds the single-source shortest path in a weighted graph with non-negative edge weights?",
      options: ["Dijkstra's Algorithm", "Floyd-Warshall Algorithm", "Kruskal's Algorithm", "Bellman-Ford Algorithm"],
      correct: 0
    },
    {
      id: 303,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Hard",
      question: "In Dynamic Programming, what core property allows overlapping subproblems to be solved efficiently via memoization?",
      options: ["Optimal Substructure", "Greedy Choice Property", "Divide and Conquer", "Amortized Analysis"],
      correct: 0
    }
  ],
  "Fundamentals of AI & Machine Learning": [
    {
      id: 401,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Easy",
      question: "Which learning paradigm uses labeled training datasets containing input-output pairs?",
      options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Self-Organizing Maps"],
      correct: 1
    },
    {
      id: 402,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Medium",
      question: "What phenomenon occurs when an ML model performs exceptionally high on training data but poorly on test data?",
      options: ["Underfitting", "Overfitting", "High Bias", "Gradient Vanishing"],
      correct: 1
    },
    {
      id: 403,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Hard",
      question: "Which loss function is standard for evaluating binary classification models in logistic regression?",
      options: ["Mean Squared Error (MSE)", "Binary Cross-Entropy (Log Loss)", "Hinge Loss", "Mean Absolute Error (MAE)"],
      correct: 1
    }
  ],
  "Embedded System Design": [
    {
      id: 501,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Easy",
      question: "What does GPIO stand for in microcontroller architecture?",
      options: ["General Purpose Input/Output", "Global Processing I/O", "General Parallel Interface Operator", "Gated Programmable Input Option"],
      correct: 0
    },
    {
      id: 502,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Medium",
      question: "Which communication protocol uses two wires (SDA and SCL) for multi-master, multi-slave serial communication?",
      options: ["SPI", "UART", "I2C (Inter-Integrated Circuit)", "CAN Bus"],
      correct: 2
    },
    {
      id: 503,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Hard",
      question: "What critical requirement distinguishes a Real-Time Operating System (RTOS) from a general-purpose OS?",
      options: ["High Graphical Throughput", "Deterministic Execution & Strict Latency Bounds", "Unlimited Thread Memory", "Virtualization Support"],
      correct: 1
    }
  ],
  "Object Oriented Programming using Java": [
    {
      id: 601,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Easy",
      question: "Which keyword in Java prevents a class from being inherited or a method from being overridden?",
      options: ["static", "final", "abstract", "super"],
      correct: 1
    },
    {
      id: 602,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Medium",
      question: "What is the primary difference between method overloading and method overriding in Java?",
      options: ["Overloading is runtime polymorphism; Overriding is compile-time", "Overloading occurs in the same class with different signatures; Overriding occurs in subclass with same signature", "Overriding requires the static keyword", "Overloading cannot access private members"],
      correct: 1
    },
    {
      id: 603,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Hard",
      question: "In Java's memory model, where are object instances stored when created using the 'new' keyword?",
      options: ["Call Stack", "Heap Memory", "Method Area / Metaspace", "Program Counter Register"],
      correct: 1
    }
  ],
  "Career Skill Development III": [
    {
      id: 701,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Easy",
      question: "If a speed of 72 km/h is converted into meters per second (m/s), what is the result?",
      options: ["18 m/s", "20 m/s", "25 m/s", "15 m/s"],
      correct: 1
    },
    {
      id: 702,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Medium",
      question: "In a coding-decoding test, if 'LOGIC' is coded as 'MOHJD', how is 'SKILL' coded using the same transformation (+1 shift)?",
      options: ["TLJMM", "TLKMM", "UJMNN", "RJKKK"],
      correct: 0
    },
    {
      id: 703,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Hard",
      question: "What is the probability of obtaining a sum of 7 when two unbiased 6-sided dice are rolled simultaneously?",
      options: ["1/6", "1/12", "5/36", "7/36"],
      correct: 0
    }
  ]
};

// LEETCODE PRACTICE POOL FOR SEMESTER 3 COURSES
const SEM3_LEETCODE_POOL = {
  "Discrete Mathematics": [
    { id: 509, title: "Fibonacci Number", difficulty: "Easy", slug: "fibonacci-number", tags: ["Math", "Recursion"] },
    { id: 54, title: "Spiral Matrix", difficulty: "Medium", slug: "spiral-matrix", tags: ["Matrix", "Logic"] },
    { id: 149, title: "Max Points on a Line", difficulty: "Hard", slug: "max-points-on-a-line", tags: ["Geometry", "Math"] }
  ],
  "Computer Networks": [
    { id: 217, title: "Contains Duplicate (Address Hashing)", difficulty: "Easy", slug: "contains-duplicate", tags: ["Hash Table"] },
    { id: 200, title: "Number of Islands (Routing Graph)", difficulty: "Medium", slug: "number-of-islands", tags: ["BFS", "Graph"] },
    { id: 207, title: "Course Schedule (Topological Sort)", difficulty: "Hard", slug: "course-schedule", tags: ["Graph", "DAG"] }
  ],
  "Advanced Data Structures & Algorithms": [
    { id: 206, title: "Reverse Linked List", difficulty: "Easy", slug: "reverse-linked-list", tags: ["Linked List"] },
    { id: 15, title: "3Sum (Two Pointers)", difficulty: "Medium", slug: "3sum", tags: ["Two Pointers", "Sorting"] },
    { id: 42, title: "Trapping Rain Water", difficulty: "Hard", slug: "trapping-rain-water", tags: ["Stack", "Two Pointers"] }
  ],
  "Fundamentals of AI & Machine Learning": [
    { id: 1, title: "Two Sum (Vector Search)", difficulty: "Easy", slug: "two-sum", tags: ["Hash Table"] },
    { id: 347, title: "Top K Frequent Elements (K-NN)", difficulty: "Medium", slug: "top-k-frequent-elements", tags: ["Heap", "Hash Table"] },
    { id: 300, title: "Longest Increasing Subsequence", difficulty: "Hard", slug: "longest-increasing-subsequence", tags: ["Dynamic Programming"] }
  ],
  "Embedded System Design": [
    { id: 704, title: "Binary Search (Register Array)", difficulty: "Easy", slug: "binary-search", tags: ["Binary Search"] },
    { id: 155, title: "Min Stack (Interrupt Stack)", difficulty: "Medium", slug: "min-stack", tags: ["Stack", "Design"] },
    { id: 23, title: "Merge k Sorted Lists (Buffer Queues)", difficulty: "Hard", slug: "merge-k-sorted-lists", tags: ["Heap"] }
  ],
  "Object Oriented Programming using Java": [
    { id: 242, title: "Valid Anagram", difficulty: "Easy", slug: "valid-anagram", tags: ["String", "Hash Table"] },
    { id: 49, title: "Group Anagrams (OOP Classes)", difficulty: "Medium", slug: "group-anagrams", tags: ["Hash Table", "String"] },
    { id: 146, title: "LRU Cache (Interface Design)", difficulty: "Hard", slug: "lru-cache", tags: ["Design", "Doubly Linked List"] }
  ],
  "Career Skill Development III": [
    { id: 9, title: "Palindrome Number (Aptitude)", difficulty: "Easy", slug: "palindrome-number", tags: ["Math"] },
    { id: 121, title: "Best Time to Buy/Sell Stock (Logic)", difficulty: "Medium", slug: "best-time-to-buy-and-sell-stock", tags: ["Array", "Dynamic Programming"] },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", slug: "median-of-two-sorted-arrays", tags: ["Binary Search"] }
  ]
};

export default function AdaptiveQuiz({ initialSubject, addToast }) {
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || SEM3_SUBJECTS[0].title);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (initialSubject) {
      const matched = SEM3_SUBJECTS.find(
        s => s.title.toLowerCase().includes(initialSubject.toLowerCase()) ||
             s.mne.toLowerCase() === initialSubject.toLowerCase() ||
             s.code.toLowerCase() === initialSubject.toLowerCase()
      );
      if (matched) setSelectedSubject(matched.title);
    }
  }, [initialSubject]);

  const activeQuestions = SEM3_QUESTION_BANK[selectedSubject] || SEM3_QUESTION_BANK["Discrete Mathematics"];
  const currentQ = activeQuestions[activeQuestionIndex % activeQuestions.length];

  const handleNext = () => {
    const isCorrect = selectedOption === currentQ.correct;
    const newScore = score + (isCorrect ? 1 : 0);

    if (isCorrect) {
      setScore(newScore);
    }

    setSelectedOption(null);

    if (activeQuestionIndex + 1 < activeQuestions.length) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      setIsFinished(true);
      studentAPI.submitQuiz(newScore, activeQuestions.length).catch(() => null);
      if (addToast) {
        addToast('Sem 3 Assessment Complete!', `Scored ${newScore} / ${activeQuestions.length} in ${selectedSubject}.`, 'success');
      }
    }
  };

  const restartQuiz = () => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleSubjectSwitch = (subjTitle) => {
    setSelectedSubject(subjTitle);
    restartQuiz();
  };

  const currentLeetCodeProblems = SEM3_LEETCODE_POOL[selectedSubject] || SEM3_LEETCODE_POOL["Discrete Mathematics"];
  const activeSubjObj = SEM3_SUBJECTS.find(s => s.title === selectedSubject) || SEM3_SUBJECTS[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-2 sm:px-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#701C34] text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-[#701C34]" />
            <span>Semester 3 Focus Mode Assessment</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {activeSubjObj.title} ({activeSubjObj.mne})
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Official Course Code: <strong className="text-[#701C34] font-bold">{activeSubjObj.code}</strong> • Department of {activeSubjObj.dept}
          </p>
        </div>

        {/* Semester 3 Subject Switcher Dropdown */}
        <div className="relative shrink-0 w-full sm:w-auto">
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <Filter className="w-4 h-4 text-[#701C34] ml-2" />
            <select
              value={selectedSubject}
              onChange={(e) => handleSubjectSwitch(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-3 py-1 cursor-pointer w-full sm:w-64"
            >
              {SEM3_SUBJECTS.map((s) => (
                <option key={s.code} value={s.title}>
                  {s.code} - {s.title} ({s.mne})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Subject Tabs (Fast Switcher) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {SEM3_SUBJECTS.map((s) => (
          <button
            key={s.code}
            onClick={() => handleSubjectSwitch(s.title)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border ${
              selectedSubject === s.title
                ? 'bg-[#701C34] text-white border-[#701C34] shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span>{s.mne}</span>
            <span className="text-[10px] opacity-80 ml-1 font-semibold">({s.code})</span>
          </button>
        ))}
      </div>

      {/* Quiz Card */}
      {!isFinished ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-4 gap-2">
            <span className="text-[#701C34] font-extrabold">Question {activeQuestionIndex + 1} of {activeQuestions.length}</span>
            <div className="flex items-center space-x-2">
              <span className="bg-rose-50 text-[#701C34] px-2.5 py-1 rounded-lg font-bold border border-rose-200">
                {currentQ.code}
              </span>
              <span className={`px-2.5 py-1 rounded-lg font-bold border ${
                currentQ.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentQ.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-100 text-[#701C34] border-rose-200'
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
                    ? 'border-[#701C34] bg-rose-50/80 text-[#701C34] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-800'
                }`}
              >
                <span>{opt}</span>
                {selectedOption === idx && <CheckCircle2 className="w-5 h-5 text-[#701C34] shrink-0" />}
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
              <span>Reset Assessment</span>
            </button>

            <button
              disabled={selectedOption === null}
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                selectedOption !== null
                  ? 'bg-[#701C34] hover:bg-[#581427] text-white shadow-md shadow-[#701C34]/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{activeQuestionIndex + 1 === activeQuestions.length ? 'Submit Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-rose-100 border border-rose-200 rounded-full flex items-center justify-center mx-auto text-[#701C34]">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">{selectedSubject} ({activeSubjObj.mne}) Assessment Complete!</h2>
            <p className="text-slate-500 text-xs mt-1">Course Code: {activeSubjObj.code} • Baseline risk profile updated.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-sm mx-auto space-y-1">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Final Score</p>
            <p className="text-4xl font-black text-slate-900">{score} / {activeQuestions.length}</p>
            <p className={`text-xs font-extrabold ${
              (score / activeQuestions.length) >= 0.75 ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {Math.round((score / activeQuestions.length) * 100)}% Accuracy Achieved
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="px-6 py-2.5 bg-[#701C34] hover:bg-[#581427] text-white rounded-xl text-xs font-bold shadow-md shadow-[#701C34]/20 inline-flex items-center space-x-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake {activeSubjObj.mne} Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC LEETCODE PRACTICE RECOMMENDATIONS FOR SELECTED SEM 3 SUBJECT */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-rose-50 text-[#701C34] border border-rose-200 shadow-2xs">
                <Code2 className="w-3.5 h-3.5 text-[#701C34]" />
                <span>Recommended LeetCode Practice</span>
              </span>
              <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                {activeSubjObj.code} • {activeSubjObj.mne}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-2">
              {activeSubjObj.title} Problem Set
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Curated coding & analytical challenges matched strictly to {activeSubjObj.code} curriculum
            </p>
          </div>
        </div>

        {/* LeetCode Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentLeetCodeProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white border border-slate-200 hover:border-[#701C34] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md transition-all duration-200 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between flex-wrap">
                  <span className="text-[11px] font-black text-slate-400">LeetCode #{prob.id}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                    prob.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : prob.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-100 text-[#701C34] border-rose-200'
                  }`}>
                    {prob.difficulty}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#701C34] transition-colors line-clamp-1">
                  {prob.title}
                </h4>

                <div className="flex items-center space-x-1 flex-wrap">
                  {prob.tags.map((tg) => (
                    <span key={tg} className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={`https://leetcode.com/problems/${prob.slug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-slate-50 group-hover:bg-[#701C34] text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-[#701C34] rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1"
                title={`Solve ${prob.title} on LeetCode`}
              >
                <span>Solve Problem</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
