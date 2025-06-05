const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  rsvp: { type: String, enum: ['yes', 'no'], default: 'yes' },
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
