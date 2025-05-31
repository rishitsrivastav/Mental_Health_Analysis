import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, LogIn, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

function LoginPage() {
  const navigate = useNavigate();

  const handleUserSelect = (type: 'user' | 'doctor' | 'guest') => {
    switch (type) {
      case 'user':
        navigate('/user-registration');
        break;
      case 'doctor':
        navigate('/doctor-registration');
        break;
      case 'guest':
        navigate('/chat');
        break;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_65%,_#e0f2fe_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_transparent_65%,_#dcfce7_100%)]" />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
            >
              <Heart className="w-10 h-10 text-blue-600" />
            </motion.div>
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2"
            >
              Welcome to MindCare
            </motion.h1>
            <p className="text-gray-600">Your Mental Health Companion</p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect('user')}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Login as Patient</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect('doctor')}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              <Stethoscope className="w-5 h-5" />
              <span className="font-medium">Login as Healthcare Provider</span>
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleUserSelect('guest')}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300 bg-white/50 backdrop-blur-sm py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-300"
            >
              <LogIn className="w-4 h-4" />
              <span>Continue as Guest</span>
            </motion.button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Your privacy and security are our top priorities</p>
            <div className="space-x-1 mt-2">
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              <span>and</span>
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;