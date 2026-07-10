import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code, Compass, Lightbulb, PenTool } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: <Code className="w-4 h-4 text-indigo-500" />,
    title: "Write a React hook",
    prompt: "Write a custom React hook that manages local storage with state synchronization across tabs."
  },
  {
    icon: <Compass className="w-4 h-4 text-orange-500" />,
    title: "Explain Quantum Computing",
    prompt: "Explain quantum computing in simple terms suitable for a 10-year-old."
  },
  {
    icon: <Lightbulb className="w-4 h-4 text-purple-500" />,
    title: "Brainstorm app ideas",
    prompt: "Brainstorm 3 innovative SaaS app ideas that utilize AI to solve problems for remote teams."
  },
  {
    icon: <PenTool className="w-4 h-4 text-emerald-500" />,
    title: "Write a sci-fi story",
    prompt: "Write a short sci-fi story about a robot who discovers they can dream."
  }
];

const WelcomeScreen = ({ onSelectSuggestion }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 w-full max-w-2xl mx-auto text-center py-12">
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

      {/* Sleek Suggestion Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
      >
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectSuggestion(s.prompt)}
            className="group flex flex-col justify-between p-4 rounded-xl bg-chat-bg border border-border-main hover:bg-hover-bg transition-all duration-200 text-left min-h-[110px]"
          >
            <h3 className="text-sm font-medium text-text-main leading-snug">
              {s.prompt}
            </h3>
            
            <div className="mt-3 flex items-center justify-between w-full">
              <span className="text-[11px] font-medium text-text-muted">
                {s.title}
              </span>
              <div className="p-1.5 rounded-lg bg-hover-bg group-hover:bg-chat-bg border border-transparent group-hover:border-border-main transition-all duration-200">
                {s.icon}
              </div>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
