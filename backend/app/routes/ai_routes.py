from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.ai.gemini_engine import gemini_engine

ai_bp = Blueprint('ai', __name__, url_prefix='/api/ai')

@ai_bp.route('/flashcards', methods=['POST'])
@jwt_required()
def get_ai_flashcards():
    data = request.get_json() or {}
    subject = data.get('subject_name', 'Data Structures')
    cards = gemini_engine.generate_flashcards(subject)
    return jsonify(cards), 200

@ai_bp.route('/ask', methods=['POST'])
@jwt_required()
def ask_gemini():
    data = request.get_json() or {}
    prompt = data.get('prompt', '')
    context = data.get('context', '')
    response_text = gemini_engine.chat_doubt_solver(prompt, context)
    return jsonify({'response': response_text}), 200
