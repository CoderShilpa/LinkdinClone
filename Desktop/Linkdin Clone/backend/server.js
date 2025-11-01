// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// ------------------------------------
// Import All Route Files
// ------------------------------------
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import profileRoutes from './routes/profile.js';

dotenv.config();
connectDB();

const app = express();

// ------------------------------------
// ✅ FIXED CORS for both Local + Vercel Frontend
// ------------------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'https://linkdin-clone-v2mx.vercel.app', // your Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `CORS policy does not allow access from origin ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ extended: false }));

// Default route
app.get('/', (req, res) => res.send('API Running Successfully 🔥'));

// ------------------------------------
// API Routes
// ------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes);

// ------------------------------------
// Error Handler (to catch internal 500)
// ------------------------------------
app.use((err, req, res, next) => {
  console.error('🔥 SERVER ERROR:', err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

// ------------------------------------
// Server Startup
// ------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server started on port ${PORT}`));
