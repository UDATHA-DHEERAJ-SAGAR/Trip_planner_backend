import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import tripRoutes from './routes/trips.js';
import authRoutes from './routes/auth.js'; // Add authentication routes
import itineraryRoutes from './routes/itinerary.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://trip-planner-frontend-vtah.onrender.com',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes); // Add this route for login/register
app.use('/api/itinerary', itineraryRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
});
