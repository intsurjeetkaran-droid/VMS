/**
 * Log Model
 * - Records every check-in and check-out event
 * - Used for reports and audit trail
 */
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['checkin', 'checkout'],
      required: true,
    },
    visitor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: true,
    },
    // The receptionist who performed the action
    performed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Log', logSchema);
