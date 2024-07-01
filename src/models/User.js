import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  history: [
    {
      animeId: { type: String, required: true }, // Change to String
      episodeNumber: { type: Number, required: true },
      watchedAt: { type: Date, default: Date.now },
    }
  ],
});

export default mongoose.models.User || mongoose.model('User', userSchema);
