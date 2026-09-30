const Consultation = require('../models/Consultation');
const { getStatus, memoryStore } = require('../config/db');

exports.getHistory = async (req, res, next) => {
  try {
    const { category, search, limit = 50 } = req.query;
    const { isConnected } = getStatus();

    let consultations = [];

    if (isConnected) {
      const filter = {};
      if (category && category !== 'ALL') filter.category = category;
      if (search) {
        filter.$or = [
          { crop: { $regex: search, $options: 'i' } },
          { assessment: { $regex: search, $options: 'i' } },
          { queryText: { $regex: search, $options: 'i' } }
        ];
      }
      consultations = await Consultation.find(filter).sort({ createdAt: -1 }).limit(Number(limit));
    } else {
      // Memory Store filtering
      consultations = [...memoryStore.scans];
      if (category && category !== 'ALL') {
        consultations = consultations.filter(s => s.category === category);
      }
      if (search) {
        const queryStr = search.toLowerCase();
        consultations = consultations.filter(s =>
          (s.crop && s.crop.toLowerCase().includes(queryStr)) ||
          (s.assessment && s.assessment.toLowerCase().includes(queryStr)) ||
          (s.queryText && s.queryText.toLowerCase().includes(queryStr))
        );
      }
      consultations = consultations.slice(0, Number(limit));
    }

    return res.json({
      success: true,
      count: consultations.length,
      consultations,
      scans: consultations
    });
  } catch (err) {
    next(err);
  }
};

exports.getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isConnected } = getStatus();

    let consultation = null;
    if (isConnected) {
      try {
        consultation = await Consultation.findById(id);
      } catch (err) {
        // Fall through
      }
    }

    if (!consultation) {
      consultation = memoryStore.scans.find(s => s._id.toString() === id);
    }

    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation entry not found.'
      });
    }

    return res.json({
      success: true,
      consultation,
      scan: consultation
    });
  } catch (err) {
    next(err);
  }
};
