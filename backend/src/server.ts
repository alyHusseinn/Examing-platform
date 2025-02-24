import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exam.js';
import subjectRoutes from './routes/subject.js';
import chatbotRoutes from './routes/chatbot.js';
import { errorHandler } from './middleware/errorHandler.js';
import { protect } from './middleware/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', protect, examRoutes);
app.use('/api/subjects', protect, subjectRoutes);
app.use('/api/chatbot', protect, chatbotRoutes);
app.use('/api/users', protect, userRoutes);
// Error handling
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);       
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Ensure DB connection for all environments
connectDB();

// Start the server
if(process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

// Export the app for Vercel
export default app;