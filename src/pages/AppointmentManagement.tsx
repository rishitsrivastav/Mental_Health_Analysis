import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, Clock, Trash2, RefreshCw, AlertCircle, X, Check, Bell } from 'lucide-react';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';

interface Appointment {
  id: string;
  patientName: string;
  age: number;
  phoneNumber: string;
  mentalState: 'Stress' | 'Happy' | 'Anxious' | 'Calm';
  bookingDate: string;
  slotTiming: string;
}

const initialAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    age: 28,
    phoneNumber: '+91 98765 43210',
    mentalState: 'Stress',
    bookingDate: '15/03/2024',
    slotTiming: '10:00 AM - 11:00 AM'
  },
  {
    id: '2',
    patientName: 'Sarah Smith',
    age: 32,
    phoneNumber: '+91 98765 43211',
    mentalState: 'Happy',
    bookingDate: '15/03/2024',
    slotTiming: '11:00 AM - 12:00 PM'
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    age: 45,
    phoneNumber: '+91 98765 43212',
    mentalState: 'Anxious',
    bookingDate: '16/03/2024',
    slotTiming: '2:00 PM - 3:00 PM'
  },
  {
    id: '4',
    patientName: 'Emily Brown',
    age: 29,
    phoneNumber: '+91 98765 43213',
    mentalState: 'Calm',
    bookingDate: '16/03/2024',
    slotTiming: '3:00 PM - 4:00 PM'
  },
  {
    id: '5',
    patientName: 'David Wilson',
    age: 35,
    phoneNumber: '+91 98765 43214',
    mentalState: 'Stress',
    bookingDate: '17/03/2024',
    slotTiming: '9:00 AM - 10:00 AM'
  }
];

const getMentalStateColor = (state: Appointment['mentalState']) => {
  switch (state) {
    case 'Happy':
      return 'text-green-500 bg-green-50';
    case 'Calm':
      return 'text-blue-500 bg-blue-50';
    case 'Stress':
      return 'text-orange-500 bg-orange-50';
    case 'Anxious':
      return 'text-red-500 bg-red-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
};

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteConfirmation(true);
  };

  const confirmReschedule = () => {
    if (selectedAppointment && selectedDate && selectedTime) {
      const date = selectedDate.toLocaleDateString('en-GB');
      setAppointments(appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, bookingDate: date, slotTiming: selectedTime }
          : apt
      ));
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter(apt => apt.id !== selectedAppointment.id));
      setShowDeleteConfirmation(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_65%,_#e0f2fe_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_transparent_65%,_#dcfce7_100%)]" />

      <div className="relative min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">Appointment Management</h1>
              <p className="text-gray-600">Manage your patient appointments efficiently</p>
            </div>
            
            <div className="relative">
              <div className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              {showNotification && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-50 border border-gray-100"
                >
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">1 new patient added</span>
                  </div>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{appointment.patientName}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMentalStateColor(appointment.mentalState)}`}>
                    {appointment.mentalState}
                  </span>
                </div>

                <div className="space-y-3 text-gray-600">
                  <p>Age: {appointment.age} years</p>
                  <p>Phone: {appointment.phoneNumber}</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-blue-500" />
                    <span>{appointment.bookingDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{appointment.slotTiming}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReschedule(appointment)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reschedule
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(appointment)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showRescheduleModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Reschedule Appointment</h3>
                    <button
                      onClick={() => setShowRescheduleModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <Calendar
                    isVisible={true}
                    onDateSelect={setSelectedDate}
                  />

                  <TimeSlots
                    isVisible={true}
                    selectedDate={selectedDate}
                    onTimeSelect={setSelectedTime}
                  />

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={confirmReschedule}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setShowRescheduleModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteConfirmation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4 text-red-500">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-xl font-semibold">Delete Appointment</h3>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this appointment? This action cannot be undone.
                  </p>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmDelete}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Confirm
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteConfirmation(false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;