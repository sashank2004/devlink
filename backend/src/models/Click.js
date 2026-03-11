const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ip:        String
});

clickSchema.index({ shortCode: 1 }); // fast analytics queries
module.exports = mongoose.model('Click', clickSchema);