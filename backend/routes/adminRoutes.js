const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  updateBookingStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/bookings', protect, admin, getAllBookings);
router.patch('/bookings/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
