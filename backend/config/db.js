const mongoose = require('mongoose');
const memoryStore = require('./memoryStore');
const { demoBusinesses, sampleReviews } = require('../data/seedData');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && mongoUri.trim() !== '' && !mongoUri.includes('USER:PASS') && !mongoUri.includes('USER:PASSWORD')) {
    try {
      console.log('🔄 Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 4000,
        autoIndex: true
      });
      isConnected = true;
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`⚠️  MongoDB Atlas connection failed (${err.message}).`);
    }
  }

  // Fallback to In-Memory Demo Store
  console.log('ℹ️  Running NearMe Consulting in High-Performance In-Memory Demo Mode.');
  console.log('ℹ️  (To connect real MongoDB Atlas, set valid MONGO_URI in backend/.env)');
  await memoryStore.init({
    businesses: demoBusinesses,
    reviews: sampleReviews
  });
  isConnected = false;
  return null;
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, disconnectDB, isDbConnected };
