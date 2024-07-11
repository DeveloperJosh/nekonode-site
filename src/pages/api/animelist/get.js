// pages/api/animelist/get.js
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ userId: session.user.id });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user.animeList);
    } catch (error) {
      res.status(400).json({ error: 'Error fetching anime list' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
