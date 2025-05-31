import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

type UserType = 'user' | 'doctor';

function ExistingUserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('user');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would verify credentials here
      if (userType === 'user') {
        navigate('/chat');
      } else {
        navigate('/appointments');
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1638202993928-7d113b8e4538?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_65%,_#e0f2fe_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_transparent_65%,_#dcfce7_100%)]" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                Login As
              </label>
              <div className="relative">
                <select
                  id="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as UserType)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm appearance-none"
                >
                  <option value="user">Patient</option>
                  <option value="doctor">Healthcare Provider</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm`}
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default ExistingUserLogin;