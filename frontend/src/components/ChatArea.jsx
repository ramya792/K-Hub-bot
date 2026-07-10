import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import TypingIndicator from './TypingIndicator';
import { ArrowUp, Plus, CornerDownLeft, Loader2, Mic, MicOff, Square } from 'lucide-react';
import { cn } from '../utils/cn';

const ChatArea = () => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    isTyping, 
    error, 
    stopGenerating 
  } = useChat();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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

  return (
    <div className="flex flex-col h-full bg-chat-bg relative text-text-main transition-colors duration-200">
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
              <div className="w-full max-w-2xl mx-auto px-4 md:px-0 mt-4">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-chat-bg via-chat-bg/95 to-transparent pt-12 pb-4 px-4">
        <div className="max-w-2xl mx-auto relative group">
          {error && (
            <div className="relative mb-3 p-3 bg-red-950/80 border border-red-500/30 text-red-200 text-sm rounded-xl text-center shadow-lg animate-fade-in">
              {error}
            </div>
          )}
          
          <form 
            onSubmit={handleSend}
            className="relative flex items-center bg-input-bg rounded-[26px] border border-border-main p-2 pl-4 pr-2 shadow-sm focus-within:shadow transition-all duration-200"
          >
            {/* Plus Icon on left */}
            <button
              type="button"
              className="p-1.5 rounded-full text-text-muted hover:text-text-main hover:bg-hover-bg transition-colors flex items-center justify-center flex-shrink-0"
              title="Add attachment"
            >
              <Plus className="w-5 h-5" />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message K-Hub..."
              className="w-full max-h-[200px] bg-transparent text-text-main placeholder-text-muted border-none outline-none resize-none py-2 px-3 focus:ring-0 leading-relaxed text-[15px] min-h-[40px] flex-1"
              rows={1}
            />
            
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Mic Icon for Speech to Text */}
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "p-2 rounded-full flex items-center justify-center transition-all duration-200",
                  isListening 
                    ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 animate-pulse" 
                    : "text-text-muted hover:text-text-main hover:bg-hover-bg"
                )}
                title={isListening ? "Listening... click to stop" : "Use voice input"}
              >
                {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
              </button>

              {/* Send or Stop button */}
              {isTyping ? (
                <button
                  type="button"
                  onClick={stopGenerating}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-text-main text-chat-bg hover:opacity-90 transition-all duration-200 shadow-sm"
                  title="Stop generating"
                >
                  <Square className="w-3 h-3 fill-current text-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                    input.trim()
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                      : "bg-hover-bg text-text-muted/40 cursor-not-allowed"
                  )}
                >
                  <ArrowUp className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </form>
          <div className="text-center mt-2.5 text-xs text-text-muted">
            ChatGPT can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
