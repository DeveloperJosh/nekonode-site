import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import dotenv from 'dotenv'; // Import dotenv to read environment variables
import axios from 'axios'; // Import axios to send the webhook request
dotenv.config(); // Load the environment variables

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  await dbConnect();

  if (req.method === 'GET') {
    const { animeId, episodeNumber } = req.query;
    if (!animeId || !episodeNumber) {
      return res.status(400).json({ error: 'Missing animeId or episodeNumber' });
    }

    const comments = await Comment.find({ animeId, episodeNumber }).populate({
      path: 'user',
      select: 'name image',
    });
    res.status(200).json(comments);
  } else if (req.method === 'POST') {
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { animeId, episodeNumber } = req.query;
    const { text } = req.body;

    if (!animeId || !episodeNumber || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newComment = new Comment({
      user: session.user.id,
      animeId,
      episodeNumber,
      text,
    });

    await newComment.save();

    // Trigger the webhook
    await axios.post(`${process.env.NEXTAUTH_URL}/api/webhook`, { comment: newComment })
      .catch(error => {
        console.error('Failed to send webhook:', error);
      });

    res.status(201).json(newComment);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
