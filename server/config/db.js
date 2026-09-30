const mongoose = require('mongoose');

let isConnected = false;
let useMemoryStore = false;

// In-memory storage for fallback mode
const memoryStore = {
  scans: [],
  feedbacks: []
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('ℹ️ MONGODB_URI not provided. Operating in Memory-Store mode.');
    useMemoryStore = true;
    return false;
  }

  try {
    // Attempt MongoDB connection with 4-second timeout to prevent stalling
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
    return true;
  } catch (err) {
    console.warn(`⚠️ MongoDB connection failed: ${err.message}. Switching to Memory-Store fallback mode.`);
    useMemoryStore = true;
    return false;
  }
};

const getStatus = () => ({
  isConnected,
  useMemoryStore
});

module.exports = {
  connectDB,
  getStatus,
  memoryStore
};
