import mongoose from 'mongoose';

const AnimeListSchema = new mongoose.Schema({
  animeId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'], required: true },
  lastWatchedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  banned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  animeList: [AnimeListSchema]
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
