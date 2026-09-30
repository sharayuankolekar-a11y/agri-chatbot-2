const rateLimit = require('express-rate-limit');

const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 analysis requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many analysis requests from this IP. Please try again after 15 minutes.'
  }
});

module.exports = {
  analyzeLimiter
};
