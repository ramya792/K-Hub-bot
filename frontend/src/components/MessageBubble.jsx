import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Sparkles } from 'lucide-react';
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
      "flex w-full py-5 px-4 md:px-0 text-text-main transition-colors duration-200",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-2xl w-full mx-auto gap-4 md:gap-5",
        isUser ? "justify-end" : "flex-row"
      )}>
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Message Content */}
        <div className={cn(
          "flex flex-col relative group max-w-[85%]",
          isUser ? "items-end" : "items-start flex-1 min-w-0"
        )}>
          {isUser ? (
            <div className="bg-user-bubble text-user-text px-4 py-2.5 rounded-[20px] shadow-sm leading-relaxed text-[15px] whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            <div className="w-full text-text-main text-[15px] leading-relaxed">
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <div className="relative mt-4 mb-4 group/code rounded-lg overflow-hidden border border-border-main bg-sidebar-bg">
                        <div className="flex items-center justify-between px-4 py-1.5 bg-hover-bg text-xs text-text-muted">
                          <span>{match[1]}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(String(children))}
                            className="hover:text-text-main transition-colors"
                          >
                            Copy code
                          </button>
                        </div>
                        <SyntaxHighlighter
                          {...props}
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="!m-0 !bg-[#0d0d0d] !p-4"
                        />
                      </div>
                    ) : (
                      <code {...props} className="bg-hover-bg text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md text-sm font-mono font-medium">
                        {children}
                      </code>
                    )
                  },
                  p: ({children}) => <p className="mb-3.5 last:mb-0">{children}</p>,
                  ul: ({children}) => <ul className="mb-3.5 list-disc pl-5 space-y-1">{children}</ul>,
                  ol: ({children}) => <ol className="mb-3.5 list-decimal pl-5 space-y-1">{children}</ol>,
                  li: ({children}) => <li className="mb-0.5">{children}</li>,
                  a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">{children}</a>
                }}
              >
                {message.content}
              </ReactMarkdown>

              {/* Actions row under assistant message */}
              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 p-1 rounded hover:bg-hover-bg text-text-muted hover:text-text-main transition-colors"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

