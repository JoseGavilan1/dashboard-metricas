const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  platform: { type: String, required: true }, 
  followers: { type: Number, required: true },
  posts: { type: Number, default: 0 },
  reach: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Metric', MetricSchema);