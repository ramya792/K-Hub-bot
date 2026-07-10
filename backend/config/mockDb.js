import fs from 'fs';
import path from 'path';

const FALLBACK_FILE = path.resolve('db_fallback.json');

const getDb = () => {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading fallback database file:', err.message);
  }
  return { conversations: [], messages: [] };
};

const saveDb = (data) => {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing fallback database file:', err.message);
  }
};

export class MockConversation {
  constructor(data) {
    this._id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    this.title = data?.title || 'New Conversation';
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async save() {
    const db = getDb();
    const existingIdx = db.conversations.findIndex(c => c._id === this._id);
    const convData = {
      _id: this._id,
      title: this.title,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString()
    };
    if (existingIdx >= 0) {
      db.conversations[existingIdx] = convData;
    } else {
      db.conversations.push(convData);
    }
    saveDb(db);
    return convData;
  }

  static find() {
    return {
      sort: () => {
        const db = getDb();
        return db.conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }
    };
  }

  static async findById(id) {
    const db = getDb();
    const data = db.conversations.find(c => c._id === id);
    if (!data) return null;
    const inst = new MockConversation(data);
    inst._id = data._id;
    inst.createdAt = data.createdAt;
    inst.updatedAt = data.updatedAt;
    return inst;
  }

  static async create(data) {
    const inst = new MockConversation(data);
    return await inst.save();
  }

  static async findByIdAndDelete(id) {
    const db = getDb();
    db.conversations = db.conversations.filter(c => c._id !== id);
    db.messages = db.messages.filter(m => m.conversationId !== id);
    saveDb(db);
    return { _id: id };
  }

  static async findByIdAndUpdate(id, update) {
    const db = getDb();
    const conv = db.conversations.find(c => c._id === id);
    if (conv) {
      if (update.title !== undefined) conv.title = update.title;
      conv.updatedAt = update.updatedAt || new Date().toISOString();
      saveDb(db);
    }
    return conv;
  }
}

export class MockMessage {
  constructor(data) {
    this._id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    this.conversationId = data?.conversationId;
    this.role = data?.role;
    this.content = data?.content;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  async save() {
    const db = getDb();
    const msgData = {
      _id: this._id,
      conversationId: this.conversationId,
      role: this.role,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: new Date().toISOString()
    };
    db.messages.push(msgData);
    
    // Update corresponding conversation's updatedAt timestamp
    const cIdx = db.conversations.findIndex(c => c._id === this.conversationId);
    if (cIdx >= 0) {
      db.conversations[cIdx].updatedAt = new Date().toISOString();
    }
    saveDb(db);
    return msgData;
  }

  static async create(data) {
    const inst = new MockMessage(data);
    return await inst.save();
  }

  static find(query) {
    return {
      sort: () => {
        const db = getDb();
        return db.messages
          .filter(m => m.conversationId === query.conversationId)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
    };
  }

  static async deleteMany(query) {
    const db = getDb();
    db.messages = db.messages.filter(m => m.conversationId !== query.conversationId);
    saveDb(db);
    return { deletedCount: 1 };
  }
}
