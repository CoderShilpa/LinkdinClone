// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// ------------------------------------
// 1. Import ALL Route Files
//    Assuming your route files are located in 'backend/routes/api/'
// ------------------------------------
import authRoutes from './routes/authRoutes.js'; 
import postRoutes from './routes/postRoutes.js'; 
// --- CRITICAL FIX: Changed path/name to match common structure ---
import profileRoutes from './routes/profile.js'; 


// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// --- Middleware ---
// Enable CORS for frontend to access backend
app.use(cors({ origin: 'http://localhost:5173' })); 
// Initialize body parser for JSON data
app.use(express.json({ extended: false }));

// Define a simple default route
app.get('/', (req, res) => res.send('API Running'));

// --- API Routes ---
// 2. Register Routes using the imported variables
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profile', profileRoutes); 

// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));