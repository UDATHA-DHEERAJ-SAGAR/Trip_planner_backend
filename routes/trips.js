import express from 'express';
import Trip from '../models/Trip.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create a new trip (protected)
router.post('/', auth, async (req, res) => {
  try {
    console.log('📝 Creating trip with userId:', req.userId);
    console.log('📝 Trip data:', req.body);
    const trip = new Trip({ ...req.body, userId: req.userId });
    const savedTrip = await trip.save();
    console.log('✅ Trip saved:', savedTrip);
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error('❌ Error creating trip:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get all trips for the logged-in user (protected)
router.get('/', auth, async (req, res) => {
  try {
    console.log('🔍 Fetching trips for userId:', req.userId);
    const trips = await Trip.find({ userId: req.userId });
    console.log('✅ Found trips:', trips);
    res.json(trips);
  } catch (err) {
    console.error('❌ Error fetching trips:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update a trip (protected, owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this trip' });
    }
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a trip (protected, owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    if (trip.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this trip' });
    }
    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
