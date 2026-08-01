from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.database.db import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student') # 'student' or 'teacher'
    name = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    student_profile = db.relationship('Student', backref='user', uselist=False, cascade="all, delete-orphan")
    teacher_profile = db.relationship('Teacher', backref='user', uselist=False, cascade="all, delete-orphan")
    notifications = db.relationship('Notification', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'name': self.name,
            'avatar': self.avatar,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    usn = db.Column(db.String(30), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False, default="Computer Science & Engineering")
    semester = db.Column(db.Integer, nullable=False, default=6)
    target_gpa = db.Column(db.Float, default=8.5)
    
    # Relationships
    marksheets = db.relationship('Marksheet', backref='student', lazy=True)
    subjects = db.relationship('Subject', backref='student', lazy=True)
    quiz_results = db.relationship('QuizResult', backref='student', lazy=True)
    study_plans = db.relationship('StudyPlan', backref='student', lazy=True)
    recommendations = db.relationship('Recommendation', backref='student', lazy=True)
    analytics = db.relationship('Analytics', backref='student', uselist=False, lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.user.name if self.user else '',
            'email': self.user.email if self.user else '',
            'usn': self.usn,
            'department': self.department,
            'semester': self.semester,
            'target_gpa': self.target_gpa
        }

class Teacher(db.Model):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    department = db.Column(db.String(100), nullable=False, default="Computer Science & Engineering")
    designation = db.Column(db.String(100), default="Associate Professor")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.user.name if self.user else '',
            'email': self.user.email if self.user else '',
            'department': self.department,
            'designation': self.designation
        }

class Marksheet(db.Model):
    __tablename__ = 'marksheets'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(30), default='PROCESSED') # 'PENDING', 'PROCESSED', 'FAILED'
    extracted_data = db.Column(db.Text, nullable=True) # JSON string of raw OCR output

    subjects = db.relationship('Subject', backref='marksheet', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'filename': self.filename,
            'file_path': self.file_path,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'status': self.status,
            'subjects': [s.to_dict() for s in self.subjects]
        }

class Subject(db.Model):
    __tablename__ = 'subjects'

    id = db.Column(db.Integer, primary_key=True)
    marksheet_id = db.Column(db.Integer, db.ForeignKey('marksheets.id'), nullable=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    ia_marks = db.Column(db.Float, nullable=False) # Out of 50
    max_marks = db.Column(db.Float, default=50.0)
    status = db.Column(db.String(20), nullable=False) # 'Strong', 'Medium', 'Weak'

    def to_dict(self):
        return {
            'id': self.id,
            'marksheet_id': self.marksheet_id,
            'student_id': self.student_id,
            'name': self.name,
            'ia_marks': self.ia_marks,
            'max_marks': self.max_marks,
            'status': self.status,
            'percentage': round((self.ia_marks / self.max_marks) * 100, 1) if self.max_marks else 0
        }

class QuizQuestion(db.Model):
    __tablename__ = 'quiz_questions'

    id = db.Column(db.Integer, primary_key=True)
    subject_name = db.Column(db.String(100), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    options = db.Column(db.Text, nullable=False) # JSON list string ["A", "B", "C", "D"]
    correct_answer = db.Column(db.String(255), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False) # 'Easy', 'Medium', 'Hard'
    week_number = db.Column(db.Integer, default=1)

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'subject_name': self.subject_name,
            'question_text': self.question_text,
            'options': json.loads(self.options) if self.options else [],
            'correct_answer': self.correct_answer,
            'difficulty': self.difficulty,
            'week_number': self.week_number
        }

class QuizResult(db.Model):
    __tablename__ = 'quiz_results'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    subject_name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    difficulty_level = db.Column(db.String(20), nullable=False) # 'Easy', 'Medium', 'Hard', 'Mixed'
    week_number = db.Column(db.Integer, nullable=False, default=1)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'subject_name': self.subject_name,
            'score': self.score,
            'total_questions': self.total_questions,
            'percentage': round((self.score / self.total_questions) * 100, 1) if self.total_questions else 0,
            'difficulty_level': self.difficulty_level,
            'week_number': self.week_number,
            'date': self.date.isoformat() if self.date else None
        }

class StudyPlan(db.Model):
    __tablename__ = 'study_plans'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    plan_json = db.Column(db.Text, nullable=False) # JSON blob of schedule & goals
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'student_id': self.student_id,
            'plan': json.loads(self.plan_json) if self.plan_json else {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Recommendation(db.Model):
    __tablename__ = 'recommendations'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    gap_data = db.Column(db.Text, nullable=False) # JSON blob of knowledge gaps
    ai_advice = db.Column(db.Text, nullable=False) # JSON blob of AI strategy
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            'id': self.id,
            'student_id': self.student_id,
            'gap_data': json.loads(self.gap_data) if self.gap_data else [],
            'ai_advice': json.loads(self.ai_advice) if self.ai_advice else {},
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Analytics(db.Model):
    __tablename__ = 'analytics'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False, unique=True)
    readiness_score = db.Column(db.Float, default=72.0) # Out of 100
    risk_level = db.Column(db.String(20), default='Moderate') # 'Low', 'Moderate', 'High'
    predicted_gpa = db.Column(db.Float, default=7.8)
    weekly_study_hours = db.Column(db.Float, default=14.5)
    improvement_percentage = db.Column(db.Float, default=18.4)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'readiness_score': self.readiness_score,
            'risk_level': self.risk_level,
            'predicted_gpa': self.predicted_gpa,
            'weekly_study_hours': self.weekly_study_hours,
            'improvement_percentage': self.improvement_percentage,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(30), default='info') # 'info', 'warning', 'success', 'feedback'
    is_read = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # None if AI
    sender_name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_doubt = db.Column(db.Boolean, default=False)
    is_ai = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'sender_name': self.sender_name,
            'content': self.content,
            'is_doubt': self.is_doubt,
            'is_ai': self.is_ai,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

class TeacherFeedback(db.Model):
    __tablename__ = 'teacher_feedback'

    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='Encouragement') # 'Intervention', 'Encouragement', 'Study Advice'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'teacher_id': self.teacher_id,
            'student_id': self.student_id,
            'feedback_text': self.feedback_text,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
