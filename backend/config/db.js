import mongoose from "mongoose";

// Default to mock database fallback initially to prevent queries from hanging while connecting or on failure
global.isMockDB = true;

const connectDB = async () => {
  try {
    // Set a short server selection timeout so connection doesn't hang indefinitely
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.warn("⚠️ Warning: Falling back to local file-based database (db_fallback.json) for developer mode.");
    global.isMockDB = true;
  }
};

export default connectDB;