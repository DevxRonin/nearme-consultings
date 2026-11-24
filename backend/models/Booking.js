const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required']
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    service: {
      type: String,
      required: [true, 'Consulting service name is required']
    },
    bookingDate: {
      type: String, // Stored in YYYY-MM-DD
      required: [true, 'Booking date is required']
    },
    bookingTime: {
      type: String, // e.g., '10:00 AM'
      required: [true, 'Booking time slot is required']
    },
    location: {
      type: String,
      default: 'Online / In-Person'
    },
    requirements: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    },
    bookingReference: {
      type: String,
      unique: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to help query bookings by business and slot
bookingSchema.index({ businessId: 1, bookingDate: 1, bookingTime: 1 });
bookingSchema.index({ email: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
