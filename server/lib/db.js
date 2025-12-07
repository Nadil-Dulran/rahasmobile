import mongoose from 'mongoose';

// Function to connect to MongoDB
export const connectDB = async () => {
  try {
    const baseUri = process.env.MONGODB_URI;
    if (!baseUri) {
      console.error('MONGODB_URI is not set. Please configure your environment.');
      throw new Error('Missing MONGODB_URI environment variable');
    }

    const fullUri = `${baseUri}/rahas`;
    console.log('Connecting to MongoDB at:', fullUri);

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err?.message || err);
    });

    await mongoose.connect(fullUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
      // If using MongoDB Atlas or SRV, mongoose handles it; dbName ensures the database is set
      dbName: 'rahas'
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error?.message || error);
    throw error;
  }
};