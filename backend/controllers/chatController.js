import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { generateChatResponse, generateTitle } from '../services/groqService.js';

// @desc    Send a message and get AI response
// @route   POST /api/chat
// @access  Public
export const handleChatMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    let currentConversationId = conversationId;

    // If no conversationId is provided, create a new conversation
    if (!currentConversationId) {
      const newConv = await Conversation.create({ title: 'New Conversation' });
      currentConversationId = newConv._id;
    }

    // Save user message
    const userMessage = await Message.create({
      conversationId: currentConversationId,
      role: 'user',
      content
    });

    // Fetch all previous messages in this conversation for context
    const previousMessages = await Message.find({ conversationId: currentConversationId }).sort({ createdAt: 1 });
    
    // Generate AI response
    const aiResponseContent = await generateChatResponse(previousMessages);
    
    // Save AI response
    const aiMessage = await Message.create({
      conversationId: currentConversationId,
      role: 'assistant',
      content: aiResponseContent
    });

    // Auto-generate title if this is the first user message (i.e. only 2 messages total now)
    if (previousMessages.length === 1 || !conversationId) { // userMessage was just saved, so length is 1
      const generatedTitle = await generateTitle(content);
      await Conversation.findByIdAndUpdate(currentConversationId, { title: generatedTitle });
    } else {
       // Update updatedAt field of conversation
       await Conversation.findByIdAndUpdate(currentConversationId, { updatedAt: Date.now() });
    }

    res.json({
      conversationId: currentConversationId,
      userMessage,
      aiMessage,
    });
  } catch (error) {
    next(error);
  }
};
