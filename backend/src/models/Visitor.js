/**
 * Visitor Model
 * - Core entity of the system
 * - Tracks visitor lifecycle: pending → approved/rejected → checked-in → checked-out
 */
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of visit is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    // The employee being visited
    host_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host employee is required'],
    },
    // Receptionist who registered this visitor
    registered_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'checked-in', 'checked-out'],
      default: 'pending',
    },
    entry_time: {
      type: Date,
      default: null,
    },
    exit_time: {
      type: Date,
      default: null,
    },
    // Optional: photo or ID scan path
    id_proof: {
      type: String,
      default: '',
    },
    // Blacklist flag — security module
    is_blacklisted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index for fast search by phone and name
visitorSchema.index({ phone: 1 });
visitorSchema.index({ name: 'text' });

module.exports = mongoose.model('Visitor', visitorSchema);
