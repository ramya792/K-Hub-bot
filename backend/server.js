import express from 'express';
import dotenv from 'dotenv';
// import dns from 'dns';

// Force Node to use Google/Cloudflare DNS resolver to resolve MongoDB Atlas SRV records
// dns.setServers(['8.8.8.8', '1.1.1.1']);

import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import conversationRoutes from './routes/conversationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/conversations', conversationRoutes);
app.use('/api/chat', chatRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
