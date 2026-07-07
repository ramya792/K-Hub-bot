import mongoose from 'mongoose';
import { MockConversation } from '../config/mockDb.js';

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: 'New Conversation',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseConversation = mongoose.model('Conversation', conversationSchema);

const ConversationProxy = new Proxy(MongooseConversation, {
  construct(target, args) {
    if (global.isMockDB) {
      return new MockConversation(...args);
    }
    return new target(...args);
  },
  get(target, prop) {
    if (global.isMockDB) {
      return MockConversation[prop];
    }
    return target[prop];
  }
});

export default ConversationProxy;
