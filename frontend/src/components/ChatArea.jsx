import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';
import { Send, CornerDownLeft, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const ChatArea = () => {
  const { messages, sendMessage, isLoading, isTyping, error } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  return (
    <div className="flex flex-col h-full bg-[#0F1117] relative">
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
          <div className="pb-32 pt-6 flex flex-col w-full">
            {messages.map((msg, index) => (
              <MessageBubble key={msg._id || index} message={msg} />
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
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0F1117] via-[#0F1117]/90 to-transparent pt-10 pb-6 px-4">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-focus-within:opacity-50 transition duration-500 blur pointer-events-none"></div>
          {error && (
            <div className="relative mb-3 p-3 bg-red-950/80 border border-red-500/30 text-red-200 text-sm rounded-xl text-center shadow-lg animate-fade-in">
              {error}
            </div>
          )}
          <form 
            onSubmit={handleSend}
            className="relative flex items-end gap-2 bg-[#1A1D27] rounded-2xl border border-white/10 p-2 shadow-2xl"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message K-Hub Bot..."
              className="w-full max-h-[200px] bg-transparent text-white placeholder-gray-500 border-none outline-none resize-none py-3 pl-4 pr-12 rounded-xl focus:ring-0 leading-relaxed"
              rows={1}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "p-2 rounded-xl flex items-center justify-center transition-all duration-200",
                  input.trim() && !isTyping
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    : "bg-white/5 text-gray-500 cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5 ml-1 mr-1" />
              </button>
            </div>
            
            <div className="absolute -top-7 right-2 text-xs text-gray-500 font-medium opacity-0 group-focus-within:opacity-100 transition-opacity flex items-center gap-1">
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
