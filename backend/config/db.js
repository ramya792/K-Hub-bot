import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    console.warn("⚠️ Warning: Falling back to local file-based database (db_fallback.json) for developer mode.");
    global.isMockDB = true;
  }
};

export default connectDB;