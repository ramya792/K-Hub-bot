# K-Hub Bot - Premium AI Chatbot

A production-ready, beautiful, and highly responsive AI Chatbot Web Application built with the MERN stack (MongoDB, Express, React, Node.js) and powered by Groq's blazing-fast inference API.

## Features

- 🎨 **Premium UI/UX**: Dark mode aesthetic, glassmorphism, responsive layout, fluid animations, and beautiful typography.
- 💬 **Conversation Management**: Create, rename, delete, and switch between conversations seamlessly. Sidebar navigation included.
- 🧠 **Context Awareness**: Remembers conversation history to maintain context in each session.
- ⚡ **Lightning Fast AI**: Powered by Groq, utilizing `llama3-70b-8192` for top-tier speed and reasoning.
- 📝 **Markdown & Code Highlighting**: Beautifully formats code blocks with syntax highlighting and easy-copy buttons.
- ✨ **Auto-Generated Titles**: Automatically generates concise titles for your conversations using a lightweight model.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Markdown, Lucide React.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB (Local or Atlas).
- **AI Integration**: Groq SDK (`llama3-70b-8192` & `llama3-8b-8192`).

## Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic for chat and conversations
│   ├── models/          # Mongoose schemas (Conversation, Message)
│   ├── routes/          # Express API routes
│   ├── services/        # Groq SDK integration
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React UI components (Sidebar, ChatArea, etc.)
│   │   ├── context/     # React Context for global state (ChatContext)
│   │   ├── services/    # Axios API communication
│   │   ├── utils/       # Helper functions (tailwind-merge wrapper)
│   │   ├── App.jsx      # Main layout
│   │   └── main.jsx     # Vite entry point
│   ├── index.html       # HTML entry
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Database Setup (MongoDB)

You need a MongoDB database to run this application. You can either use a local instance or MongoDB Atlas.

**For MongoDB Atlas:**
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string (URI).
3. Replace the `MONGODB_URI` in the backend `.env` file with your Atlas connection string.

### 2. Backend Configuration

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (already done if you're using this workspace):
   ```bash
   npm install
   ```
3. Edit the `backend/.env` file with your API keys and MongoDB URI:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/chatbot  # Update this with Atlas URI if needed
   GROQ_API_KEY=your_groq_api_key_here
   ```
4. Start the backend server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

### 3. Frontend Configuration

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (already done):
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file in the `frontend` folder if you change the backend port:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173` (or the port Vite provides) to use K-Hub Bot!

## API Documentation

- `GET /api/conversations` - Retrieve all conversations, ordered by latest activity.
- `POST /api/conversations` - Create a blank new conversation.
- `GET /api/conversations/:id` - Fetch conversation details along with all messages.
- `DELETE /api/conversations/:id` - Delete a conversation and its messages.
- `PUT /api/conversations/:id/rename` - Rename a conversation title.
- `POST /api/chat` - Send a message to the AI. Expects `conversationId` and `content`. Automatically maintains context and generates a title on the first message.
