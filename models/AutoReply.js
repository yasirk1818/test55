const mongoose = require('mongoose');

const autoReplySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  keyword: String,
  reply: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AutoReply', autoReplySchema);
