/**
 * MongoDB Atlas connection via Mongoose
 * - Connects once on server startup
 * - Logs success/failure clearly
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1); // Exit process — app cannot run without DB
  }
};

module.exports = connectDB;
