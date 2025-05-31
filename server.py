from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import json
from datetime import datetime
from nlp_analyzer import MentalHealthAnalyzer

app = Flask(__name__)
CORS(app)

# Predefined questions
questions = [
    "How have you been feeling lately? Can you describe it in a few words?",
    "What's one thing that has been on your mind a lot recently?",
    "Do you often feel stressed or overwhelmed? When does it happen the most?",
    "If you had to describe your mood today in one word, what would it be?",
    "What's something that made you happy or sad in the past week?",
    "Do you find it easy to talk about your feelings with others? Why or why not?",
    "When you're feeling low, what's the first thing you usually do?",
    "What's something you wish people understood about you?",
    "How do you usually handle difficult emotions like sadness or anxiety?",
    "If you could change one thing about your current life, what would it be?"
]

@app.route('/api/questions', methods=['GET'])
def get_questions():
    return jsonify(questions)

@app.route('/api/save-response', methods=['POST'])
def save_response():
    try:
        responses = request.json
        responses['timestamp'] = datetime.now().isoformat()
        
        with open('user_chat_log.json', 'w', encoding='utf-8') as f:
            json.dump(responses, f, indent=2, ensure_ascii=False)
            
        # Perform NLP analysis
        analyzer = MentalHealthAnalyzer()
        analysis_results = analyzer.analyze_responses()
            
        return jsonify({
            "message": "Responses saved successfully",
            "analysis": analysis_results
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)