import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

export const analyzeContent = async (payload) => {
  const startTime = Date.now();
  try {
    // payload can be string or object { queryText, content, message, image, mode, language }
    const body = typeof payload === 'string'
      ? { message: payload, queryText: payload, content: payload }
      : { message: payload.queryText || payload.message || payload.content, queryText: payload.queryText || payload.message, ...payload };
    const res = await client.post('/analyze', body);
    const elapsed = Date.now() - startTime;
    if (elapsed < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
    }
    const data = res.data;
    console.log('API RESPONSE:', data);
    return data;
  } catch (err) {
    const elapsed = Date.now() - startTime;
    if (elapsed < 1000) {
      await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
    }
    if (err.response && err.response.data) {
      console.log('API RESPONSE (ERROR DATA):', err.response.data);
      return err.response.data;
    }
    console.error('API NETWORK ERROR:', err.message);
    return { success: false, error: err.message || 'Failed to connect to AgriSphere API service.' };
  }
};

export const getHistory = async (params = {}) => {
  try {
    const res = await client.get('/history', { params });
    return res.data;
  } catch (err) {
    console.warn('History API offline, returning empty result:', err.message);
    return { success: false, count: 0, consultations: [], scans: [] };
  }
};

export const getScanDetails = async (id) => {
  try {
    const res = await client.get(`/history/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.message || 'Unable to fetch consultation details.');
  }
};

export const getDashboardStats = async () => {
  try {
    const res = await client.get('/dashboard');
    return res.data;
  } catch (err) {
    console.warn('Dashboard API offline:', err.message);
    return {
      success: false,
      stats: {
        totalConsultations: 0,
        plantHealthCases: 0,
        irrigationGuidance: 0,
        fertilizerSoil: 0,
        pestManagement: 0,
        categories: [],
        recentConsultations: []
      }
    };
  }
};

export const submitFeedback = async (consultationId, isHelpful, comment = '') => {
  try {
    const res = await client.post('/feedback', { consultationId, scanId: consultationId, isHelpful, comment });
    return res.data;
  } catch (err) {
    return { success: false, error: err.message };
  }
};
