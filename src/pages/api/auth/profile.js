import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import auth from '../../../middleware/auth';
import { getCache, setCache } from '../../../utils/redis';

const handler = async (req, res) => {
  await dbConnect();

  const userId = req.user;

  const cacheKey = `profile_${userId}`;

  // Check if the user profile is already cached
  const cachedProfile = await getCache(cacheKey);
  if (cachedProfile) {
    return res.status(200).json(cachedProfile);
  }

  try {
    const user = await User.findById(userId).select('username email');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profileData = { username: user.username, email: user.email };

    // Cache the profile data
    await setCache(cacheKey, profileData);

    res.status(200).json(profileData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export default auth(handler);
