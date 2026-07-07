import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const conversationService = {
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },
  getConversationById: async (id) => {
    const response = await api.get(`/conversations/${id}`);
    return response.data;
  },
  createConversation: async () => {
    const response = await api.post('/conversations');
    return response.data;
  },
  deleteConversation: async (id) => {
    const response = await api.delete(`/conversations/${id}`);
    return response.data;
  },
  renameConversation: async (id, title) => {
    const response = await api.put(`/conversations/${id}/rename`, { title });
    return response.data;
  }
};

export const chatService = {
  sendMessage: async (conversationId, content) => {
    const response = await api.post('/chat', { conversationId, content });
    return response.data;
  }
};

export default api;
