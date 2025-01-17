import { createClient } from 'redis';
import dotenv from 'dotenv';
import cron from 'node-cron';

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

// clear cache
export const clearCache = async () => {
  if (!client) return; // Ensure client is available
  try {
    await client.flushAll();
    console.log('Cache cleared.');
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
};

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

// Schedule cache clearing every hour
cron.schedule('0 * * * *', async () => {
  console.log('Clearing cache...');
  try {
    await clearCache();
  } catch (err) {
    console.error('Error during scheduled cache clear:', err);
  }
});
