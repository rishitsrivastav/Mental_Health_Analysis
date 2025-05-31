import json
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import re

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')

class MentalHealthAnalyzer:
    def __init__(self):
        # Initialize DistilBERT tokenizer and model
        self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = DistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased-finetuned-sst-2-english')
        self.scaler = MinMaxScaler()
        
        self.emotional_keywords = {
            'negative': ['stress', 'anxiety', 'depression', 'worried', 'sad', 'angry', 'tired', 'overwhelmed',
                        'lonely', 'afraid', 'hopeless', 'exhausted', 'frustrated', 'upset', 'confused'],
            'positive': ['happy', 'joy', 'excited', 'peaceful', 'calm', 'relaxed', 'grateful', 'confident',
                        'motivated', 'optimistic', 'energetic', 'loved', 'supported', 'content', 'hopeful']
        }
        self.improvement_tips = {
            'Stable': [
                "Keep up your positive mindset by practicing daily gratitude",
                "Share your successful coping strategies with others who might benefit",
                "Set new personal growth goals to maintain your momentum"
            ],
            'Mild Stress': [
                "Try a 5-minute mindfulness meditation before starting your day",
                "Take regular breaks during work to stretch and breathe deeply",
                "Create a calming evening routine to improve sleep quality"
            ],
            'High Stress': [
                "Consider talking to a trusted friend or family member about your feelings",
                "Break down overwhelming tasks into smaller, manageable steps",
                "Schedule dedicated time for activities that bring you joy and relaxation"
            ],
            'Critical': [
                "Reach out to a mental health professional for support and guidance",
                "Practice grounding techniques when feeling overwhelmed (5-4-3-2-1 method)",
                "Establish a daily routine to create stability and structure"
            ]
        }

    def load_responses(self, filename='user_chat_log.json'):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return data
        except FileNotFoundError:
            print(f"Error: {filename} not found")
            return None
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON format in {filename}")
            return None

    def extract_emotional_keywords(self, text):
        tokens = word_tokenize(text.lower())
        emotional_words = {
            'negative': [word for word in tokens if word in self.emotional_keywords['negative']],
            'positive': [word for word in tokens if word in self.emotional_keywords['positive']]
        }
        return emotional_words

    def analyze_sentiment(self, text):
        # Tokenize and prepare input
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        
        # Get model outputs
        with torch.no_grad():
            outputs = self.model(**inputs)
            predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        # Convert predictions to numpy for easier handling
        scores = predictions.numpy()[0]
        
        # Calculate sentiment scores (pos, neu, neg)
        # DistilBERT gives binary classification (positive/negative)
        # We'll derive neutral sentiment from the confidence scores
        pos_score = float(scores[1])
        neg_score = float(scores[0])
        neu_score = 1.0 - abs(pos_score - neg_score)  # Higher uncertainty = more neutral
        
        # Normalize scores to sum to 1
        total = pos_score + neg_score + neu_score
        sentiment_scores = {
            'pos': pos_score / total,
            'neg': neg_score / total,
            'neu': neu_score / total,
            'compound': pos_score - neg_score  # Range: [-1, 1]
        }
        
        return sentiment_scores

    def analyze_text_patterns(self, text):
        patterns = {
            'exclamation_count': len(re.findall(r'!+', text)),
            'question_count': len(re.findall(r'\?+', text)),
            'ellipsis_count': len(re.findall(r'\.{3,}', text)),
            'uppercase_ratio': sum(1 for c in text if c.isupper()) / len(text) if text else 0,
            'sentence_count': len(sent_tokenize(text)),
            'word_count': len(word_tokenize(text))
        }
        return patterns

    def determine_stress_level(self, analysis_results):
        # Initialize scoring system with weighted components
        stress_score = 0
        
        # Analyze sentiment scores (40% weight)
        compound_score = analysis_results['sentiment']['compound']
        sentiment_weight = 0.4
        if compound_score <= -0.5:
            stress_score += 3 * sentiment_weight
        elif compound_score <= -0.2:
            stress_score += 2 * sentiment_weight
        elif compound_score < 0:
            stress_score += 1 * sentiment_weight

        # Analyze emotional keywords (40% weight)
        keyword_weight = 0.4
        negative_words = len(analysis_results['emotional_keywords']['negative'])
        positive_words = len(analysis_results['emotional_keywords']['positive'])
        keyword_ratio = negative_words / (positive_words + 1)  # Add 1 to avoid division by zero
        
        if keyword_ratio > 2:
            stress_score += 3 * keyword_weight
        elif keyword_ratio > 1:
            stress_score += 2 * keyword_weight
        elif keyword_ratio > 0.5:
            stress_score += 1 * keyword_weight

        # Analyze text patterns (20% weight)
        pattern_weight = 0.2
        patterns = analysis_results['text_patterns']
        if patterns['exclamation_count'] > 5 or patterns['uppercase_ratio'] > 0.3:
            stress_score += 1 * pattern_weight
        if patterns['ellipsis_count'] > 3:
            stress_score += 1 * pattern_weight

        # Normalize stress score to 0-10 range
        normalized_score = min(stress_score * 10 / (3 * (sentiment_weight + keyword_weight + pattern_weight)), 10)

        # Determine stress level based on normalized score
        if normalized_score >= 7:
            return 'Critical'
        elif normalized_score >= 5:
            return 'High Stress'
        elif normalized_score >= 3:
            return 'Mild Stress'
        else:
            return 'Stable'

    def get_improvement_tips(self, stress_level):
        return self.improvement_tips.get(stress_level, self.improvement_tips['Stable'])

    def analyze_responses(self):
        responses = self.load_responses()
        if not responses:
            return None

        # Combine all responses into one text for overall analysis
        combined_text = ' '.join(str(value) for value in responses.values())

        # Perform various analyses
        analysis_results = {
            'emotional_keywords': self.extract_emotional_keywords(combined_text),
            'sentiment': self.analyze_sentiment(combined_text),
            'text_patterns': self.analyze_text_patterns(combined_text)
        }

        # Determine overall stress level
        stress_level = self.determine_stress_level(analysis_results)
        
        # Get improvement tips
        improvement_tips = self.get_improvement_tips(stress_level)

        return {
            'stress_level': stress_level,
            'improvement_tips': improvement_tips,
            'analysis_details': analysis_results
        }

def main():
    analyzer = MentalHealthAnalyzer()
    results = analyzer.analyze_responses()
    
    if results:
        print("\n=== Mental Health Analysis Results ===")
        print(f"\nOverall Status: {results['stress_level']}")
        print("\nRecommended Improvements:")
        for i, tip in enumerate(results['improvement_tips'], 1):
            print(f"{i}. {tip}")
        print("\nAnalysis Details:")
        print(f"Sentiment Scores: {results['analysis_details']['sentiment']}")
        print("\nEmotional Keywords Found:")
        print(f"Positive: {', '.join(results['analysis_details']['emotional_keywords']['positive'])}")
        print(f"Negative: {', '.join(results['analysis_details']['emotional_keywords']['negative'])}")
        print("\nText Pattern Analysis:")
        for pattern, value in results['analysis_details']['text_patterns'].items():
            print(f"{pattern.replace('_', ' ').title()}: {value}")

if __name__ == "__main__":
    main()