import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Menu, Sun, Moon, SidebarClose, SidebarOpen } from 'lucide-react';
import { cn } from './utils/cn';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('khub-theme') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('khub-theme', theme);
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="flex h-screen overflow-hidden bg-chat-bg text-text-main font-sans">
      {/* Mobile sidebar overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex-shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} theme={theme} toggleTheme={toggleTheme} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative bg-chat-bg">
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-border-main bg-chat-bg text-text-main h-[56px] flex-shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-hover-bg transition-colors text-text-muted hover:text-text-main"
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <SidebarClose className="w-5 h-5" /> : <SidebarOpen className="w-5 h-5" />}
            </button>
            
            <div className="font-semibold text-base flex items-center gap-1.5 cursor-pointer hover:bg-hover-bg px-2.5 py-1.5 rounded-lg transition-colors text-text-main">
              <span>K-Hub Bot</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-hover-bg text-text-muted hover:text-text-main transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative">
          <ChatArea />
        </div>
      </div>
    </div>
  );
}

export default App;
