import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Bot, AlertTriangle, CheckCircle, AlertCircle, Lightbulb, Brain, User, Stethoscope } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import LoginPage from './pages/LoginPage';
import UserForm from './pages/UserForm';
import DoctorForm from './pages/DoctorForm';
import AppointmentManagement from './pages/AppointmentManagement';
import ExistingUserLogin from './pages/ExistingUserLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/user-registration" element={<UserForm onRegisterSuccess={() => {}} />} />
        <Route path="/doctor-registration" element={<DoctorForm onRegisterSuccess={() => {}} />} />
        <Route path="/chat" element={<ChatInterface userType="user" />} />
        <Route path="/appointments" element={<AppointmentManagement />} />
        <Route path="/login" element={<ExistingUserLogin />} />
      </Routes>
    </Router>
  );
}

export default App;