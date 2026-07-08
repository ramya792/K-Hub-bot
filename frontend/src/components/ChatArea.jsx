import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';
import { Send, CornerDownLeft, Loader2, Mic, MicOff, Square, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', desc: 'Powerful & versatile' },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1', desc: 'Advanced reasoning' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', desc: 'Ultra-fast response' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', desc: 'High context window' }
];

const ChatArea = () => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    isTyping, 
    error, 
    selectedModel, 
    setSelectedModel, 
    stopGenerating 
  } = useChat();

  const [input, setInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const dropdownRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle outside click for model dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Set up speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => (prev ? prev + ' ' : '') + transcript);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
              textareaRef.current.focus();
            }
          }, 50);
        };
        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Try Google Chrome or Microsoft Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (input.trim() && !isTyping) {
      sendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  return (
    <div className="flex flex-col h-full bg-[#0B0D12] relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto w-full">
        {isLoading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelectSuggestion={(prompt) => {
            setInput(prompt);
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 0);
          }} />
        ) : (
          <div className="pb-36 pt-6 flex flex-col w-full">
            {messages.map((msg, index) => (
              <MessageBubble 
                key={msg._id || index} 
                message={msg} 
                isLast={index === messages.length - 1} 
              />
            ))}
            {isTyping && (
              <div className="w-full max-w-4xl mx-auto px-4 md:px-0 mt-4">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/95 to-transparent pt-12 pb-6 px-4">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[32px] opacity-10 group-focus-within:opacity-25 transition duration-500 blur pointer-events-none"></div>
          {error && (
            <div className="relative mb-3 p-3 bg-red-950/80 border border-red-500/30 text-red-200 text-sm rounded-xl text-center shadow-lg animate-fade-in">
              {error}
            </div>
          )}
          
          <form 
            onSubmit={handleSend}
            className="relative flex items-end gap-2 bg-[#1E2030]/90 backdrop-blur-md rounded-[28px] border border-white/[0.06] p-2.5 pl-6 pr-2 shadow-2xl transition-all duration-300 focus-within:border-white/10"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message K-Hub Bot..."
              className="w-full max-h-[200px] bg-transparent text-gray-100 placeholder-gray-500 border-none outline-none resize-none py-3 pr-24 focus:ring-0 leading-relaxed text-[15px]"
              rows={1}
            />
            
            <div className="absolute right-3.5 bottom-3 flex items-center gap-2">
              {/* Mic Icon for STT */}
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "p-2.5 rounded-full flex items-center justify-center transition-all duration-200",
                  isListening 
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                )}
                title={isListening ? "Listening... click to stop" : "Use voice input"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Send or Stop button */}
              {isTyping ? (
                <button
                  type="button"
                  onClick={stopGenerating}
                  className="p-2.5 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/15 text-white transition-all duration-200 shadow-md"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-white text-white" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={cn(
                    "p-2.5 rounded-full flex items-center justify-center transition-all duration-200",
                    input.trim()
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                      : "bg-white/5 text-gray-500 cursor-not-allowed"
                  )}
                >
                  <Send className="w-4.5 h-4.5 ml-0.5" />
                </button>
              )}
            </div>
            
            <div className="absolute -top-7 right-4 text-xs text-gray-500 font-medium opacity-0 group-focus-within:opacity-100 transition-opacity flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10"><CornerDownLeft className="w-3 h-3 inline" /></span> to send, 
              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ml-1">Shift</span> + <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</span> for new line
            </div>
          </form>
          <div className="text-center mt-3 text-xs text-gray-500">
            AI can make mistakes. Verify important information.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
