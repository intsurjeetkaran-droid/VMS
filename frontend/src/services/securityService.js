import api from './api';

export const getBlacklist = () => api.get('/security/blacklist');
export const blacklistVisitor = (id, reason) => api.patch(`/security/blacklist/${id}`, { reason });
export const unblacklistVisitor = (id) => api.patch(`/security/unblacklist/${id}`);
