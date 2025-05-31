import React from 'react';
import { User, Stethoscope, LogIn } from 'lucide-react';

interface LoginPageProps {
  onUserSelect: (type: 'user' | 'doctor' | 'guest') => void;
}

function LoginPage({ onUserSelect }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-gray-600">Mental Health Analysis Portal</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onUserSelect('user')}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Login as User</span>
          </button>

          <button
            onClick={() => onUserSelect('doctor')}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
          >
            <Stethoscope className="w-5 h-5" />
            <span className="font-medium">Login as Doctor</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={() => onUserSelect('guest')}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            <LogIn className="w-4 h-4" />
            <span>Continue as Guest</span>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>By continuing, you agree to our</p>
          <div className="space-x-1">
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            <span>and</span>
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;