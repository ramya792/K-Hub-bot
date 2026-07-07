import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Plus, MessageSquare, Trash2, Edit2, X, Check } from 'lucide-react';
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

  const handleRenameSubmit = (id) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#151721] border-r border-white/5 shadow-xl">
      <div className="p-4">
        <button
          onClick={() => {
            createNewConversation();
            onClose?.();
          }}
          className="flex items-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-medium text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
        >
          <Plus className="w-5 h-5" />
          New Conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        <AnimatePresence>
          {conversations.map((conv) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              key={conv._id}
              className={cn(
                "group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                activeConversationId === conv._id 
                  ? "bg-white/10 text-white border-white/10" 
                  : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
              )}
              onClick={() => {
                if (editingId !== conv._id) {
                  setActiveConversationId(conv._id);
                  onClose?.();
                }
              }}
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                
                {editingId === conv._id ? (
                  <input
                    type="text"
                    autoFocus
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(conv._id)}
                    className="flex-1 bg-black/30 border border-indigo-500 rounded px-2 py-1 text-sm text-white outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="truncate text-sm font-medium">{conv.title}</span>
                )}
              </div>

              {editingId === conv._id ? (
                <div className="flex gap-1 ml-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRenameSubmit(conv._id); }}
                    className="p-1 hover:text-green-400"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                    className="p-1 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setEditingId(conv._id);
                      setEditTitle(conv.title);
                    }}
                    className="p-1.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv._id); }}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {conversations.length === 0 && (
          <div className="text-center mt-10 text-gray-500 text-sm">
            No previous conversations.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
