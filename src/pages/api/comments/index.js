import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  await dbConnect();

  if (req.method === 'GET') {
    const { animeId, episodeNumber } = req.query;

    if (!animeId || !episodeNumber) {
      return res.status(400).json({ error: 'Missing animeId or episodeNumber' });
    }

    const query = { animeId, episodeNumber, status: 'approved' };

    // Allow moderators and admins to see pending comments
    if (session && (session.user.role === 'moderator' || session.user.role === 'admin')) {
      delete query.status; // Remove the status filter to show all comments
    }

    const comments = await Comment.find(query).populate({
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
      status: 'pending',
    });

    await newComment.save();

    res.status(201).json(newComment);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
