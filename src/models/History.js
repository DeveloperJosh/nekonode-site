const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  animeId: {
    type: String,
    required: true
  },
  episodeNumber: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', historySchema);
