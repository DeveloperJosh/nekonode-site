// pages/api/auth/reset-password.js
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  const { token, newPassword } = req.body;

  await dbConnect();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
}
