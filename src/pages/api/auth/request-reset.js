import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: https://nekonode.net/auth/reset-password?token=${token}\n This link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent' });

  } catch (error) {
    console.error('Error in request reset handler:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
