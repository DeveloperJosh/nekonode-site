import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import Comment from "../../../models/Comment";
import User from "../../../models/User";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  await dbConnect();

  if (req.method === 'GET') {
    const { animeId } = req.query;
    const comments = await Comment.find({ animeId }).populate({
      path: 'user',
      select: 'name image',
    });
    res.status(200).json(comments);
  } else if (req.method === 'POST') {
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { animeId } = req.query;
    const { text, episodeNumber } = req.body;

    const newComment = new Comment({
      user: session.user.id,  // Ensure this is treated as a string
      animeId,
      episodeNumber,
      text,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
