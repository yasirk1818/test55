const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceSession' },
  direction: { type: String, enum: ['in', 'out'] },
  from: String,
  to: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MessageLog', messageLogSchema);
