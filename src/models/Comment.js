import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  animeId: { type: String, required: true },
  episodeNumber: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
