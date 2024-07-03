// pages/api/heartbeat.js

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const heartbeatUrl = process.env.HEARTBEAT;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios.post(heartbeatUrl);
    res.status(200).json({ message: 'Heartbeat sent successfully', data: response.data });
  } catch (error) {
    console.error('Error sending heartbeat:', error);
    res.status(500).json({ message: 'Failed to send heartbeat', error: error.message });
  }
}
