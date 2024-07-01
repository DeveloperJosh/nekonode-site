// src/pages/api/auth/profile.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import auth from '../../../middleware/auth';

const handler = async (req, res) => {
  await dbConnect();

  const userId = req.user;

  try {
    const user = await User.findById(userId).select('username email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ username: user.username, email: user.email});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default auth(handler);