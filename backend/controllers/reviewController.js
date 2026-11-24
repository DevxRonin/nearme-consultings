const Review = require('../models/Review');
const Business = require('../models/Business');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');

// @desc    Add review for a business
// @route   POST /api/reviews
// @access  Public / Authenticated
const createReview = async (req, res, next) => {
  try {
    const { businessId, userName, rating, comment } = req.body;
    const bId = businessId.toString();

    if (isDbConnected()) {
      const business = await Business.findById(businessId);
      if (!business) {
        return res.status(404).json({
          success: false,
          message: 'Business not found'
        });
      }

      const review = await Review.create({
        userId: req.user ? req.user._id : null,
        userName: userName || (req.user ? req.user.name : 'Anonymous Client'),
        businessId,
        rating: Number(rating),
        comment
      });

      const allReviews = await Review.find({ businessId });
      const avgRating =
        allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;

      business.rating = parseFloat(avgRating.toFixed(1));
      business.reviewCount = allReviews.length;
      await business.save();

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review
      });
    }

    // In-memory
    const business = memoryStore.businesses.find((b) => b._id.toString() === bId);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    const newReview = {
      _id: memoryStore.generateId(),
      userId: req.user ? req.user._id : null,
      userName: userName || (req.user ? req.user.name : 'Anonymous Client'),
      businessId: business._id,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };
    memoryStore.reviews.push(newReview);

    const bReviews = memoryStore.reviews.filter((r) => r.businessId.toString() === bId);
    const avg = bReviews.reduce((sum, r) => sum + r.rating, 0) / bReviews.length;
    business.rating = parseFloat(avg.toFixed(1));
    business.reviewCount = bReviews.length;

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview
};
