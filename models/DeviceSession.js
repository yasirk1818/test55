const mongoose = require('mongoose');

const deviceSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  session: { type: Object },  // whatsapp auth session
  name: String,
  status: { type: String, enum: ['connected', 'disconnected'], default: 'disconnected' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeviceSession', deviceSessionSchema);
