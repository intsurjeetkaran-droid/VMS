/**
 * Appointment Model
 * - Allows pre-booking a visit before arrival
 * - Employee approves/rejects the appointment
 */
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    visitor_name: { type: String, required: true, trim: true },
    visitor_phone: { type: String, required: true, trim: true },
    visitor_email: { type: String, trim: true, lowercase: true, default: '' },
    purpose: { type: String, required: true, trim: true },
    // The employee being visited
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scheduled_time: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
