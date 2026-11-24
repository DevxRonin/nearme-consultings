const Booking = require('../models/Booking');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isDbConnected()) {
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }

      const skip = (pageNum - 1) * limitNum;
      const total = await Booking.countDocuments(query);
      const bookings = await Booking.find(query)
        .populate('businessId', 'name category price phone email city')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      return res.json({
        success: true,
        count: bookings.length,
        pagination: {
          total,
          page: pageNum,
          totalPages: Math.ceil(total / limitNum)
        },
        data: bookings
      });
    }

    // In-memory
    let list = memoryStore.bookings;
    if (status && status !== 'all') {
      list = list.filter((b) => b.status === status);
    }

    const total = list.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum).map((b) => {
      const bus = memoryStore.businesses.find(
        (x) => x._id.toString() === (b.businessId._id || b.businessId).toString()
      );
      return {
        ...b,
        businessId: bus || b.businessId
      };
    });

    res.json({
      success: true,
      count: paginated.length,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      },
      data: paginated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be pending, confirmed, cancelled, or completed'
      });
    }

    if (isDbConnected()) {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      booking.status = status;
      await booking.save();

      return res.json({
        success: true,
        message: `Booking status updated to ${status}`,
        data: booking
      });
    }

    // In-memory
    const booking = memoryStore.bookings.find(
      (b) => b._id.toString() === id || b.bookingReference === id
    );
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  updateBookingStatus
};
