/**
 * Appointment Controller
 */
const svc = require('../services/appointmentService');
const { successResponse } = require('../utils/apiResponse');

const create = async (req, res, next) => {
  try {
    const appt = await svc.createAppointment(req.body);
    return successResponse(res, { appointment: appt }, 'Appointment created', 201);
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const appointments = await svc.getAppointments(req.user);
    return successResponse(res, { appointments });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const appointment = await svc.getAppointmentById(req.params.id);
    return successResponse(res, { appointment });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await svc.updateAppointmentStatus(req.params.id, status, req.user._id);
    return successResponse(res, { appointment }, `Appointment ${status}`);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await svc.deleteAppointment(req.params.id);
    return successResponse(res, {}, 'Appointment deleted');
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getOne, updateStatus, remove };
