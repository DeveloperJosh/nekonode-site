import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let client;

if (typeof window === 'undefined') {
  client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on('error', (err) => {
    console.error('Redis error:', err);
  });

  client.connect();
}

export const getCache = async (key) => {
  if (!client) return null; // Ensure client is available
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error getting cache:', err);
    return null;
  }
};

export const setCache = async (key, value, ttl = 3600) => {
  if (!client) return; // Ensure client is available
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.error('Error setting cache:', err);
  }
};
