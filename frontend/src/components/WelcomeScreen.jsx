import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code, Zap, Lightbulb } from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: <Code className="w-5 h-5 text-blue-400" />,
    title: "Write a React hook",
    prompt: "Write a custom React hook that manages local storage with state synchronization across tabs."
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    title: "Explain Quantum Computing",
    prompt: "Explain quantum computing in simple terms suitable for a 10-year-old."
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-green-400" />,
    title: "Brainstorm app ideas",
    prompt: "Brainstorm 3 innovative SaaS app ideas that utilize AI to solve problems for remote teams."
  },
  {
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    title: "Write a sci-fi story",
    prompt: "Write a short sci-fi story about a robot who discovers they can dream."
  }
];

const WelcomeScreen = ({ onSelectSuggestion }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 w-full max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          How can I help you today?
        </h1>
        <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
          I'm an advanced AI assistant powered by Groq. I can write code, brainstorm ideas, answer complex questions, and more.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
      >
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectSuggestion(s.prompt)}
            className="group flex flex-col items-start p-5 rounded-2xl bg-[#1A1D27] border border-white/5 hover:border-indigo-500/50 hover:bg-[#1E212D] transition-all duration-300 text-left"
          >
            <div className="mb-3 p-2 bg-black/30 rounded-lg group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <h3 className="font-semibold text-gray-200 mb-1">{s.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{s.prompt}</p>
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
