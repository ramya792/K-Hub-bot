import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 w-full max-w-2xl mx-auto text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full mb-8 flex flex-col items-center"
      >
        {/* Subtle Brand Logo/Icon */}
        <div className="w-12 h-12 rounded-full bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6" />
        </div>
        
        <h1 className="text-3xl font-semibold tracking-tight text-text-main mb-6">
          What's on your mind today?
        </h1>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
