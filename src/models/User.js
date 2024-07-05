import mongoose from 'mongoose';

// Define a schema for the anime list item
const AnimeListItemSchema = new mongoose.Schema({
  animeId: { type: String, required: true }, // Unique identifier for the anime
  title: { type: String, required: true }, // Title of the anime
  status: { type: String, enum: ['watched', 'watching', 'dropped'], required: true }, // Status of the anime
  episodesWatched: { type: Number, default: 0 }, // Number of episodes watched
  totalEpisodes: { type: Number, required: true }, // Total number of episodes in the anime
  addedAt: { type: Date, default: Date.now }, // Date when the anime was added to the list
});

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }, // User role
  banned: { type: Boolean, default: false }, // Banned status
  animelist: { type: [AnimeListItemSchema], default: [] }, // User's anime list
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
