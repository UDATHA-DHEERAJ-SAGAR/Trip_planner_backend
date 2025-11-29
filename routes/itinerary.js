import express from 'express';
import { generateItinerary, getUserItineraries } from '../controllers/itineraryController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new itinerary
router.post('/', auth, generateItinerary);

// Get all itineraries of the logged-in user
router.get('/', auth, getUserItineraries);

export default router;
