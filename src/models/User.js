import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }, // User role
  banned: { type: Boolean, default: false }, // Banned status
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
