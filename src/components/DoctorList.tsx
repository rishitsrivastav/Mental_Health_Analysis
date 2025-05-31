import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorCard from './DoctorCard';

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    degree: "MD, Psychiatry",
    specialty: "Clinical Psychology",
    experience: 12,
    fee: 150,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Dr. Michael Chen",
    degree: "PhD, Psychology",
    specialty: "Cognitive Behavioral Therapy",
    experience: 8,
    fee: 130,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Dr. Emily Rodriguez",
    degree: "MD, Psychiatry",
    specialty: "Anxiety & Depression",
    experience: 15,
    fee: 170,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Dr. James Wilson",
    degree: "PsyD, Psychology",
    specialty: "Trauma Therapy",
    experience: 10,
    fee: 140,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "Dr. Lisa Thompson",
    degree: "MD, Psychiatry",
    specialty: "Mood Disorders",
    experience: 14,
    fee: 160,
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=500"
  }
];

interface DoctorListProps {
  isVisible: boolean;
}

const DoctorList: React.FC<DoctorListProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DoctorCard {...doctor} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoctorList;