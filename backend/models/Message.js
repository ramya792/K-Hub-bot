import mongoose from 'mongoose';
import { MockMessage } from '../config/mockDb.js';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseMessage = mongoose.model('Message', messageSchema);

const MessageProxy = new Proxy(MongooseMessage, {
  construct(target, args) {
    if (global.isMockDB) {
      return new MockMessage(...args);
    }
    return new target(...args);
  },
  get(target, prop) {
    if (global.isMockDB) {
      return MockMessage[prop];
    }
    return target[prop];
  }
});

export default MessageProxy;
