import api from './api';

export const getVisitors = (params) => api.get('/visitors', { params });
export const getVisitor = (id) => api.get(`/visitors/${id}`);
export const createVisitor = (data) => api.post('/visitors', data);
export const updateVisitor = (id, data) => api.put(`/visitors/${id}`, data);
export const checkIn = (id) => api.patch(`/visitors/${id}/checkin`);
export const checkOut = (id) => api.patch(`/visitors/${id}/checkout`);
export const updateStatus = (id, status) => api.patch(`/visitors/${id}/status`, { status });
export const searchVisitors = (q) => api.get('/visitors/search', { params: { q } });
