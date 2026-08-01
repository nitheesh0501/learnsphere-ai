from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config.config import Config
from app.database.db import db
from app.routes.auth_routes import auth_bp
from app.routes.student_routes import student_bp
from app.routes.teacher_routes import teacher_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    JWTManager(app)
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(student_bp, url_prefix='/api/student')
    app.register_blueprint(teacher_bp, url_prefix='/api/teacher')

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "LearnSphere AI Backend API",
            "version": "2.4.0"
        }), 200

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    print("🚀 Starting LearnSphere AI Flask REST API on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
