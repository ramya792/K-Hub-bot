import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Copy, Check, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex w-full py-6 px-4 md:px-0",
      isUser ? "justify-end" : "justify-start bg-black/10 border-y border-white/5"
    )}>
      <div className={cn(
        "flex max-w-4xl w-full mx-auto gap-4 md:gap-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-gray-600 to-gray-800 flex items-center justify-center border border-white/10 shadow-lg">
              <User className="w-5 h-5 text-gray-300" />
            </div>
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={cn(
          "flex flex-col relative",
          isUser ? "items-end" : "items-start flex-1 min-w-0"
        )}>
          <div className={cn(
            "prose prose-invert max-w-none w-full",
            isUser ? "bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md" : "text-gray-200"
          )}>
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed m-0">{message.content}</p>
            ) : (
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <div className="relative mt-4 mb-6 group rounded-lg overflow-hidden border border-white/10">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#1E1E1E] text-xs text-gray-400">
                          <span>{match[1]}</span>
                        </div>
                        <SyntaxHighlighter
                          {...props}
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="!m-0 !bg-[#151515]"
                        />
                      </div>
                    ) : (
                      <code {...props} className="bg-white/10 text-indigo-300 px-1.5 py-0.5 rounded-md text-sm font-mono">
                        {children}
                      </code>
                    )
                  },
                  p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="mb-4 list-disc pl-6 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="mb-4 list-decimal pl-6 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="leading-relaxed">{children}</li>,
                  a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{children}</a>
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
          
          {/* Actions */}
          {!isUser && (
            <div className="flex items-center gap-2 mt-3">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
