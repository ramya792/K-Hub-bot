import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// @desc    Get all conversations
// @route   GET /api/conversations
// @access  Public
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find().sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation by ID including messages
// @route   GET /api/conversations/:id
// @access  Public
export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    const messages = await Message.find({ conversationId: req.params.id }).sort({ createdAt: 1 });
    res.json({ conversation, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new conversation
// @route   POST /api/conversations
// @access  Public
export const createConversation = async (req, res, next) => {
  try {
    const conversation = new Conversation({ title: 'New Conversation' });
    const createdConversation = await conversation.save();
    res.status(201).json(createdConversation);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a conversation and its messages
// @route   DELETE /api/conversations/:id
// @access  Public
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    await Message.deleteMany({ conversationId: req.params.id });
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Rename a conversation
// @route   PUT /api/conversations/:id/rename
// @access  Public
export const renameConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.title = title;
    const updatedConversation = await conversation.save();
    res.json(updatedConversation);
  } catch (error) {
    next(error);
  }
};
