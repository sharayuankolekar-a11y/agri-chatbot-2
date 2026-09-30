const Feedback = require('../models/Feedback');
const { getStatus, memoryStore } = require('../config/db');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { consultationId, scanId, isHelpful, comment = '' } = req.body;
    const targetId = consultationId || scanId;

    if (!targetId || typeof isHelpful !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'consultationId and boolean isHelpful flag are required.'
      });
    }

    const feedbackData = {
      consultationId: targetId,
      isHelpful,
      comment,
      createdAt: new Date()
    };

    const { isConnected } = getStatus();
    if (isConnected) {
      try {
        await Feedback.create(feedbackData);
      } catch (dbErr) {
        console.warn('⚠️ Could not save feedback to MongoDB:', dbErr.message);
      }
    }

    memoryStore.feedbacks.push(feedbackData);

    return res.json({
      success: true,
      message: 'Thank you for helping AgriSphere improve agricultural guidance!'
    });
  } catch (err) {
    next(err);
  }
};
