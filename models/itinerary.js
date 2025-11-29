import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  duration: { type: Number, required: true },
  purpose: { type: String, required: true },
  itinerary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Itinerary', itinerarySchema);
