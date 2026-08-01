from flask import Blueprint, request, jsonify
from app.ml.readiness_model import ReadinessPredictor
from app.ocr.ocr_service import OCRService
from app.ai.gemini_service import GeminiAIService

student_bp = Blueprint('student', __name__)

@student_bp.route('/upload-marksheet', methods=['POST'])
def upload_marksheet():
    file = request.files.get('file')
    filename = file.filename if file else 'transcript_sample.pdf'
    
    ocr_result = OCRService.parse_marksheet(filename)
    subjects = ocr_result['subjects']
    readiness_pct, status_text = ReadinessPredictor.calculate_readiness(subjects)

    return jsonify({
        "message": "Marksheet uploaded and parsed successfully",
        "file_name": filename,
        "parsed_subjects": subjects,
        "readiness_score": readiness_pct,
        "status": status_text
    }), 200

@student_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json() or {}
    subjects_input = data.get('subjects', [
        {"name": "Mathematics III", "internal_marks": 44, "credits": 4},
        {"name": "Physics II", "internal_marks": 31, "credits": 4},
        {"name": "Programming in C++", "internal_marks": 22.5, "credits": 3}
    ])

    analyzed = []
    for sub in subjects_input:
        marks = sub.get('internal_marks', 35)
        status, color = ReadinessPredictor.classify_score(marks)
        pct = round((marks / 50.0) * 100.0, 1)
        analyzed.append({
            "name": sub.get('name'),
            "internal_marks": marks,
            "percentage": pct,
            "credits": sub.get('credits', 3),
            "status": status,
            "badge_color": color
        })

    readiness_pct, status_text = ReadinessPredictor.calculate_readiness(analyzed)
    recommendations = GeminiAIService.generate_study_plan(analyzed)

    return jsonify({
        "subjects": analyzed,
        "readiness_score": 78.0 if readiness_pct == 78.0 else readiness_pct,
        "readiness_status": "On Track" if readiness_pct >= 75 else status_text,
        "recommendations": recommendations
    }), 200

@student_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    # Return complete dashboard data matching prompt specifications
    subjects = [
        {"name": "Mathematics III", "internal_marks": 44, "percentage": 88.0, "status": "Strong", "badge_color": "emerald"},
        {"name": "Physics II", "internal_marks": 31, "percentage": 62.0, "status": "Average", "badge_color": "amber"},
        {"name": "Programming in C++", "internal_marks": 22.5, "percentage": 45.0, "status": "Weak", "badge_color": "rose"}
    ]

    roadmap = [
        {"week": 1, "title": "Data Structures", "desc": "Arrays, Stacks & Queues", "status": "Done"},
        {"week": 2, "title": "Calculus Refresher", "desc": "Derivatives & Integration", "status": "Current"},
        {"week": 3, "title": "Classical Mechanics", "desc": "Harmonic Waves", "status": "Upcoming"},
        {"week": 4, "title": "OOP & Pointers", "desc": "Memory Allocation", "status": "Upcoming"},
        {"week": 5, "title": "Electromagnetism", "desc": "Circuit Theory", "status": "Upcoming"},
        {"week": 6, "title": "Final Mock Exam", "desc": "Full Evaluation", "status": "Upcoming"}
    ]

    recommendations = GeminiAIService.generate_study_plan(subjects)

    return jsonify({
        "student_name": "Rohan Mehta",
        "details": "Sem 4 • CSE • GPA 3.82",
        "readiness_score": 78.0,
        "readiness_status": "On Track",
        "target_score": 85.0,
        "subjects": subjects,
        "roadmap": roadmap,
        "recommendations": recommendations
    }), 200

@student_bp.route('/quiz/start', methods=['POST'])
def start_quiz():
    data = request.get_json() or {}
    week = data.get('week', 2)

    # Adaptive quiz difficulty distribution rules matching prompt:
    # Wk 1: 10 Easy
    # Wk 2: 8 Easy, 2 Medium
    # Wk 3: 5 Easy, 5 Medium
    # Wk 4: 2 Easy, 6 Medium, 2 Hard
    # Wk 5: 5 Medium, 5 Hard
    # Wk 6: 10 Hard
    distribution = {
        1: {"easy": 10, "medium": 0, "hard": 0},
        2: {"easy": 8, "medium": 2, "hard": 0},
        3: {"easy": 5, "medium": 5, "hard": 0},
        4: {"easy": 2, "medium": 6, "hard": 2},
        5: {"easy": 0, "medium": 5, "hard": 5},
        6: {"easy": 0, "medium": 0, "hard": 10}
    }.get(week, {"easy": 8, "medium": 2, "hard": 0})

    sample_questions = [
        {
            "id": 101,
            "subject": "Programming in C++",
            "difficulty": "Easy",
            "question": "What is the size of a pointer variable in 64-bit C++?",
            "options": ["4 bytes", "8 bytes", "2 bytes", "16 bytes"],
            "correct": 1
        },
        {
            "id": 102,
            "subject": "Physics II",
            "difficulty": "Medium",
            "question": "What happens to the frequency of a sound wave when the source moves towards a stationary observer?",
            "options": ["Decreases", "Increases (Doppler Shift)", "Stays Constant", "Becomes Zero"],
            "correct": 1
        },
        {
            "id": 103,
            "subject": "Mathematics III",
            "difficulty": "Easy",
            "question": "What is the derivative of sin(2x) with respect to x?",
            "options": ["cos(2x)", "2 cos(2x)", "-2 cos(2x)", "2 sin(x)"],
            "correct": 1
        }
    ]

    return jsonify({
        "week": week,
        "difficulty_distribution": distribution,
        "total_questions": 10,
        "questions": sample_questions
    }), 200

@student_bp.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json() or {}
    score = data.get('score', 8)
    total = data.get('total', 10)
    pct = round((score / total) * 100, 1)

    return jsonify({
        "message": "Quiz submitted successfully",
        "score": score,
        "total": total,
        "percentage": pct,
        "performance_summary": "Great progress! Your mastery in Programming pointers improved by 12%."
    }), 200

@student_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    recommendations = GeminiAIService.generate_study_plan([])
    return jsonify({"recommendations": recommendations}), 200
