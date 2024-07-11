import mongoose from 'mongoose';

const AnimeListSchema = new mongoose.Schema({
    user: { type: String, ref: 'User', required: true },
    image : { type: String, required: true },
    name: { type: String, required: true },
    animeId: { type: String, required: true },
    status: { type: String, enum: ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'], required: true },
    lastWatchedAt: { type: Date },
    });

const AnimeList = mongoose.models.AnimeList || mongoose.model('AnimeList', AnimeListSchema);
export default AnimeList;