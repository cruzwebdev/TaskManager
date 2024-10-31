import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const app = express();

// Configure CORS for development
app.use(cors({
  origin: 'http://127.0.0.1:5173', // Vite's default port
  credentials: true
}));

app.use(express.json());

// MongoDB connection with proper error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
  serverSelectionTimeoutMS: 30000, // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if we can't connect to the database
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dbConnected: mongoose.connection.readyState === 1 });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});