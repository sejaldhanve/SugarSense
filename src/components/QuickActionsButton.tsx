import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, X, Activity, Brain, Pill, BarChart3 } from 'lucide-react';
import QuickActionsModal from './QuickActionsModal';

const QuickActionsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
        aria-label="Open Quick Actions"
      >
        <Repeat className="w-4 h-4" />
        Quick Actions
      </motion.button>

      <QuickActionsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default QuickActionsButton;