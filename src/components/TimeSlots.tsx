import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Calendar } from 'lucide-react';

interface TimeSlotsProps {
  isVisible: boolean;
  onTimeSelect: (time: string) => void;
  selectedDate: Date | null;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ isVisible, onTimeSelect, selectedDate }) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const timeSlots = [
    { time: '9:00 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '1:00 PM', available: false },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: false },
    { time: '4:00 PM', available: true }
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedTime) {
      setShowConfirmation(true);
      setTimeout(() => {
        onTimeSelect(selectedTime);
        setShowConfirmation(false);
        setSelectedTime(null);
      }, 2000);
    }
  };

  if (!selectedDate) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 relative"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Available Time Slots
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map(({ time, available }) => (
              <motion.button
                key={time}
                whileHover={available ? { scale: 1.05 } : undefined}
                whileTap={available ? { scale: 0.95 } : undefined}
                onClick={() => available && handleTimeSelect(time)}
                disabled={!available}
                className={`
                  py-3 px-4 rounded-lg border transition-all
                  flex items-center justify-center gap-2
                  ${available 
                    ? selectedTime === time
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'hover:border-blue-500 hover:text-blue-500'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {time}
              </motion.button>
            ))}
          </div>

          {selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <button
                onClick={handleConfirm}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Confirm Appointment
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  className="bg-white rounded-xl p-6 shadow-2xl max-w-sm mx-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Appointment Confirmed!</h3>
                  <p className="text-gray-600">
                    Your appointment is scheduled for {selectedDate.toLocaleDateString()} at {selectedTime}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimeSlots;