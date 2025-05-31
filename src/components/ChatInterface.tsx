import React, { useState, useRef, useEffect } from 'react';
import { Bot, AlertTriangle, CheckCircle, AlertCircle, Lightbulb, Brain, MessageSquare, UserPlus, X, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorList from './DoctorList';
import UserProfileDrawer from './UserProfileDrawer';

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatLog {
  [key: string]: string;
}

interface AnalysisResults {
  stress_level: string;
  improvement_tips: string[];
  analysis_details: {
    sentiment: {
      compound: number;
      pos: number;
      neu: number;
      neg: number;
    };
    emotional_keywords: {
      positive: string[];
      negative: string[];
    };
    text_patterns: {
      exclamation_count: number;
      question_count: number;
      ellipsis_count: number;
      uppercase_ratio: number;
      sentence_count: number;
      word_count: number;
    };
  };
}

interface ChatInterfaceProps {
  userType: 'user' | 'doctor' | 'guest';
}

function ChatInterface({ userType }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [chatLog, setChatLog] = useState<ChatLog>({});
  const [isComplete, setIsComplete] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [showDoctorPrompt, setShowDoctorPrompt] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/questions`)
    fetch(`${import.meta.env.VITE_API_URL}/api/save-response`)
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        setMessages([
          { text: `Welcome ${userType}! I'll be asking you a series of questions. Please answer honestly, and take your time. Let's begin with the first question:`, isBot: true },
          { text: data[0], isBot: true }
        ]);
      })
      .catch(error => console.error('Error fetching questions:', error));
  }, [userType]);

  useEffect(() => {
    if (analysis && !showChat && !promptDismissed) {
      setShowDoctorPrompt(true);
    }
  }, [analysis, showChat, promptDismissed]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getStressLevelColor = (level: string) => {
    switch (level) {
      case 'Stable':
        return 'text-green-500';
      case 'Mild Stress':
        return 'text-yellow-500';
      case 'High Stress':
        return 'text-orange-500';
      case 'Critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStressLevelIcon = (level: string) => {
    switch (level) {
      case 'Stable':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'Mild Stress':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      case 'High Stress':
        return <AlertCircle className="w-8 h-8 text-orange-500" />;
      case 'Critical':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);
    
    const updatedChatLog = {
      ...chatLog,
      [questions[currentQuestion]]: input
    };
    setChatLog(updatedChatLog);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: questions[nextQuestion], isBot: true }]);
        setCurrentQuestion(nextQuestion);
      }, 1000);
    } else if (!isComplete) {
      try {
        const response = await fetch('http://localhost:5000/api/save-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedChatLog),
        });

        if (!response.ok) {
          throw new Error('Failed to save responses');
        }

        const data = await response.json();
        setAnalysis(data.analysis);
        setShowChat(false);

        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              text: "Thank you for sharing your thoughts. I've analyzed your responses and prepared some personalized recommendations for you.",
              isBot: true
            }
          ]);
          setIsComplete(true);
        }, 1000);
      } catch (error) {
        console.error('Error saving responses:', error);
      }
    }

    setInput('');
  };

  const handleDoctorResponse = (wantsDoctors: boolean) => {
    setShowDoctors(wantsDoctors);
    setShowDoctorPrompt(false);
    setPromptDismissed(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_65%,_#e0f2fe_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_transparent_65%,_#dcfce7_100%)]" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[800px] bg-white/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden flex flex-col" style={{ height: '80vh' }}>
          {/* Header */}
          <div className="p-4 border-b bg-white/90 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Mental Health Assessment</h1>
            </div>
            {userType === 'user' && (
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <UserCircle className="w-6 h-6 text-blue-500" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            {showChat ? (
              // Chat Interface
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isBot
                            ? 'bg-gray-100'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t bg-white/90 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            ) : analysis ? (
              // Results View
              <div className="h-full overflow-y-auto p-6 space-y-8">
                {/* Status Section */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {getStressLevelIcon(analysis.stress_level)}
                    <h2 className={`text-2xl font-bold ${getStressLevelColor(analysis.stress_level)}`}>
                      {analysis.stress_level}
                    </h2>
                  </div>
                </div>

                {/* Recommendations Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    Recommended Steps
                  </h3>
                  <div className="space-y-3">
                    {analysis.improvement_tips.map((tip, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analysis Section */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-blue-500" />
                    Detailed Analysis
                  </h3>

                  {/* Sentiment Analysis */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Emotional Balance</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Positive</span>
                          <span>{(analysis.analysis_details.sentiment.pos * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${analysis.analysis_details.sentiment.pos * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Neutral</span>
                          <span>{(analysis.analysis_details.sentiment.neu * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{ width: `${analysis.analysis_details.sentiment.neu * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Negative</span>
                          <span>{(analysis.analysis_details.sentiment.neg * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${analysis.analysis_details.sentiment.neg * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emotional Keywords */}
                  <div>
                    <h4 className="font-medium mb-3">Expressed Emotions</h4>
                    <div className="grid gap-4">
                      <div className="p-4 bg-white rounded-lg border border-gray-100">
                        <div className="text-green-600 font-medium mb-2">
                          Positive Expressions ({analysis.analysis_details.emotional_keywords.positive.length})
                        </div>
                        <div className="text-sm text-gray-600">
                          {analysis.analysis_details.emotional_keywords.positive.join(', ') || 'None detected'}
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-gray-100">
                        <div className="text-red-600 font-medium mb-2">
                          Concerning Expressions ({analysis.analysis_details.emotional_keywords.negative.length})
                        </div>
                        <div className="text-sm text-gray-600">
                          {analysis.analysis_details.emotional_keywords.negative.join(', ') || 'None detected'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Consultation Prompt */}
                <AnimatePresence>
                  {showDoctorPrompt && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-100 relative shadow-lg"
                    >
                      <button
                        onClick={() => setShowDoctorPrompt(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold text-blue-900">Would you like to consult a Doctor?</h3>
                        <div className="flex justify-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDoctorResponse(true)}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Yes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDoctorResponse(false)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            No
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Doctor List */}
                <DoctorList isVisible={showDoctors} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* User Profile Drawer */}
      <UserProfileDrawer isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}

export default ChatInterface;