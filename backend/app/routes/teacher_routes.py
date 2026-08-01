from flask import Blueprint, request, jsonify

teacher_bp = Blueprint('teacher', __name__)

# Memory state for interactive demo interventions (strictly using requested 7 students)
teacher_interventions_db = [
    {
        "id": 1,
        "student_name": "Santhosh",
        "student_code": "CSE-2026-042",
        "weak_subject": "Programming in C++",
        "internal_score": 19.5,
        "max_score": 50,
        "percentage": 39.0,
        "risk_level": "Weak",
        "status": "Flagged",
        "last_action": "Requires Intervention",
        "avatar": "SA"
    },
    {
        "id": 2,
        "student_name": "Nidhish",
        "student_code": "CSE-2026-089",
        "weak_subject": "Physics II",
        "internal_score": 24.0,
        "max_score": 50,
        "percentage": 48.0,
        "risk_level": "Weak",
        "status": "Nudge Sent",
        "last_action": "Nudge sent yesterday",
        "avatar": "NI"
    },
    {
        "id": 3,
        "student_name": "Salih",
        "student_code": "CSE-2026-112",
        "weak_subject": "Mathematics III",
        "internal_score": 32.5,
        "max_score": 50,
        "percentage": 65.0,
        "risk_level": "Medium",
        "status": "Nudge Sent",
        "last_action": "Revision plan assigned",
        "avatar": "SL"
    },
    {
        "id": 4,
        "student_name": "Nadya",
        "student_code": "CSE-2026-145",
        "weak_subject": "Programming in C++",
        "internal_score": 18.0,
        "max_score": 50,
        "percentage": 36.0,
        "risk_level": "Weak",
        "status": "Flagged",
        "last_action": "Action Required",
        "avatar": "NA"
    },
    {
        "id": 5,
        "student_name": "Meghan",
        "student_code": "CSE-2026-018",
        "weak_subject": "Data Structures",
        "internal_score": 22.5,
        "max_score": 50,
        "percentage": 45.0,
        "risk_level": "Weak",
        "status": "Resolved",
        "last_action": "Completed Wk 1 Quiz",
        "avatar": "ME"
    },
    {
        "id": 6,
        "student_name": "Nitish",
        "student_code": "CSE-2026-056",
        "weak_subject": "Physics II",
        "internal_score": 33.0,
        "max_score": 50,
        "percentage": 66.0,
        "risk_level": "Medium",
        "status": "Flagged",
        "last_action": "Pending Quiz Review",
        "avatar": "NT"
    },
    {
        "id": 7,
        "student_name": "Prajwant",
        "student_code": "CSE-2026-074",
        "weak_subject": "Mathematics III",
        "internal_score": 21.0,
        "max_score": 50,
        "percentage": 42.0,
        "risk_level": "Weak",
        "status": "Flagged",
        "last_action": "Scheduled Mentoring",
        "avatar": "PR"
    }
]

@teacher_bp.route('/dashboard', methods=['GET'])
def get_teacher_dashboard():
    total_students = 128
    at_risk_count = sum(1 for s in teacher_interventions_db if s['status'] in ['Flagged', 'Nudge Sent'])
    resolved_count = sum(1 for s in teacher_interventions_db if s['status'] == 'Resolved')

    return jsonify({
        "teacher_name": "Dr. Sarah Jenkins",
        "department": "Computer Science & Engineering",
        "kpis": {
            "total_students": total_students,
            "at_risk_students": at_risk_count,
            "resolved_interventions": resolved_count,
            "avg_class_readiness": 74.5
        },
        "roster": teacher_interventions_db
    }), 200

@teacher_bp.route('/students', methods=['GET'])
def get_students():
    return jsonify({"students": teacher_interventions_db}), 200

@teacher_bp.route('/intervene', methods=['POST'])
def intervene():
    data = request.get_json() or {}
    student_id = data.get('student_id')
    action_type = data.get('action')

    for student in teacher_interventions_db:
        if student['id'] == student_id:
            if action_type == 'nudge':
                student['status'] = 'Nudge Sent'
                student['last_action'] = 'Nudge notification sent to student'
            elif action_type == 'resolve':
                student['status'] = 'Resolved'
                student['last_action'] = 'Intervention marked resolved'
            
            return jsonify({
                "message": f"Successfully updated student status to {student['status']}",
                "student": student
            }), 200

    return jsonify({"error": "Student not found"}), 404
