import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, CalendarIcon, CheckCircle } from 'lucide-react';
import Calendar from './Calendar';
import TimeSlots from './TimeSlots';

interface DoctorProps {
  name: string;
  degree: string;
  specialty: string;
  experience: number;
  fee: number;
  image: string;
}

const DoctorCard: React.FC<DoctorProps> = ({ name, degree, specialty, experience, fee, image }) => {
  const [isBooked, setIsBooked] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setShowCalendar(false);
      setSelectedDate(null);
      setSelectedTime(null);
    }, 3000);
  };

  const handleBooking = () => {
    setShowCalendar(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-xl font-semibold">{name}</h3>
          <p className="text-white/90 text-sm">{degree}</p>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Stethoscope className="w-5 h-5" />
          <span>{specialty}</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">{experience}</span> years of experience
          </p>
          <p className="text-gray-600">
            Consultation fee: <span className="font-medium">${fee}</span>
          </p>
        </div>

        {!showCalendar && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBooking}
            disabled={isBooked}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              isBooked
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isBooked ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Appointment Booked!
              </>
            ) : (
              <>
                <CalendarIcon className="w-5 h-5" />
                Book Appointment
              </>
            )}
          </motion.button>
        )}

        <Calendar
          isVisible={showCalendar}
          onDateSelect={handleDateSelect}
        />

        <TimeSlots
          isVisible={showCalendar && selectedDate !== null}
          selectedDate={selectedDate}
          onTimeSelect={handleTimeSelect}
        />
      </div>
    </motion.div>
  );
};

export default DoctorCard;