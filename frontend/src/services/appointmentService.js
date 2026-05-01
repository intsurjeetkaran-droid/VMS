import api from './api';

export const getAppointments = () => api.get('/appointments');
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, { status });
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);
