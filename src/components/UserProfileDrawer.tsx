import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, User, Phone, Mail, Clock, MapPin } from 'lucide-react';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

interface Report {
  id: string;
  title: string;
  date: string;
  doctor: string;
  summary: string;
}

const dummyAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Clinical Psychology',
    date: '2024-03-20',
    time: '10:00 AM',
    location: 'MindCare Clinic, Room 204'
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Cognitive Behavioral Therapy',
    date: '2024-03-25',
    time: '2:30 PM',
    location: 'Wellness Center, Suite 102'
  }
];

const dummyReports: Report[] = [
  {
    id: '1',
    title: 'Initial Consultation Report',
    date: '2024-02-15',
    doctor: 'Dr. Sarah Johnson',
    summary: 'Patient shows mild anxiety symptoms. Recommended weekly therapy sessions and stress management techniques.'
  },
  {
    id: '2',
    title: 'Follow-up Assessment',
    date: '2024-03-01',
    doctor: 'Dr. Michael Chen',
    summary: 'Notable improvement in anxiety levels. Continuing with current treatment plan and adding meditation exercises.'
  }
];

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'appointments' | 'reports'>('appointments');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-semibold">Profile</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Mail className="w-4 h-4" />
                      <span>john@example.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Phone className="w-4 h-4" />
                      <span>+1 234 567 8900</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'appointments'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${
                    activeTab === 'reports'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Past Reports
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'appointments' ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                    {dummyAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                              onClick={() => {/* Handle reschedule */}}
                            >
                              Reschedule
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                              onClick={() => {/* Handle cancel */}}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Reports</h3>
                    {dummyReports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{report.title}</h4>
                            <p className="text-sm text-gray-600">{report.doctor}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{new Date(report.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{report.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfileDrawer;