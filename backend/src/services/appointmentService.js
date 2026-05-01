/**
 * Appointment Service
 * - Pre-book visits before arrival
 * - Employee approves/rejects appointments
 * - Receptionist can convert approved appointment → visitor record
 */
const Appointment = require('../models/Appointment');
const logger = require('../utils/logger');

const createAppointment = async (data) => {
  const appointment = await Appointment.create(data);
  logger.info('Appointment created', { appointmentId: appointment._id });
  return appointment;
};

const getAppointments = async (user) => {
  const query = user.role === 'employee' ? { host_id: user._id } : {};
  return Appointment.find(query)
    .populate('host_id', 'name email department')
    .sort({ scheduled_time: -1 });
};

const getAppointmentById = async (id) => {
  const appt = await Appointment.findById(id).populate('host_id', 'name email department');
  if (!appt) {
    const err = new Error('Appointment not found');
    err.statusCode = 404;
    throw err;
  }
  return appt;
};

/**
 * Employee approves or rejects an appointment assigned to them
 */
const updateAppointmentStatus = async (id, status, employeeId) => {
  const appt = await Appointment.findOne({ _id: id, host_id: employeeId });
  if (!appt) {
    const err = new Error('Appointment not found or not assigned to you');
    err.statusCode = 404;
    throw err;
  }
  appt.status = status;
  await appt.save();
  logger.info('Appointment status updated', { appointmentId: id, status, employeeId });
  return appt;
};

const deleteAppointment = async (id) => {
  const appt = await Appointment.findByIdAndDelete(id);
  if (!appt) {
    const err = new Error('Appointment not found');
    err.statusCode = 404;
    throw err;
  }
  logger.info('Appointment deleted', { appointmentId: id });
  return appt;
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};
