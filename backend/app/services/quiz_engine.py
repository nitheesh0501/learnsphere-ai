import random

class AdaptiveQuizEngine:
    WEEK_DIFFICULTY_DISTRIBUTION = {
        1: {"Easy": 10, "Medium": 0, "Hard": 0},
        2: {"Easy": 8, "Medium": 2, "Hard": 0},
        3: {"Easy": 5, "Medium": 5, "Hard": 0},
        4: {"Easy": 2, "Medium": 6, "Hard": 2},
        5: {"Easy": 0, "Medium": 5, "Hard": 5},
        6: {"Easy": 0, "Medium": 0, "Hard": 10}
    }

    def get_distribution_for_week(self, week_number, prev_score_pct=None):
        """
        Calculates question breakdown for the selected week.
        Adjusts difficulty upwards if prev_score_pct >= 85% or downwards if prev_score_pct < 50%.
        """
        week_number = max(1, min(week_number, 6))
        dist = dict(self.WEEK_DIFFICULTY_DISTRIBUTION[week_number])

        if prev_score_pct is not None:
            if prev_score_pct >= 85.0 and dist["Easy"] > 0:
                # Shift 2 Easy questions to Medium/Hard
                dist["Easy"] = max(0, dist["Easy"] - 2)
                dist["Medium"] += 1
                dist["Hard"] += 1
            elif prev_score_pct < 50.0 and dist["Hard"] > 0:
                # Shift 2 Hard questions to Medium/Easy
                dist["Hard"] = max(0, dist["Hard"] - 2)
                dist["Medium"] += 1
                dist["Easy"] += 1

        return dist

    def generate_quiz_questions(self, subject_name, week_number=1, prev_score_pct=None):
        """
        Returns dynamic, realistic quiz questions according to the week distribution.
        """
        dist = self.get_distribution_for_week(week_number, prev_score_pct)
        questions = []
        q_id = 1

        question_bank = {
            "Easy": [
                {
                    "text": f"What is the time complexity of searching in a balanced Binary Search Tree?",
                    "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    "answer": "O(log n)"
                },
                {
                    "text": f"Which data structure follows the Last In First Out (LIFO) principle?",
                    "options": ["Queue", "Array", "Stack", "Linked List"],
                    "answer": "Stack"
                },
                {
                    "text": f"In SQL, which command is used to retrieve data from a database table?",
                    "options": ["GET", "FETCH", "SELECT", "EXTRACT"],
                    "answer": "SELECT"
                },
                {
                    "text": f"What is the primary function of an Operating System Kernel?",
                    "options": ["User UI Rendering", "Managing CPU and Hardware Resources", "Web Browsing", "Compiling Code"],
                    "answer": "Managing CPU and Hardware Resources"
                },
                {
                    "text": f"Which OSI layer handles routing and IP addressing?",
                    "options": ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
                    "answer": "Network Layer"
                },
                {
                    "text": f"What does ACID stand for in Database Transactions?",
                    "options": ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Index, Data", "Auto, Command, Input, Delete", "Array, Class, Instance, Directory"],
                    "answer": "Atomicity, Consistency, Isolation, Durability"
                },
                {
                    "text": f"Which HTTP method is idempotent and used to retrieve resources?",
                    "options": ["POST", "GET", "PATCH", "CONNECT"],
                    "answer": "GET"
                },
                {
                    "text": f"What is the main benefit of Normalization in Relational Databases?",
                    "options": ["Increases Redundancy", "Reduces Data Redundancy and Anomalies", "Speeds up ALL Queries", "Eliminates Foreign Keys"],
                    "answer": "Reduces Data Redundancy and Anomalies"
                },
                {
                    "text": f"Which process state transition occurs when CPU scheduler selects a process?",
                    "options": ["Ready to Running", "Running to Waiting", "Waiting to Ready", "Terminated to Running"],
                    "answer": "Ready to Running"
                },
                {
                    "text": f"What type of IP address is 192.168.1.1?",
                    "options": ["Public IPv4", "Private IPv4", "IPv6 Multicast", "Loopback Address"],
                    "answer": "Private IPv4"
                }
            ],
            "Medium": [
                {
                    "text": f"How does Dijkstra's Algorithm handle graphs with negative edge weights?",
                    "options": ["Works perfectly", "May produce incorrect shortest paths", "Converts them to positive automatically", "Throws a compiler exception"],
                    "answer": "May produce incorrect shortest paths"
                },
                {
                    "text": f"What condition is required for a deadlock to occur in an Operating System?",
                    "options": ["Preemption only", "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait", "Single Process execution", "Shared memory allocation"],
                    "answer": "Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait"
                },
                {
                    "text": f"What is the main difference between B-Tree and B+ Tree indexing?",
                    "options": ["B-Trees have data in leaves only", "B+ Trees store data pointers only in leaf nodes", "B+ Trees cannot be balanced", "B-Trees require double memory"],
                    "answer": "B+ Trees store data pointers only in leaf nodes"
                },
                {
                    "text": f"In TCP 3-way handshake, what flags are sent in sequence?",
                    "options": ["SYN -> SYN-ACK -> ACK", "ACK -> SYN -> FIN", "RST -> SYN -> ACK", "SYN -> FIN -> ACK"],
                    "answer": "SYN -> SYN-ACK -> ACK"
                },
                {
                    "text": f"What is the time complexity of QuickSelect for finding the k-th smallest element on average?",
                    "options": ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
                    "answer": "O(n)"
                },
                {
                    "text": f"Which page replacement algorithm suffers from Belady's Anomaly?",
                    "options": ["LRU (Least Recently Used)", "FIFO (First In First Out)", "Optimal Page Replacement", "LFU (Least Frequently Used)"],
                    "answer": "FIFO (First In First Out)"
                }
            ],
            "Hard": [
                {
                    "text": f"In distributed database consensus, what is the key difference between Paxos and Raft?",
                    "options": ["Raft uses symmetric leaderless voting", "Raft decomposes consensus into explicit Leader Election, Log Replication, and Safety", "Paxos cannot handle node crashes", "Raft requires 100% network uptime"],
                    "answer": "Raft decomposes consensus into explicit Leader Election, Log Replication, and Safety"
                },
                {
                    "text": f"What is the worst-case space complexity of the Red-Black Tree insertion algorithm?",
                    "options": ["O(log n)", "O(1) auxiliary space", "O(n)", "O(n^2)"],
                    "answer": "O(1) auxiliary space"
                },
                {
                    "text": f"How does the TCP BBR congestion control algorithm differ from Cubic?",
                    "options": ["BBR measures bottleneck bandwidth & RTT instead of packet loss", "BBR doubles window size on packet loss", "BBR is purely UDP-based", "BBR disables retransmissions"],
                    "answer": "BBR measures bottleneck bandwidth & RTT instead of packet loss"
                },
                {
                    "text": f"Under Strict Two-Phase Locking (SS2PL), when are exclusive locks released?",
                    "options": ["Immediately after data item modification", "At the end of transaction commit/abort", "During Phase 1 growth", "Whenever CPU becomes idle"],
                    "answer": "At the end of transaction commit/abort"
                }
            ]
        }

        for diff, count in dist.items():
            pool = question_bank.get(diff, [])
            selected = pool * ((count // len(pool)) + 1)
            for item in selected[:count]:
                questions.append({
                    "id": q_id,
                    "subject_name": subject_name,
                    "question_text": item["text"],
                    "options": item["options"],
                    "correct_answer": item["answer"],
                    "difficulty": diff,
                    "week_number": week_number
                })
                q_id += 1

        random.shuffle(questions)
        return {
            "week_number": week_number,
            "distribution": dist,
            "total_questions": len(questions),
            "questions": questions
        }

adaptive_quiz_engine = AdaptiveQuizEngine()
