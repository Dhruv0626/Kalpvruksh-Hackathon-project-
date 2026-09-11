require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const questionRoutes = require('./routes/questionRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/summary', summaryRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'EduNova Backend is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Error handling fallback middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EduNova Server running on http://localhost:${PORT}`);
});
