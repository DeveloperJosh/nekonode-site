// pages/api/auth/protected.js
import dbConnect from '../../../lib/dbConnect';
import auth from '../../../middleware/auth';

const handler = async (req, res) => {
  await dbConnect();
  res.json({ message: 'This is a protected route', user: req.user });
};

export default auth(handler);
