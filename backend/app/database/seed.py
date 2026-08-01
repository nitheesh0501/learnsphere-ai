import json
from datetime import datetime, timedelta
from app.database.db import db
from app.database.models import (
    User, Student, Teacher, Marksheet, Subject, 
    QuizResult, StudyPlan, Recommendation, Analytics, 
    Notification, Message, TeacherFeedback
)

def seed_database():
    """Populates the database with initial realistic hackathon demo data."""
    # Check if already seeded
    if User.query.first():
        print("Database already contains data. Skipping seed.")
        return

    print("Seeding initial LearnSphere AI data...")

    # 1. Teachers
    teacher_user = User(
        email="teacher@learnsphere.ai",
        name="Dr. Aris Thorne",
        role="teacher",
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    )
    teacher_user.set_password("password123")
    db.session.add(teacher_user)
    db.session.flush()

    teacher_profile = Teacher(
        user_id=teacher_user.id,
        department="Computer Science & Engineering",
        designation="Professor & HOD"
    )
    db.session.add(teacher_profile)

    # 2. Student 1: Rahul Sharma
    student1_user = User(
        email="student@learnsphere.ai",
        name="Rahul Sharma",
        role="student",
        avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
    )
    student1_user.set_password("password123")
    db.session.add(student1_user)
    db.session.flush()

    student1_profile = Student(
        user_id=student1_user.id,
        usn="1DS21CS102",
        department="Computer Science & Engineering",
        semester=6,
        target_gpa=8.8
    )
    db.session.add(student1_profile)
    db.session.flush()

    # 3. Student 2: Ananya Verma
    student2_user = User(
        email="ananya@learnsphere.ai",
        name="Ananya Verma",
        role="student",
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    )
    student2_user.set_password("password123")
    db.session.add(student2_user)
    db.session.flush()

    student2_profile = Student(
        user_id=student2_user.id,
        usn="1DS21CS014",
        department="Computer Science & Engineering",
        semester=6,
        target_gpa=9.2
    )
    db.session.add(student2_profile)
    db.session.flush()

    # 4. Marksheet & Subjects for Rahul (Student 1)
    marksheet1 = Marksheet(
        student_id=student1_profile.id,
        filename="IA1_Marksheet_Rahul.pdf",
        file_path="/uploads/IA1_Marksheet_Rahul.pdf",
        status="PROCESSED"
    )
    db.session.add(marksheet1)
    db.session.flush()

    subjects_rahul = [
        {"name": "Data Structures & Algorithms", "marks": 31.0, "status": "Weak"},
        {"name": "Computer Networks", "marks": 29.0, "status": "Weak"},
        {"name": "Operating Systems", "marks": 38.0, "status": "Medium"},
        {"name": "Database Management Systems", "marks": 44.0, "status": "Strong"},
        {"name": "Software Engineering", "marks": 42.0, "status": "Strong"}
    ]

    for s in subjects_rahul:
        subj = Subject(
            marksheet_id=marksheet1.id,
            student_id=student1_profile.id,
            name=s["name"],
            ia_marks=s["marks"],
            max_marks=50.0,
            status=s["status"]
        )
        db.session.add(subj)

    # 5. Marksheet & Subjects for Ananya (Student 2)
    marksheet2 = Marksheet(
        student_id=student2_profile.id,
        filename="IA1_Marksheet_Ananya.pdf",
        file_path="/uploads/IA1_Marksheet_Ananya.pdf",
        status="PROCESSED"
    )
    db.session.add(marksheet2)
    db.session.flush()

    subjects_ananya = [
        {"name": "Data Structures & Algorithms", "marks": 45.0, "status": "Strong"},
        {"name": "Computer Networks", "marks": 41.0, "status": "Strong"},
        {"name": "Operating Systems", "marks": 39.0, "status": "Medium"},
        {"name": "Database Management Systems", "marks": 48.0, "status": "Strong"},
        {"name": "Software Engineering", "marks": 43.0, "status": "Strong"}
    ]

    for s in subjects_ananya:
        subj = Subject(
            marksheet_id=marksheet2.id,
            student_id=student2_profile.id,
            name=s["name"],
            ia_marks=s["marks"],
            max_marks=50.0,
            status=s["status"]
        )
        db.session.add(subj)

    # 6. Analytics Records
    analytics1 = Analytics(
        student_id=student1_profile.id,
        readiness_score=71.4,
        risk_level="Moderate",
        predicted_gpa=7.9,
        weekly_study_hours=14.5,
        improvement_percentage=16.8
    )
    analytics2 = Analytics(
        student_id=student2_profile.id,
        readiness_score=92.5,
        risk_level="Low",
        predicted_gpa=9.1,
        weekly_study_hours=18.0,
        improvement_percentage=24.2
    )
    db.session.add(analytics1)
    db.session.add(analytics2)

    # 7. Quiz Results History for Rahul
    quiz1 = QuizResult(
        student_id=student1_profile.id,
        subject_name="Data Structures & Algorithms",
        score=7,
        total_questions=10,
        difficulty_level="Easy",
        week_number=1,
        date=datetime.utcnow() - timedelta(days=14)
    )
    quiz2 = QuizResult(
        student_id=student1_profile.id,
        subject_name="Computer Networks",
        score=6,
        total_questions=10,
        difficulty_level="Easy & Medium",
        week_number=2,
        date=datetime.utcnow() - timedelta(days=7)
    )
    quiz3 = QuizResult(
        student_id=student1_profile.id,
        subject_name="Operating Systems",
        score=8,
        total_questions=10,
        difficulty_level="Medium",
        week_number=3,
        date=datetime.utcnow() - timedelta(days=2)
    )
    db.session.add_all([quiz1, quiz2, quiz3])

    # 8. Notifications
    n1 = Notification(
        user_id=student1_user.id,
        title="IA Marksheet Processed",
        message="Your IA-1 marksheet has been analyzed. 2 Weak subjects identified.",
        type="warning"
    )
    n2 = Notification(
        user_id=student1_user.id,
        title="New Study Plan Ready",
        message="Gemini AI generated your personalized 6-week revision roadmap.",
        type="success"
    )
    n3 = Notification(
        user_id=teacher_user.id,
        title="Student Intervention Alert",
        message="Rahul Sharma flagged for Moderate Risk in Data Structures & Networks.",
        type="info"
    )
    db.session.add_all([n1, n2, n3])

    # 9. Messages (Chat)
    m1 = Message(
        sender_id=teacher_user.id,
        receiver_id=student1_user.id,
        sender_name="Dr. Aris Thorne",
        content="Hi Rahul, I noticed your IA marks in Data Structures (31/50). Have you reviewed the tree traversal practice questions on LearnSphere?",
        is_doubt=False
    )
    m2 = Message(
        sender_id=student1_user.id,
        receiver_id=teacher_user.id,
        sender_name="Rahul Sharma",
        content="Hello Professor! Yes, I am following the Gemini AI daily plan and attempted the Week 3 adaptive quiz today.",
        is_doubt=True
    )
    db.session.add_all([m1, m2])

    # 10. Teacher Feedback
    fb = TeacherFeedback(
        teacher_id=teacher_profile.id,
        student_id=student1_profile.id,
        feedback_text="Focus on step-by-step memory allocation and graph algorithms. Your database scores are top-tier!",
        category="Study Advice"
    )
    db.session.add(fb)

    db.session.commit()
    print("Database seeded successfully with LearnSphere AI dataset!")
