import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code, Compass, Lightbulb, PenTool } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: <Code className="w-5 h-5 text-[#4b90ff]" />,
    title: "Write a React hook",
    prompt: "Write a custom React hook that manages local storage with state synchronization across tabs."
  },
  {
    icon: <Compass className="w-5 h-5 text-[#ff5546]" />,
    title: "Explain Quantum Computing",
    prompt: "Explain quantum computing in simple terms suitable for a 10-year-old."
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-[#9106ff]" />,
    title: "Brainstorm app ideas",
    prompt: "Brainstorm 3 innovative SaaS app ideas that utilize AI to solve problems for remote teams."
  },
  {
    icon: <PenTool className="w-5 h-5 text-[#10b981]" />,
    title: "Write a sci-fi story",
    prompt: "Write a short sci-fi story about a robot who discovers they can dream."
  }
];

const WelcomeScreen = ({ onSelectSuggestion }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full max-w-4xl mx-auto text-left py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full mb-10"
      >
        {/* Gemini Style Gradient Title */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-3 leading-tight">
          <span className="bg-gradient-to-r from-[#4b90ff] via-[#9106ff] to-[#ff5546] bg-clip-text text-transparent bg-[length:200%_auto] animate-[pulse_6s_infinite] inline-block">
            Hello, Friend
          </span>
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/50 mb-6">
          How can I help you today?
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
          I'm K-Hub Bot, your intelligent partner. Ask me anything, generate creative text, build complex code, or analyze complex data sets.
        </p>
      </motion.div>

      {/* Sleek Suggestion Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
      >
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectSuggestion(s.prompt)}
            className="group flex flex-col justify-between p-5 rounded-2xl bg-[#171923]/50 border border-white/[0.03] hover:border-white/10 hover:bg-[#1C1F2E]/60 transition-all duration-300 text-left min-h-[170px] shadow-lg relative overflow-hidden"
          >
            {/* Ambient hover light effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <h3 className="font-medium text-[15px] text-gray-200 leading-snug group-hover:text-white transition-colors relative z-10">
              {s.prompt}
            </h3>
            
            <div className="mt-4 flex items-center justify-between relative z-10">
              <span className="text-[12px] font-semibold text-gray-500 group-hover:text-gray-400 transition-colors uppercase tracking-wider">
                {s.title}
              </span>
              <div className="p-2.5 bg-[#0F111A] rounded-xl border border-white/5 text-gray-400 group-hover:scale-110 group-hover:text-white group-hover:border-white/10 transition-all duration-300">
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
