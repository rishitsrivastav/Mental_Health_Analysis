import readlineSync from 'readline-sync';
import fs from 'fs';

const questions = [
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
];

console.log("Welcome to the ChatBot!");
console.log("I'll be asking you a series of questions. Please answer honestly, and take your time.\n");

const responses = {};

for (let i = 0; i < questions.length; i++) {
  const question = questions[i];
  console.log(`Question ${i + 1}: ${question}`);
  const answer = readlineSync.question('Your answer: ');
  responses[question] = answer;
  console.log(); // Empty line for better readability
}

console.log("Thank you for sharing your thoughts!");
console.log("Saving your responses...");

// Save responses to JSON file
fs.writeFileSync('user_chat_log.json', JSON.stringify(responses, null, 2));

console.log("Your responses have been saved to 'user_chat_log.json'");