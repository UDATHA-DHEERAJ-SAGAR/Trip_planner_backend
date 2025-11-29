import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  title: String,
  destination: String,
  startDate: Date,
  endDate: Date,
  notes: String,
  activities: [String],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
