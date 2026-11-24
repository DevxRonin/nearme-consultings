const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getNearbyBusinesses,
  getCategories,
  getBusinessById,
  getBusinessReviews
} = require('../controllers/businessController');

// Specific endpoints before :id to prevent param collision
router.get('/', getBusinesses);
router.get('/nearby', getNearbyBusinesses);
router.get('/categories', getCategories);
router.get('/:id', getBusinessById);
router.get('/:id/reviews', getBusinessReviews);

module.exports = router;
