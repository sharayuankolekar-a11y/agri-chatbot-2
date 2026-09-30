const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['MESSAGE', 'LINK', 'INTERNSHIP', 'PAYMENT', 'AUTO'],
    default: 'AUTO'
  },
  category: {
    type: String,
    required: true,
    default: 'Other Suspicious Activity'
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'SUSPICIOUS', 'HIGH'],
    required: true
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.85
  },
  redFlags: [
    {
      title: String,
      description: String,
      severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'HIGH'
      }
    }
  ],
  confirmedIndicators: [String],
  suspiciousIndicators: [String],
  unknownInformation: [String],
  explanation: {
    type: String,
    required: true
  },
  recommendedActions: [String],
  sanitizedContent: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scan', ScanSchema);
