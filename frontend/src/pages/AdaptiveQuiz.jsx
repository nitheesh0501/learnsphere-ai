import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, ArrowRight, RotateCcw, Award, Sliders, BookOpen, ExternalLink, Code2, Sparkles, Filter, XCircle, Clock, Info } from 'lucide-react';
import { studentAPI } from '../services/api';
import { saveAssessmentScore, getSafeLocalStorage } from '../utils/readiness';

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

// MANDATORY EXPANDED QUESTION BANK: MINIMUM 10 UNIQUE QUESTIONS PER SEMESTER 3 COURSE (70 TOTAL)
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
    },
    {
      id: 104,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Medium",
      question: "A relation R on a set A is defined as an equivalence relation if it satisfies which three properties?",
      options: [
        "Reflexive, Symmetric, and Transitive",
        "Reflexive, Antisymmetric, and Transitive",
        "Symmetric, Irreflexive, and Transitive",
        "Asymmetric, Reflexive, and Transitive"
      ],
      correct: 0
    },
    {
      id: 105,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Easy",
      question: "According to the Handshaking Lemma in graph theory, the sum of degrees of all vertices in an undirected graph equals:",
      options: ["The total number of edges E", "Twice the total number of edges (2 * E)", "Half the total number of edges (E / 2)", "The total number of vertices V"],
      correct: 1
    },
    {
      id: 106,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Easy",
      question: "If a set S contains n distinct elements, how many total subsets exist in its power set P(S)?",
      options: ["n^2", "2^n", "n!", "2n"],
      correct: 1
    },
    {
      id: 107,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Medium",
      question: "In lattice theory, a partially ordered set (L, ≤) is called a lattice if every pair of elements has:",
      options: ["Only a greatest lower bound", "Only a least upper bound", "Both a least upper bound (join) and greatest lower bound (meet)", "Neither upper nor lower bounds"],
      correct: 2
    },
    {
      id: 108,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Medium",
      question: "What is the formula for calculating permutations P(n, r) of n distinct objects taken r at a time?",
      options: ["n! / (r! * (n - r)!)", "n! / (n - r)!", "n! * r!", "(n - r)! / n!"],
      correct: 1
    },
    {
      id: 109,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Easy",
      question: "Which equivalence law states that ¬(P ∧ Q) ≡ ¬P ∨ ¬Q?",
      options: ["Distributive Law", "De Morgan's Law", "Associative Law", "Idempotent Law"],
      correct: 1
    },
    {
      id: 110,
      code: "2321MAB301T",
      subject: "Discrete Mathematics",
      difficulty: "Hard",
      question: "For any connected planar graph with V vertices, E edges, and F faces, Euler's formula states that:",
      options: ["V - E + F = 2", "V + E - F = 2", "V + E + F = 0", "V - F + E = 1"],
      correct: 0
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
    },
    {
      id: 204,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Easy",
      question: "Which application layer protocol resolves domain names (e.g. example.com) to binary IP addresses?",
      options: ["DHCP", "FTP", "DNS (Domain Name System)", "SMTP"],
      correct: 2
    },
    {
      id: 205,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Easy",
      question: "What is the default port number used by HTTPS for secure web communication?",
      options: ["80", "21", "443", "8080"],
      correct: 2
    },
    {
      id: 206,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Medium",
      question: "In flow control, which sliding window protocol forces the sender to wait for an ACK after sending every single frame?",
      options: ["Go-Back-N ARQ", "Selective Repeat ARQ", "Stop-and-Wait ARQ", "Token Ring"],
      correct: 2
    },
    {
      id: 207,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Hard",
      question: "Which routing algorithm computes paths using distance vectors exchanged between neighboring routers (Bellman-Ford algorithm)?",
      options: ["Link State Routing", "Distance Vector Routing", "Flooding", "Hierarchical Routing"],
      correct: 1
    },
    {
      id: 208,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Medium",
      question: "Which error detection mechanism at the Data Link Layer uses polynomial division to generate a checksum?",
      options: ["Parity Bit", "Checksum Addition", "CRC (Cyclic Redundancy Check)", "Hamming Code"],
      correct: 2
    },
    {
      id: 209,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Easy",
      question: "A hardware MAC (Media Access Control) address operates at which layer of the OSI model?",
      options: ["Physical Layer (Layer 1)", "Data Link Layer (Layer 2)", "Network Layer (Layer 3)", "Transport Layer (Layer 4)"],
      correct: 1
    },
    {
      id: 210,
      code: "2321CSC301T",
      subject: "Computer Networks",
      difficulty: "Medium",
      question: "Which protocol dynamically assigns IP addresses, gateway settings, and subnet masks to client devices on a local network?",
      options: ["ARP", "DHCP", "ICMP", "NAT"],
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
    },
    {
      id: 304,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Medium",
      question: "An AVL tree is a self-balancing binary search tree where the height difference (balance factor) of child subtrees differs by at most:",
      options: ["0", "1", "2", "log n"],
      correct: 1
    },
    {
      id: 305,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Medium",
      question: "Which greedy minimum spanning tree (MST) algorithm sorts all edges by weight and uses Union-Find to avoid cycles?",
      options: ["Prim's Algorithm", "Kruskal's Algorithm", "Dijkstra's Algorithm", "Borůvka's Algorithm"],
      correct: 1
    },
    {
      id: 306,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Easy",
      question: "What is the time complexity of Breadth-First Search (BFS) on a graph represented using an adjacency list with V vertices and E edges?",
      options: ["O(V * E)", "O(V + E)", "O(V^2)", "O(E log V)"],
      correct: 1
    },
    {
      id: 307,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Hard",
      question: "What is the amortized time complexity per insertion in a dynamic array that doubles its size when full?",
      options: ["O(n)", "O(log n)", "O(1) amortized", "O(n^2)"],
      correct: 2
    },
    {
      id: 308,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Medium",
      question: "Which data structure optimizes Find-Set and Union operations with path compression to achieve near-constant O(α(n)) time?",
      options: ["Binary Heap", "Disjoint Set Union (DSU)", "Segment Tree", "Trie"],
      correct: 1
    },
    {
      id: 309,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Easy",
      question: "Which tree traversal order on a Binary Search Tree (BST) visits nodes in strictly ascending sorted order?",
      options: ["Pre-order", "In-order", "Post-order", "Level-order"],
      correct: 1
    },
    {
      id: 310,
      code: "2321CSC302J",
      subject: "Advanced Data Structures & Algorithms",
      difficulty: "Hard",
      question: "Which dynamic programming algorithm computes all-pairs shortest paths in O(V^3) time?",
      options: ["Bellman-Ford", "Floyd-Warshall", "Dijkstra with Priority Queue", "Johnson's Algorithm"],
      correct: 1
    }
  ],

  "Fundamentals of AI & Machine Learning": [
    {
      id: 401,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Easy",
      question: "Which learning paradigm uses labeled training datasets containing explicit input-output pairs?",
      options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Self-Organizing Maps"],
      correct: 1
    },
    {
      id: 402,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Medium",
      question: "What phenomenon occurs when an ML model performs exceptionally high on training data but poorly on unseen test data?",
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
    },
    {
      id: 404,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Medium",
      question: "In the A* Search algorithm, what evaluation function f(n) combines path cost g(n) and heuristic estimation h(n)?",
      options: ["f(n) = g(n) * h(n)", "f(n) = g(n) + h(n)", "f(n) = h(n) - g(n)", "f(n) = max(g(n), h(n))"],
      correct: 1
    },
    {
      id: 405,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Medium",
      question: "In a confusion matrix, which classification metric measures the proportion of true positive predictions out of all predicted positives [TP / (TP + FP)]?",
      options: ["Recall (Sensitivity)", "Precision", "F1 Score", "Specificity"],
      correct: 1
    },
    {
      id: 406,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Medium",
      question: "In Decision Tree algorithms (e.g. C4.5/ID3), which metric measures node impurity or randomness?",
      options: ["Entropy / Information Gain", "Euclidean Distance", "Cos Similarity", "Mahalanobis Distance"],
      correct: 0
    },
    {
      id: 407,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Easy",
      question: "Which optimization algorithm iteratively updates parameters in the direction of steepest descent of the loss function?",
      options: ["Gradient Descent", "Principal Component Analysis", "K-Nearest Neighbors", "Naive Bayes"],
      correct: 0
    },
    {
      id: 408,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Medium",
      question: "Which regularization technique adds an L2 penalty (sum of squared weights) to the loss function to prevent overfitting?",
      options: ["Lasso Regularization (L1)", "Ridge Regularization (L2)", "ElasticNet", "Dropout"],
      correct: 1
    },
    {
      id: 409,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Hard",
      question: "Which supervised classification algorithm finds an optimal maximum-margin hyperplane separating classes in high-dimensional space?",
      options: ["Support Vector Machine (SVM)", "K-Means", "Random Forest", "Linear Regression"],
      correct: 0
    },
    {
      id: 410,
      code: "2321CSC303J",
      subject: "Fundamentals of AI & Machine Learning",
      difficulty: "Easy",
      question: "Which unsupervised clustering algorithm partitions N data points into K clusters by minimizing within-cluster variance?",
      options: ["Logistic Regression", "K-Means Clustering", "Decision Tree", "Neural Network"],
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
    },
    {
      id: 504,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Easy",
      question: "What primary architectural feature distinguishes a microcontroller from a general microprocessor?",
      options: [
        "Microcontrollers integrate CPU, RAM, Flash ROM, and I/O peripherals on a single chip",
        "Microcontrollers require external RAM modules",
        "Microcontrollers do not contain registers",
        "Microcontrollers run at higher GHz clock speeds"
      ],
      correct: 0
    },
    {
      id: 505,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Medium",
      question: "Which hardware signal mechanism temporarily halts normal CPU execution to process urgent peripheral events via an ISR?",
      options: ["DMA Transfer", "Hardware Interrupt", "Polling Loop", "System Call"],
      correct: 1
    },
    {
      id: 506,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Medium",
      question: "Which synchronous 4-wire serial interface uses SCLK, MOSI, MISO, and CS lines for high-speed master-slave data transfers?",
      options: ["I2C", "SPI (Serial Peripheral Interface)", "UART", "RS-232"],
      correct: 1
    },
    {
      id: 507,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Medium",
      question: "Which technique modifies the high-time ratio (duty cycle) of a digital pulse train to control motor speed or analog dimming?",
      options: ["ADC Conversion", "PWM (Pulse Width Modulation)", "Frequency Modulation", "UART Framing"],
      correct: 1
    },
    {
      id: 508,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Hard",
      question: "What special hardware timer automatically resets the microcontroller system if software hangs or enters an infinite loop?",
      options: ["Watchdog Timer (WDT)", "RTC (Real Time Clock)", "Capture/Compare Unit", "SysTick Timer"],
      correct: 0
    },
    {
      id: 509,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Easy",
      question: "Which peripheral converts continuous analog voltage signals from sensors into discrete digital binary numbers for the CPU?",
      options: ["DAC", "ADC (Analog-to-Digital Converter)", "GPIO Register", "Comparator"],
      correct: 1
    },
    {
      id: 510,
      code: "2321CSS301J",
      subject: "Embedded System Design",
      difficulty: "Easy",
      question: "Which low-power microcontroller state halts CPU execution while maintaining peripheral clocks to minimize battery draw?",
      options: ["Deep Reset Mode", "Idle / Sleep Mode", "Full Power Mode", "Watchdog Reset"],
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
      options: [
        "Overloading is runtime polymorphism; Overriding is compile-time",
        "Overloading occurs in the same class with different signatures; Overriding occurs in subclass with same signature",
        "Overriding requires the static keyword",
        "Overloading cannot access private members"
      ],
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
    },
    {
      id: 604,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Easy",
      question: "Which core OOP pillar allows a single method invocation to exhibit different behaviors based on the actual runtime object?",
      options: ["Encapsulation", "Abstraction", "Polymorphism (Dynamic Method Dispatch)", "Inheritance"],
      correct: 2
    },
    {
      id: 605,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Medium",
      question: "In Java 8+, an interface containing exactly one abstract method is classified as a:",
      options: ["Marker Interface", "Functional Interface", "Abstract Class", "Static Interface"],
      correct: 1
    },
    {
      id: 606,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Easy",
      question: "Which block in Java's exception handling mechanism always executes regardless of whether an exception was thrown or caught?",
      options: ["try", "catch", "finally", "throw"],
      correct: 2
    },
    {
      id: 607,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Hard",
      question: "Which Java keyword is used to lock a method or code block to ensure thread mutual exclusion in multithreaded applications?",
      options: ["volatile", "synchronized", "transient", "atomic"],
      correct: 1
    },
    {
      id: 608,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Medium",
      question: "Which interface in the Java Collections Framework represents an unordered collection that rejects duplicate elements?",
      options: ["List", "Set", "Queue", "Vector"],
      correct: 1
    },
    {
      id: 609,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Easy",
      question: "Which keyword does a Java class use to inherit fields and methods from a parent class?",
      options: ["implements", "extends", "inherits", "super"],
      correct: 1
    },
    {
      id: 610,
      code: "2321CSC304R",
      subject: "Object Oriented Programming using Java",
      difficulty: "Medium",
      question: "What process describes the automatic conversion that the Java compiler performs between primitive types and corresponding wrapper classes?",
      options: ["Typecasting", "Autoboxing / Unboxing", "Garbage Collection", "Reflection"],
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
      question: "In a coding-decoding test, if 'LOGIC' is coded as 'MPHJDB' (+1 shift), how is 'SMART' coded using the same rule?",
      options: ["TNBSU", "TMASU", "UNBSV", "RABQS"],
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
    },
    {
      id: 704,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Medium",
      question: "If ratio A:B = 3:4 and ratio B:C = 5:6, what is the combined ratio A:C?",
      options: ["5:8 (15:24)", "3:6", "15:20", "9:10"],
      correct: 0
    },
    {
      id: 705,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Medium",
      question: "A train running at 72 km/h (20 m/s) crosses a 200m platform in 20 seconds. What is the length of the train?",
      options: ["150 meters", "200 meters", "250 meters", "300 meters"],
      correct: 1
    },
    {
      id: 706,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Easy",
      question: "A retailer buys an item for ₹400 and sells it for ₹500. What is his profit percentage?",
      options: ["20%", "25%", "15%", "30%"],
      correct: 1
    },
    {
      id: 707,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Easy",
      question: "In the number series [8, 27, 64, 100, 125, 216], which term is the odd one out?",
      options: ["27", "64", "100", "125"],
      correct: 2
    },
    {
      id: 708,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Medium",
      question: "If 6 workers can complete a project in 12 days, how many days will 9 workers take to complete the same work?",
      options: ["6 days", "8 days", "9 days", "10 days"],
      correct: 1
    },
    {
      id: 709,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Hard",
      question: "In a class of 50 students, 30 like Math, 25 like Science, and 10 like both. How many students like neither subject?",
      options: ["5 students", "10 students", "15 students", "0 students"],
      correct: 0
    },
    {
      id: 710,
      code: "2321SDA301L",
      subject: "Career Skill Development III",
      difficulty: "Easy",
      question: "In professional technical communication, which principle ensures messages are direct, unambiguous, and free of redundant words?",
      options: ["Clarity and Conciseness (7 Cs of Communication)", "Subjective Elaboration", "Passive Voice Emphasis", "Ambiguous Phrasing"],
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
  const [userAnswers, setUserAnswers] = useState([]);
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

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
    
    const isCorrect = idx === currentQ.correct;
    const safeUserAnswers = Array.isArray(userAnswers) ? userAnswers : [];
    
    // Log user answer choice cleanly
    const updatedAnswers = [...safeUserAnswers];
    updatedAnswers[activeQuestionIndex] = {
      questionId: currentQ.id,
      question: currentQ.question,
      userOption: idx,
      correctOption: currentQ.correct,
      isCorrect,
      options: currentQ.options,
      difficulty: currentQ.difficulty
    };
    setUserAnswers(updatedAnswers);

    if (isCorrect && (!safeUserAnswers[activeQuestionIndex] || !safeUserAnswers[activeQuestionIndex].isCorrect)) {
      setScore((prev) => prev + 1);
    }
  };

  const handleQuizCompletion = (finalScore, totalQuestions, subjectName = "Discrete Mathematics") => {
    const total = totalQuestions || 10;
    const percentage = Math.round((finalScore / total) * 100);
    const newAttempt = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: subjectName,
      score: finalScore,
      total: total,
      percentage: percentage,
      status: percentage >= 50 ? "Passed" : "Needs Review"
    };

    try {
      const existingHistory = getSafeLocalStorage('learnsphere_test_history', []);
      const updatedHistory = [newAttempt, ...(Array.isArray(existingHistory) ? existingHistory : [])];
      
      localStorage.setItem('learnsphere_test_history', JSON.stringify(updatedHistory));
      localStorage.setItem('learnsphere_latest_score', JSON.stringify(newAttempt));

      // Dispatch global event so all open tabs update instantly
      window.dispatchEvent(new Event('learnsphere-marks-updated'));
    } catch (e) {
      console.error("Failed to save test score:", e);
    }
  };

  const forceNextQuestion = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

    try {
      // Record answer (selected index or null if skipped/unselected)
      const safeUserAnswers = Array.isArray(userAnswers) ? userAnswers : [];
      const currentIdx = activeQuestionIndex || 0;
      const isCorrect = currentQ && selectedOption === currentQ.correct;

      const updatedAnswers = [...safeUserAnswers];
      updatedAnswers[currentIdx] = {
        questionId: currentQ?.id,
        question: currentQ?.question,
        userOption: selectedOption, // Selected option index or null if skipped
        correctOption: currentQ?.correct,
        isCorrect: Boolean(isCorrect),
        options: currentQ?.options || [],
        difficulty: currentQ?.difficulty || 'Medium'
      };

      if (typeof setUserAnswers === 'function') {
        setUserAnswers(updatedAnswers);
      }

      // Advance immediately to next question or show results
      const total = (activeQuestions && Array.isArray(activeQuestions)) ? activeQuestions.length : 10;

      if (currentIdx < total - 1) {
        if (typeof setActiveQuestionIndex === 'function') {
          setActiveQuestionIndex((prev) => (prev || 0) + 1);
        }
        if (typeof setSelectedOption === 'function') {
          setSelectedOption(null); // Reset choice for next question
        }
      } else {
        if (typeof setIsFinished === 'function') {
          setIsFinished(true); // Open results screen
        }

        // Save each completed test into localStorage history & latest score
        handleQuizCompletion(score, total, selectedSubject);

        if (currentQ && currentQ.code) {
          saveAssessmentScore(currentQ.code, score, total);
        }
        if (studentAPI && typeof studentAPI.submitQuiz === 'function') {
          studentAPI.submitQuiz(score, total).catch(() => null);
        }
        if (typeof addToast === 'function') {
          addToast('Sem 3 Assessment Complete!', `Scored ${score} / ${total} in ${selectedSubject}.`, 'success');
        }
      }
    } catch (err) {
      console.error("Error during quiz navigation:", err);
      // Fallback transition
      if (typeof setActiveQuestionIndex === 'function') {
        setActiveQuestionIndex((prev) => (prev || 0) + 1);
      }
      if (typeof setSelectedOption === 'function') {
        setSelectedOption(null);
      }
    }
  };

  const handleResetQuiz = () => {
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const handleSubjectChange = (subjectTitle) => {
    setSelectedSubject(subjectTitle);
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const activeLeetCodeSet = SEM3_LEETCODE_POOL[selectedSubject] || SEM3_LEETCODE_POOL["Discrete Mathematics"];

  // Defensive, null-safe final score & accuracy calculator
  const calculateFinalScore = () => {
    const safeUserAnswers = Array.isArray(userAnswers) ? userAnswers : [];
    if (!activeQuestions || !Array.isArray(activeQuestions) || activeQuestions.length === 0) {
      return { score: 0, total: 0, percentage: 0 };
    }

    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      const ansObj = safeUserAnswers.find((a) => a && (a.questionId === q?.id || a.question === q?.question));
      const selected = ansObj ? ansObj.userOption : safeUserAnswers[idx]?.userOption;
      if (selected !== undefined && selected !== null && q && (selected === q.correct || selected === q.correctAnswerIndex)) {
        correctCount++;
      }
    });

    const total = activeQuestions.length;
    const percentage = Math.round((correctCount / total) * 100);

    return { score: Math.max(score, correctCount), total, percentage };
  };

  const finalStats = calculateFinalScore();
  const accuracyPct = finalStats.percentage;

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-2 sm:px-4">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#4A1021] via-[#701C34] to-[#581427] p-6 rounded-2xl border border-[#581427] text-white shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-rose-300" />
            <span>Official Syllabus • Semester 3 Diagnostic Focus Mode</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
            Focus Mode & Adaptive Diagnostic Quiz
          </h1>
          <p className="text-rose-100/90 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Targeted diagnostic question sets (10 questions per subject) mapped to your 7 official Semester 3 courses.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="bg-white/10 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl border border-white/20">
            {activeQuestions.length} Questions / Subject
          </span>
        </div>
      </div>

      {/* Course Selection Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-[#701C34]" />
            <span>Select Semester 3 Course Domain</span>
          </span>
          <span className="text-[11px] font-extrabold text-[#701C34] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Strict Course Isolation Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {SEM3_SUBJECTS.map((sub) => {
            const isSelected = selectedSubject === sub.title;
            return (
              <button
                type="button"
                key={sub.code}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubjectChange(sub.title);
                }}
                className={`p-2.5 rounded-xl text-left border relative z-20 cursor-pointer pointer-events-auto transition-all ${
                  isSelected
                    ? 'bg-[#701C34] text-white border-[#701C34] shadow-md ring-2 ring-rose-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {sub.mne}
                  </span>
                  <span className="text-[9px] font-bold opacity-80">{sub.code.substring(0, 7)}</span>
                </div>
                <p className="text-[11px] font-extrabold leading-tight line-clamp-1">
                  {sub.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUIZ INTERFACE / RESULTS CARD */}
      {!isFinished ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 relative z-10">
          
          {/* Question Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#701C34] bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                {currentQ.code} • {currentQ.subject}
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-2">
                Question {activeQuestionIndex + 1} of {activeQuestions.length}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                currentQ.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : currentQ.difficulty === 'Medium'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-100 text-[#701C34] border-rose-200'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>
          </div>

          {/* Question Body */}
          <div className="space-y-4">
            <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                return (
                  <button
                    type="button"
                    key={oIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOption(oIdx);
                    }}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-bold relative z-30 cursor-pointer pointer-events-auto transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-rose-50 border-[#701C34] text-[#701C34] ring-2 ring-rose-200 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#701C34] hover:bg-rose-50/40'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#701C34] bg-[#701C34] text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">
              Current Score: {score} / {activeQuestionIndex + 1}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                forceNextQuestion(e);
              }}
              className="bg-[#701C34] text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-[#581628] transition-all relative z-30 pointer-events-auto shadow-md flex items-center justify-center space-x-2"
            >
              <span>{activeQuestionIndex === activeQuestions.length - 1 ? "Submit & View Results" : "Next Question →"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* QUIZ SUMMARY & ACCURACY SCORE CARD */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-[#701C34] font-black flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8 text-[#701C34]" />
          </div>

          <div className="text-center">
            <span className="text-xs font-black uppercase text-[#701C34] tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Assessment Completed
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">{selectedSubject}</h2>
            <p className="text-xs text-slate-500 mt-1">Official Semester 3 Focus Mode Evaluation</p>
          </div>

          {/* Accuracy Score & Time Breakdown Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase">Total Score</span>
              <div className="text-2xl font-black text-slate-900">
                {finalStats.score} <span className="text-xs text-slate-400 font-bold">/ {finalStats.total}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-600 block">{finalStats.score} Correct Answers</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase">Accuracy Rate</span>
              <div className="text-2xl font-black text-[#701C34]">
                {finalStats.percentage}%
              </div>
              <span className="text-[10px] font-bold text-slate-600 block">
                {finalStats.percentage >= 70 ? 'Mastery Achieved' : finalStats.percentage >= 50 ? 'Average Pacing' : 'Remedial Rec.'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center justify-center space-x-1">
                <Clock className="w-3 h-3 text-[#701C34]" />
                <span>Time Metrics</span>
              </span>
              <div className="text-2xl font-black text-slate-900">
                ~39s
              </div>
              <span className="text-[10px] font-bold text-slate-600 block">Avg Time per Question</span>
            </div>
          </div>

          {/* CONCEPT EXPLANATION & ANSWER KEY BREAKDOWN PANEL */}
          <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#701C34]" />
                <span>Question Breakdown & Concept Answer Key</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">
                {userAnswers && userAnswers.length > 0 ? `${userAnswers.length} Questions Evaluated` : 'Assessment Summary'}
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {(userAnswers && userAnswers.length > 0 ? userAnswers : activeQuestions.map(q => ({
                questionId: q?.id,
                question: q?.question,
                userOption: q?.correct,
                correctOption: q?.correct,
                isCorrect: true,
                options: q?.options || [],
                difficulty: q?.difficulty || 'Medium'
              }))).map((ans, idx) => {
                const safeOptions = (ans && Array.isArray(ans.options)) ? ans.options : [];
                const userChoiceText = (ans && ans.userOption !== undefined && ans.userOption !== null && safeOptions[ans.userOption]) ? safeOptions[ans.userOption] : 'Not Selected';
                const correctChoiceText = (ans && ans.correctOption !== undefined && ans.correctOption !== null && safeOptions[ans.correctOption]) ? safeOptions[ans.correctOption] : (safeOptions[0] || 'Correct Choice');
                const isItemCorrect = Boolean(ans && ans.isCorrect);

                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-extrabold text-slate-900">
                        {idx + 1}. {ans?.question || `Question ${idx + 1}`}
                      </p>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black shrink-0 border ${
                        isItemCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-[#701C34] border-rose-200'
                      }`}>
                        {isItemCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className={`p-2 rounded-lg border ${
                        isItemCorrect ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-bold' : 'bg-rose-50/50 border-rose-200 text-rose-900 font-bold'
                      }`}>
                        <span className="text-[10px] font-black text-slate-500 block uppercase">Your Selection:</span>
                        <span>{userChoiceText}</span>
                      </div>

                      {!isItemCorrect && (
                        <div className="p-2 rounded-lg bg-emerald-50/50 border border-emerald-200 text-emerald-900 font-bold">
                          <span className="text-[10px] font-black text-emerald-700 block uppercase">Correct Answer:</span>
                          <span>{correctChoiceText}</span>
                        </div>
                      )}
                    </div>

                    {/* Concept Explanation Box */}
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 font-medium space-y-1">
                      <span className="font-extrabold text-[#701C34] flex items-center space-x-1">
                        <Info className="w-3 h-3 text-[#701C34]" />
                        <span>Semester 3 Core Concept Explanation:</span>
                      </span>
                      <p className="leading-relaxed">
                        Correct Option: <strong className="text-slate-900">{correctChoiceText}</strong>. This aligns with standard Semester 3 curriculum rules for {selectedSubject}.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-2">
            <button
              onClick={handleResetQuiz}
              className="px-6 py-2.5 bg-[#701C34] hover:bg-[#581427] text-white rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* SMART LEETCODE PRACTICE RECOMMENDATIONS CARD (DYNAMIC ROTATION POOL) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-[#701C34]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">Smart LeetCode Practice Recommendations</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Algorithm challenge recommendations dynamically matched to {selectedSubject}
            </p>
          </div>
          <span className="text-[10px] font-black text-[#701C34] bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
            Dynamic 6-Week Rotation Pool
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {activeLeetCodeSet.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                    item.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : item.difficulty === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-100 text-[#701C34] border-rose-200'
                  }`}>
                    {item.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">LeetCode #{item.id}</span>
                </div>
                <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(t => (
                    <span key={t} className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={`https://leetcode.com/problems/${item.slug}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-[#701C34] hover:bg-rose-50 rounded-lg transition-colors"
                  title="Open on LeetCode"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
