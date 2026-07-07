import React, { createContext, useContext, useState, useEffect } from 'react';
import { conversationService, chatService } from '../services/api';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  const loadConversations = async () => {
    try {
      const data = await conversationService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations', error);
    }
  };

  const loadMessages = async (id) => {
    setIsLoading(true);
    try {
      const data = await conversationService.getConversationById(id);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages', error);
      setActiveConversationId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  const sendMessage = async (content) => {
    setError(null);
    // Optimistically add user message
    const tempUserMsg = { _id: Date.now(), role: 'user', content };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const data = await chatService.sendMessage(activeConversationId, content);
      
      if (!activeConversationId) {
        setActiveConversationId(data.conversationId);
        await loadConversations();
      }

      setMessages(prev => {
        // Replace temp message with real one from server, and add AI response
        const filtered = prev.filter(msg => msg._id !== tempUserMsg._id);
        return [...filtered, data.userMessage, data.aiMessage];
      });
      
      // Update the title in the sidebar if it was a new conversation
      if (!activeConversationId) {
        loadConversations();
      }

    } catch (error) {
      console.error('Failed to send message', error);
      setError('Failed to connect to backend server. Make sure the backend is running and MongoDB is connected.');
      // Remove temp message if failed
      setMessages(prev => prev.filter(msg => msg._id !== tempUserMsg._id));
    } finally {
      setIsTyping(false);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await conversationService.deleteConversation(id);
      if (activeConversationId === id) {
        createNewConversation();
      }
      await loadConversations();
    } catch (error) {
      console.error('Failed to delete conversation', error);
    }
  };

  const renameConversation = async (id, title) => {
    try {
      await conversationService.renameConversation(id, title);
      await loadConversations();
    } catch (error) {
      console.error('Failed to rename conversation', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        isLoading,
        isTyping,
        error,
        setError,
        createNewConversation,
        sendMessage,
        deleteConversation,
        renameConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
