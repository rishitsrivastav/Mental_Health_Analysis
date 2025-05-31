import json
from datetime import datetime

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

def run_chatbot():
    print("Welcome to the ChatBot!")
    print("I'll be asking you a series of questions. Please answer honestly, and take your time.\n")
    
    # Dictionary to store responses
    responses = {}
    
    # Get current timestamp
    timestamp = datetime.now().isoformat()
    responses['timestamp'] = timestamp
    
    # Ask questions and collect responses
    for i, question in enumerate(questions, 1):
        print(f"Question {i}: {question}")
        answer = input("Your answer: ")
        responses[question] = answer
        print()  # Empty line for better readability
    
    # Save responses to JSON file
    try:
        with open('user_chat_log.json', 'w', encoding='utf-8') as f:
            json.dump(responses, f, indent=2, ensure_ascii=False)
        print("Thank you for sharing your thoughts!")
        print("Your responses have been saved to 'user_chat_log.json'")
    except Exception as e:
        print(f"Error saving responses: {e}")

if __name__ == "__main__":
    run_chatbot()