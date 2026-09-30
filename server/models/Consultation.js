const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    default: 'General Agriculture'
  },
  crop: {
    type: String,
    default: 'General Crop'
  },
  queryText: {
    type: String,
    required: true
  },
  hasImage: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'en'
  },
  assessment: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  symptoms: [String],
  causes: [String],
  recommendedActions: [String],
  prevention: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
