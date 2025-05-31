import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Upload, CheckCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DoctorFormProps {
  onRegisterSuccess: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  degree: string;
  specialty: string;
  experience: string;
  licenseNumber: string;
  certificate: File | null;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  degree?: string;
  specialty?: string;
  experience?: string;
  licenseNumber?: string;
  certificate?: string;
}

function DoctorForm({ onRegisterSuccess }: DoctorFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    password: '',
    degree: '',
    specialty: '',
    experience: '',
    licenseNumber: '',
    certificate: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree is required';
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    } else if (isNaN(Number(formData.experience)) || Number(formData.experience) < 0) {
      newErrors.experience = 'Please enter a valid number of years';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.certificate) {
      newErrors.certificate = 'Certificate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_65%,_#dcfce7_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_transparent_65%,_#e0f2fe_100%)]" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8"
        >
          {showSuccess ? (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Registration Successful!</h2>
              <p className="text-gray-600">Redirecting to appointment management...</p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Doctor Registration</h1>
                <p className="text-gray-600">Please complete your professional profile</p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="Dr. John Doe"
                    />
                    {errors.name && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="doctor@hospital.com"
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.password}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Degree
                    </label>
                    <input
                      type="text"
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.degree ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="MD, MBBS, etc."
                    />
                    {errors.degree && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.degree}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <input
                      type="text"
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.specialty ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="Psychiatry, Psychology, etc."
                    />
                    {errors.specialty && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.specialty}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.experience ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="5"
                    />
                    {errors.experience && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.experience}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm`}
                      placeholder="License number"
                    />
                    {errors.licenseNumber && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.licenseNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Medical Certificate
                  </label>
                  <div
                    onClick={handleFileClick}
                    className={`w-full p-6 border-2 border-dashed ${
                      errors.certificate ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg cursor-pointer hover:border-green-500 transition-colors bg-white/50 backdrop-blur-sm`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div className="text-center">
                        <p className="text-gray-600">Click to upload your medical certificate</p>
                        <p className="text-sm text-gray-500">PDF, JPG, or PNG up to 10MB</p>
                      </div>
                      {formData.certificate && (
                        <p className="text-sm text-green-600 font-medium">
                          Selected: {formData.certificate.name}
                        </p>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="certificate"
                      onChange={handleChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                  </div>
                  {errors.certificate && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.certificate}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
                  >
                    Register as Doctor
                  </motion.button>

                  <div className="text-center">
                    <motion.button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Already registered? Login</span>
                    </motion.button>
                  </div>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default DoctorForm;