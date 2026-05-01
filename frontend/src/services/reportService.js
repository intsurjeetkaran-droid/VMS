import api from './api';

export const getDashboardStats = () => api.get('/reports/stats');
export const getDailyReport = (days = 7) => api.get('/reports/daily', { params: { days } });
export const getRecentLogs = (limit = 20) => api.get('/reports/logs', { params: { limit } });
