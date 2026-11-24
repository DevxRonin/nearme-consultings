const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/authMiddleware');
const { validate, reviewValidation } = require('../utils/validators');

router.post('/', optionalAuth, validate(reviewValidation), createReview);

module.exports = router;
