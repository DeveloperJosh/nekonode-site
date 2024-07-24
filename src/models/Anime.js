import mongoose from 'mongoose';

const AnimeSchema = new mongoose.Schema({
  animeId: { type: String, required: true, unique: true },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  userRatings: {
    type: [
      {
        userId: { type: String, required: true },
        rating: { type: Number, required: true }
      }
    ],
    default: []
  }
}, { minimize: false });

export default mongoose.models.Anime || mongoose.model('Anime', AnimeSchema);
