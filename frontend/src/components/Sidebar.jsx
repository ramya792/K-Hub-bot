import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { 
  Plus, MessageSquare, Trash2, Edit2, X, Check, Search, Library, 
  Folder, Calendar, Puzzle, MoreHorizontal, User, Sparkles, MessageCircleMore
} from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onClose }) => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    createNewConversation,
    deleteConversation,
    renameConversation
  } = useChat();
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRenameSubmit = (id) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-sidebar-bg border-r border-border-main text-text-main transition-colors duration-200 select-none">
      {/* Top Sidebar Buttons */}
      <div className="p-3.5 space-y-1">
        <button
          onClick={() => {
            createNewConversation();
            onClose?.();
          }}
          className="flex items-center justify-between w-full px-3 py-2 hover:bg-hover-bg text-text-main rounded-lg transition-all text-sm font-medium"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>New chat</span>
          </div>
          <Plus className="w-4.5 h-4.5 text-text-muted" />
        </button>

        <div className="flex items-center gap-2.5 w-full px-3 py-1.5 hover:bg-hover-bg text-text-main rounded-lg transition-all text-sm border border-transparent focus-within:border-border-main/60 focus-within:bg-hover-bg/40">
          <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-text-main placeholder-text-muted w-full text-xs py-0.5"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-text-muted hover:text-text-main flex-shrink-0 cursor-pointer p-0.5 hover:bg-hover-bg rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>



      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 mt-4 space-y-1">
        <div className="px-3 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          Recent
        </div>

        <AnimatePresence>
          {filteredConversations.map((conv) => (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              key={conv._id}
              className={cn(
                "group relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 border border-transparent text-sm",
                activeConversationId === conv._id 
                  ? "bg-hover-bg text-text-main font-medium" 
                  : "text-text-main hover:bg-hover-bg/75"
              )}
              onClick={() => {
                if (editingId !== conv._id) {
                  setActiveConversationId(conv._id);
                  onClose?.();
                }
              }}
            >
              <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                <MessageCircleMore className="w-4 h-4 flex-shrink-0 text-text-muted" />
                
                {editingId === conv._id ? (
                  <input
                    type="text"
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(conv._id)}
                    className="flex-1 bg-chat-bg border border-indigo-500 rounded px-1.5 py-0.5 text-sm text-text-main outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate">{conv.title}</span>
                )}
              </div>

              {editingId === conv._id ? (
                <div className="flex gap-1 ml-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRenameSubmit(conv._id); }}
                    className="p-0.5 hover:text-green-500"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                    className="p-0.5 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity ml-2">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setEditingId(conv._id);
                      setEditTitle(conv.title);
                    }}
                    className="p-1 text-text-muted hover:text-text-main rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv._id); }}
                    className="p-1 text-text-muted hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {conversations.length === 0 && (
          <div className="px-3 py-4 text-text-muted text-xs italic">
            No chats yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
