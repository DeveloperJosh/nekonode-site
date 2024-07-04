import mongoose from 'mongoose';
// to be used in newer versions

const animeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  encodedName: { type: String, required: true },
  episode: { type: String, required: true },
  lang: { type: String, required: true },
  image: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [
    {
      user: { type: String, ref: 'User', required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
});

export default mongoose.models.Anime || mongoose.model('Anime', animeSchema);
