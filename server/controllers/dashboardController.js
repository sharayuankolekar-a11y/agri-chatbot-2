const Consultation = require('../models/Consultation');
const { getStatus, memoryStore } = require('../config/db');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const { isConnected } = getStatus();

    let allConsultations = [];
    if (isConnected) {
      allConsultations = await Consultation.find({}).sort({ createdAt: -1 });
    } else {
      allConsultations = [...memoryStore.scans];
    }

    const totalConsultations = allConsultations.length;
    let plantHealthCases = 0;
    let irrigationGuidance = 0;
    let fertilizerSoil = 0;
    let pestManagement = 0;
    const categoryCounts = {};

    for (const c of allConsultations) {
      const cat = c.category || 'General Agriculture';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      if (cat.includes('Disease') || cat.includes('Health')) plantHealthCases++;
      else if (cat.includes('Irrigation')) irrigationGuidance++;
      else if (cat.includes('Fertilizer') || cat.includes('Soil')) fertilizerSoil++;
      else if (cat.includes('Pest')) pestManagement++;
    }

    const categories = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      count: categoryCounts[cat]
    })).sort((a, b) => b.count - a.count);

    return res.json({
      success: true,
      stats: {
        totalConsultations,
        plantHealthCases,
        irrigationGuidance,
        fertilizerSoil,
        pestManagement,
        categories,
        recentConsultations: allConsultations.slice(0, 5)
      }
    });

  } catch (err) {
    next(err);
  }
};
