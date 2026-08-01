from datetime import datetime
from app.database.db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='student')
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    student_code = db.Column(db.String(50), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    gpa = db.Column(db.Float, default=3.82)
    user = db.relationship('User', backref=db.backref('student_profile', uselist=False))

class Teacher(db.Model):
    __tablename__ = 'teachers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    user = db.relationship('User', backref=db.backref('teacher_profile', uselist=False))

class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    internal_marks = db.Column(db.Float, nullable=False) # Out of 50
    exam_marks = db.Column(db.Float, default=0)
    credits = db.Column(db.Integer, default=3)
    risk_status = db.Column(db.String(50), nullable=False) # Strong (>40), Medium (35-40), Weak (<35)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

class StudyPlan(db.Model):
    __tablename__ = 'study_plans'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    week_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), nullable=False) # Done, Current, Upcoming
    pacing_hours = db.Column(db.Integer, default=6)

class Recommendation(db.Model):
    __tablename__ = 'recommendations'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    priority = db.Column(db.String(50), nullable=False) # High, Medium, Maintenance
    description = db.Column(db.Text, nullable=False)
    time_estimate = db.Column(db.String(50), nullable=False)
    action_text = db.Column(db.String(100), nullable=False)

class Intervention(db.Model):
    __tablename__ = 'interventions'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id', ondelete='CASCADE'), nullable=True)
    subject_name = db.Column(db.String(150), nullable=False)
    internal_score = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='Flagged') # Flagged -> Nudge Sent -> Resolved
    notes = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
