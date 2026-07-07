import express from 'express';
import {
  getConversations,
  getConversationById,
  createConversation,
  deleteConversation,
  renameConversation
} from '../controllers/conversationController.js';

const router = express.Router();

router.route('/')
  .get(getConversations)
  .post(createConversation);

router.route('/:id')
  .get(getConversationById)
  .delete(deleteConversation);

router.route('/:id/rename')
  .put(renameConversation);

export default router;
