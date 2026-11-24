const Booking = require('../models/Booking');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');
const {
  createConsultationBooking,
  cancelBookingById,
  checkSlotAvailability
} = require('../services/bookingService');

// @desc    Create a new consultation booking
// @route   POST /api/bookings
// @access  Public (or Authenticated)
const createBooking = async (req, res, next) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user ? req.user._id : req.body.userId || null
    };

    const booking = await createConsultationBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Consultation booking confirmed successfully!',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check slot availability
// @route   GET /api/bookings/check-availability
// @access  Public
const checkAvailability = async (req, res, next) => {
  try {
    const { businessId, bookingDate, bookingTime } = req.query;

    if (!businessId || !bookingDate || !bookingTime) {
      return res.status(400).json({
        success: false,
        message: 'businessId, bookingDate and bookingTime are required'
      });
    }

    const isAvailable = await checkSlotAvailability(businessId, bookingDate, bookingTime);

    res.json({
      success: true,
      available: isAvailable,
      message: isAvailable
        ? 'Time slot is available'
        : 'Time slot has already been reserved'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for logged-in user or by email
// @route   GET /api/bookings/my
// @access  Private / Public with email query
const getMyBookings = async (req, res, next) => {
  try {
    const userEmail = req.user ? req.user.email.toLowerCase() : req.query.email ? req.query.email.toLowerCase().trim() : null;
    const userId = req.user ? req.user._id.toString() : null;

    if (!userEmail && !userId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in or provide your booking email to access bookings'
      });
    }

    if (isDbConnected()) {
      const query = {
        $or: [
          ...(userId ? [{ userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : [])
        ]
      };

      const bookings = await Booking.find(query)
        .populate('businessId', 'name category address city phone email price rating images')
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    }

    // In-memory
    const filtered = memoryStore.bookings
      .filter((b) => {
        const matchesUser = userId && b.userId && b.userId.toString() === userId;
        const matchesEmail = userEmail && b.email && b.email.toLowerCase() === userEmail;
        return matchesUser || matchesEmail;
      })
      .map((b) => {
        const bus = memoryStore.businesses.find(
          (x) => x._id.toString() === (b.businessId._id || b.businessId).toString()
        );
        return {
          ...b,
          businessId: bus || b.businessId
        };
      })
      .reverse();

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID or reference
// @route   GET /api/bookings/:id
// @access  Public
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let booking;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        booking = await Booking.findById(id).populate(
          'businessId',
          'name category address city phone email price rating images'
        );
      } else {
        booking = await Booking.findOne({ bookingReference: id }).populate(
          'businessId',
          'name category address city phone email price rating images'
        );
      }

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking reference not found'
        });
      }

      return res.json({
        success: true,
        data: booking
      });
    }

    // In-memory
    const b = memoryStore.bookings.find(
      (item) => item._id.toString() === id || item.bookingReference === id
    );

    if (!b) {
      return res.status(404).json({
        success: false,
        message: 'Booking reference not found'
      });
    }

    const bus = memoryStore.businesses.find(
      (x) => x._id.toString() === (b.businessId._id || b.businessId).toString()
    );

    res.json({
      success: true,
      data: {
        ...b,
        businessId: bus || b.businessId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Public / Private
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cancelledBooking = await cancelBookingById(id, req.user);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  checkAvailability,
  getMyBookings,
  getBookingById,
  cancelBooking
};
