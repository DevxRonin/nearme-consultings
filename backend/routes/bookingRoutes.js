const express = require('express');
const router = express.Router();
const {
  createBooking,
  checkAvailability,
  getMyBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');
const { validate, bookingValidation } = require('../utils/validators');

router.post('/', optionalAuth, validate(bookingValidation), createBooking);
router.get('/check-availability', checkAvailability);
router.get('/my', optionalAuth, getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', optionalAuth, cancelBooking);

module.exports = router;
