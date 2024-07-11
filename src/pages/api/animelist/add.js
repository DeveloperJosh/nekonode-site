import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.log('Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { name, animeId, image, status, lastWatchedAt } = req.body;
      console.log(`Received request to ${req.method === 'POST' ? 'add' : 'update'} anime:`, { animeId, status, lastWatchedAt });

      const user = await User.findOne({ userId: session.user.id });

      if (!user) {
        console.error('User not found');
        return res.status(404).json({ error: 'User not found' });
      }

      const animeIndex = user.animeList.findIndex((anime) => anime.animeId === animeId);

      if (animeIndex !== -1) {
        // Update existing anime entry
        user.animeList[animeIndex].status = status;
        user.animeList[animeIndex].lastWatchedAt = lastWatchedAt;
      } else {
        // Add new anime entry
        user.animeList.push({
          animeId,
          name,
          image,
          status,
          lastWatchedAt,
        });
      }

      await user.save();
      res.status(200).json(user.animeList);
    } catch (error) {
      console.error('Error adding/updating anime in list:', error);
      res.status(400).json({ error: 'Error adding/updating anime in list' });
    }
  } else {
    console.log('Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
