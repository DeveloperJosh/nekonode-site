// pages/api/animelist/delete.js
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

  if (req.method === 'DELETE') {
    try {
      const { animeId } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { userId: session.user.id },
        { $pull: { animeList: { animeId } } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'Anime list entry not found' });
      }

      res.status(200).json({ message: 'Anime list entry deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Error deleting anime list entry' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
