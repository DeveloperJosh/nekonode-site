import jwt from 'jsonwebtoken';
import User from '../models/User';

const auth = handler => async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
   // console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId);  // Use userId from decoded token
    if (!user) {
      console.log('Invalid token: User not found for ID:', decoded.userId);
      return res.status(401).json({ error: 'Invalid token' });
    }

    //console.log('User authenticated:', user._id);
    req.user = user;
    return handler(req, res);
  } catch (error) {
    //console.log('Unauthorized access:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default auth;
