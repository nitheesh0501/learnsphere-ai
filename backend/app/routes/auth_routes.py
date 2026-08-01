from flask import Blueprint, request, jsonify
from app.database.db import db
from app.models.models import User, Student, Teacher
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'student')

    if not email or not password or not name:
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    user = User(email=email, name=name, role=role)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    if role == 'student':
        student = Student(user_id=user.id, student_code=f"STU-{user.id:04d}", department="CSE", semester=4)
        db.session.add(student)
    else:
        teacher = Teacher(user_id=user.id, department="CSE", title="Assistant Professor")
        db.session.add(teacher)

    db.session.commit()

    access_token = create_access_token(identity={"id": user.id, "role": user.role, "email": user.email, "name": user.name})
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity={"id": user.id, "role": user.role, "email": user.email, "name": user.name})
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}
    }), 200
