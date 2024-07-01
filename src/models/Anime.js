import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  genres: { type: [String], required: true },
  released: { type: String, required: true },
  totalEpisodes: { type: Number, required: true },
  image: { type: String, required: true },
});

export default mongoose.models.Anime || mongoose.model('Anime', animeSchema);
