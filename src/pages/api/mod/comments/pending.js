import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(session.user.id);
  if (!user || (user.role !== 'moderator' && user.role !== 'admin')) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const comments = await Comment.find({ status: 'pending' }).populate({
      path: 'user',
      select: 'name image',
    });

    res.status(200).json(comments);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
