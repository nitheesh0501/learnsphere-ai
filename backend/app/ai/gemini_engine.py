import os
import json
import google.generativeai as genai

class GeminiAIEngine:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                self.has_live_ai = True
            except Exception:
                self.has_live_ai = False
        else:
            self.has_live_ai = False

    def generate_study_plan(self, weak_subjects, medium_subjects, student_name="Student"):
        """Generates a personalized daily study plan and weekly goals."""
        prompt = f"""
        Act as an expert academic tutor for {student_name}.
        The student has Weak subjects: {', '.join(weak_subjects) if weak_subjects else 'None'}
        Medium subjects: {', '.join(medium_subjects) if medium_subjects else 'None'}
        
        Generate a JSON object with:
        1. "daily_schedule": List of objects with time, subject, focus_topic, and action item.
        2. "weekly_goals": List of 4 key milestones.
        3. "revision_strategy": Strategy for exam prep.
        4. "motivational_quote": An inspiring message.
        Return ONLY raw valid JSON.
        """
        if self.has_live_ai:
            try:
                res = self.model.generate_content(prompt)
                text = res.text.strip()
                if text.startswith("```json"):
                    text = text[7:-3].strip()
                return json.loads(text)
            except Exception:
                pass

        # High quality dynamic fallback response
        return {
            "daily_schedule": [
                {
                    "time": "08:00 AM - 09:30 AM",
                    "subject": weak_subjects[0] if weak_subjects else "Data Structures",
                    "focus_topic": "Fundamental Concepts & Problem Solving",
                    "action": "Review core definitions, work through 3 medium practice problems, update flashcards."
                },
                {
                    "time": "10:30 AM - 12:00 PM",
                    "subject": weak_subjects[1] if len(weak_subjects) > 1 else "Computer Networks",
                    "focus_topic": "Protocol Stack & Numerical Problems",
                    "action": "Solve previous year IA numericals and draw network topology diagrams."
                },
                {
                    "time": "04:00 PM - 05:30 PM",
                    "subject": medium_subjects[0] if medium_subjects else "Operating Systems",
                    "focus_topic": "Interactive Quiz & Weak Spot Revision",
                    "action": "Complete Week 3 Adaptive Quiz on LearnSphere portal and review incorrect options."
                },
                {
                    "time": "08:00 PM - 09:00 PM",
                    "subject": "General Revision",
                    "focus_topic": "Flashcard Speed Review",
                    "action": "Review 20 AI-generated flashcards for formula and definition recall."
                }
            ],
            "weekly_goals": [
                f"Master key formulas in {weak_subjects[0] if weak_subjects else 'Data Structures'} to boost IA score above 38/50.",
                "Complete 3 Adaptive Quizzes with score > 80% accuracy.",
                "Resolve 5 pending doubts with AI Chat Assistant & Teacher portal.",
                "Achieve 15 total dedicated study hours this week."
            ],
            "revision_strategy": "Focus 60% of time on Weak subjects using Active Recall, 30% on Medium subjects via Spaced Repetition, and 10% maintaining Strong subjects.",
            "motivational_quote": "Consistency in small daily efforts compounds into semester excellence. Focus on the internal assessment gaps now, and the final exam will be smooth!"
        }

    def generate_knowledge_gap_report(self, weak_subjects):
        """Generates detailed knowledge gap analysis for weak subjects."""
        gaps = []
        topic_presets = {
            "Data Structures & Algorithms": ["Trees & Graph Traversals", "Dynamic Programming", "Heap & Priority Queues"],
            "Database Management Systems": ["Normalization (3NF/BCNF)", "Transaction Concurrency & Locking", "Complex SQL Joins"],
            "Operating Systems": ["Process Synchronization & Semaphores", "Page Replacement Algorithms", "Deadlock Prevention"],
            "Computer Networks": ["TCP/IP Congestion Control", "Subnetting & CIDR Notation", "Routing Algorithms (BGP/OSPF)"],
            "Software Engineering": ["Agile Sprint Planning", "UML Sequence Diagrams", "System Testing Strategies"]
        }

        for sub in weak_subjects:
            topics = topic_presets.get(sub, ["Core Concepts", "Problem Solving", "Applied Numericals"])
            gaps.append({
                "subject": sub,
                "priority": "HIGH",
                "weak_topics": topics,
                "difficulty": "Hard",
                "estimated_hours": 8,
                "improvement_strategy": f"Focus on solving 10 step-by-step previous IA questions for {topics[0]}."
            })
        return gaps

    def generate_flashcards(self, subject_name):
        """Generates flashcards for rapid revision."""
        cards = [
            {"id": 1, "question": f"What is the core objective of {subject_name}?", "answer": f"To optimize algorithm efficiency and system design patterns in modern computer science."},
            {"id": 2, "question": f"Explain key trade-off in {subject_name}.", "answer": f"Time complexity vs Space complexity optimization."},
            {"id": 3, "question": f"What is a critical exam question topic in {subject_name}?", "answer": f"Step-by-step derivation and architectural workflow diagrams."},
            {"id": 4, "question": f"How to get full marks in {subject_name} IA?", "answer": f"Write crisp definitions, clean block diagrams, and exact state transition logic."}
        ]
        return cards

    def generate_teacher_insights(self, student_name, readiness_score, risk_level, weak_subjects):
        """AI Assistant for Teachers to draft intervention & encouragement."""
        return {
            "summary": f"{student_name} is currently at a {risk_level} Risk level with a Semester Readiness Score of {readiness_score}%.",
            "recommended_action": f"Schedule a 10-minute 1-on-1 counseling session for {', '.join(weak_subjects) if weak_subjects else 'recent topics'}.",
            "draft_feedback": f"Dear {student_name}, I reviewed your recent Internal Assessment marks. You have strong potential! Let's work together to clarify concepts in {weak_subjects[0] if weak_subjects else 'your subjects'} before the semester finals.",
            "encouragement": f"Keep pushing, {student_name}! Small daily improvements will easily convert your IA scores into top end-sem grades."
        }

    def chat_doubt_solver(self, question, student_context=""):
        """Interactive Gemini AI chat for resolving student doubts."""
        if self.has_live_ai:
            try:
                res = self.model.generate_content(f"Context: {student_context}\nStudent Question: {question}\nProvide a clear, encouraging academic answer.")
                return res.text
            except Exception:
                pass

        return f"Great question! In {student_context or 'Computer Science'}, when dealing with '{question}', remember the core principle: break the problem into smaller sub-problems. Review the step-by-step derivation in your recommended study plan or attempt the adaptive quiz question on this topic!"

gemini_engine = GeminiAIEngine()
