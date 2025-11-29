import axios from 'axios';
import dotenv from 'dotenv';
import Itinerary from '../models/itinerary.js';

dotenv.config();

export const generateItinerary = async (req, res) => {
  const { destination, duration, purpose } = req.body;
  const userId = req.userId;

  if (!destination || !duration || !purpose) {
    return res.status(400).json({ error: 'Destination, duration, and purpose are required' });
  }

  try {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'user',
            content: `
              Generate a ${duration}-day travel itinerary for ${destination}.
              Purpose of the visit: ${purpose}.

              Include:
              - Morning, afternoon, and evening activities
              - Recommended local attractions
              - Meal and rest breaks
              - Best visiting hours
              Format:
              Day 1: ...
              Day 2: ...
            `
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const itineraryText = response.data.choices[0].message.content;
    console.log('✅ Debug — userId being saved:', userId);
    const savedItinerary = await Itinerary.create({
      userId,
      destination,
      duration,
      purpose, // 🆕 Save purpose
      itinerary: itineraryText
    });

    res.status(201).json(savedItinerary);

  } catch (err) {
    console.error('🛑 Together.ai Error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
};


export const getUserItineraries = async (req, res) => {
  try {
    const userId = req.userId;
    const itineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
};
