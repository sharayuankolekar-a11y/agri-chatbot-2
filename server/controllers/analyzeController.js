const { analyzeAgriQuery } = require('../services/agriAnalyzer');
const Consultation = require('../models/Consultation');
const { getStatus, memoryStore } = require('../config/db');

exports.analyzeContent = async (req, res, next) => {
  try {
    const { query, content, queryText, message: inputMsg, image, mode = 'AUTO', language = 'en', history = [], messages = [] } = req.body;
    const textToAnalyze = (query || queryText || content || inputMsg || '').trim();
    const chatHistory = Array.isArray(history) && history.length > 0 ? history : messages;

    console.log('POST /api/analyze RECEIVED');
    console.log('REQUEST BODY:', req.body);
    console.log('USER QUESTION:', textToAnalyze || '[Image Query]');

    if (!textToAnalyze && !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an agricultural query or upload a crop photo to analyze.'
      });
    }

    if (textToAnalyze.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Query length exceeds maximum limit.'
      });
    }

    const { isUnrelated, message: guardrailMsg, result, hasImage } = await analyzeAgriQuery(textToAnalyze, image, mode, language, chatHistory);

    if (isUnrelated) {
      const responsePayload = {
        success: true,
        isUnrelated: true,
        message: guardrailMsg || "I'm AgriSphere, an agriculture-focused assistant. I can help with crops, soil, irrigation, fertilizers, pests, diseases, farming practices, and other agriculture topics.",
        category: 'Agriculture Domain Guardrail',
        language
      };
      console.log('ANALYZE RESPONSE (GUARDRAIL):', responsePayload);
      return res.status(200).json(responsePayload);
    }

    const aiMessage = result.message || result.assessment || 'Agricultural guidance completed.';
    const savedId = `agri-${Date.now()}`;
    const categoryName = result.category || 'General Agriculture';
    const titleName = result.title || result.crop || 'Agricultural Advisory';

    const responsePayload = {
      success: true,
      isUnrelated: false,
      consultationId: savedId,
      message: aiMessage,
      title: titleName,
      category: categoryName,
      crop: result.crop || null,
      language,
      result: {
        consultationId: savedId,
        message: aiMessage,
        assessment: aiMessage,
        title: titleName,
        category: categoryName,
        crop: result.crop || null,
        recommendedActions: result.recommendedActions || [],
        warnings: result.warnings || [],
        followUpQuestion: result.followUpQuestion || null
      }
    };

    const consultationData = {
      category: categoryName,
      crop: result.crop || 'General Crop',
      queryText: textToAnalyze,
      hasImage,
      imageUrl: hasImage ? 'image-attached' : '',
      language,
      assessment: aiMessage,
      confidence: result.confidence || 90,
      symptoms: result.symptoms || [],
      causes: result.possibleCauses || [],
      recommendedActions: result.recommendedActions || [],
      prevention: result.prevention || [],
      createdAt: new Date()
    };

    const { isConnected } = getStatus();
    if (isConnected) {
      try {
        const newDoc = await Consultation.create(consultationData);
        responsePayload.consultationId = newDoc._id.toString();
        responsePayload.result.consultationId = newDoc._id.toString();
      } catch (dbErr) {
        console.warn('⚠️ Could not save consultation to MongoDB:', dbErr.message);
      }
    }

    const memEntry = { _id: savedId, ...consultationData };
    memoryStore.scans.unshift(memEntry);

    console.log('ANALYZE RESPONSE:', responsePayload);
    return res.status(200).json(responsePayload);

  } catch (err) {
    console.error('ANALYZE ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to process the agriculture query.'
    });
  }
};
