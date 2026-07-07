import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Menu } from 'lucide-react';
import { cn } from './utils/cn';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-darkSlate text-white">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-white/10 bg-darkSlate">
          <button 
            onClick={toggleSidebar}
            className="p-2 mr-3 -ml-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
          <h1 className="font-semibold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            K-Hub Bot
          </h1>
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
