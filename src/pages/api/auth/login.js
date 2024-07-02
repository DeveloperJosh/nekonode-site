import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getCache, setCache } from '../../../utils/redis';

export default async function handler(req, res) {
  await dbConnect();

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const cacheKey = `token_${user._id}`;

    // Check if the token is already cached
    const cachedToken = await getCache(cacheKey);
    if (cachedToken) {
      return res.json({ token: cachedToken });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Cache the token
    await setCache(cacheKey, token);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
