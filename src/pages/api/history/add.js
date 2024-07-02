// src/pages/api/history/add.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import auth from '../../../middleware/auth';

const handler = async (req, res) => {
  await dbConnect();
  const userId = req.user._id; // Ensure req.user is properly populated
  const { name, animeId, episodeNumber } = req.body;

  if (!name || !animeId || !episodeNumber) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the anime is already in the user's history
    const alreadyInHistory = user.history.some(
      (entry) => entry.animeId === animeId && entry.episodeNumber === episodeNumber
    );

    if (alreadyInHistory) {
      return res.status(400).json({ error: 'Anime is already in history' });
    }

    user.history.push({ name, animeId, episodeNumber });
    await user.save();

    res.status(200).json({ message: 'History added successfully' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default auth(handler);
