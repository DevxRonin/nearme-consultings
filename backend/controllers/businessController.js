const Business = require('../models/Business');
const Review = require('../models/Review');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');
const { calculateDistanceKm } = require('../services/recommendationService');

// @desc    Get all businesses with search, filter, sort & pagination
// @route   GET /api/businesses
// @access  Public
const getBusinesses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      city,
      minRating,
      maxPrice,
      sort,
      page = 1,
      limit = 9
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;

    if (isDbConnected()) {
      const query = { isActive: true };

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { services: { $elemMatch: { $regex: searchRegex } } },
          { city: searchRegex }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (city && city.trim() !== '') {
        query.city = new RegExp(city.trim(), 'i');
      }

      if (minRating) {
        query.rating = { $gte: parseFloat(minRating) };
      }

      if (maxPrice) {
        query.price = { $lte: parseFloat(maxPrice) };
      }

      let sortOption = { rating: -1, createdAt: -1 };
      if (sort === 'rating_desc') sortOption = { rating: -1 };
      else if (sort === 'price_asc') sortOption = { price: 1 };
      else if (sort === 'price_desc') sortOption = { price: -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };

      const skip = (pageNum - 1) * limitNum;
      const total = await Business.countDocuments(query);
      const businesses = await Business.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean();

      return res.json({
        success: true,
        data: businesses,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    }

    // In-memory fallback
    let list = memoryStore.businesses.filter((b) => b.isActive !== false);

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          (b.services && b.services.some((s) => s.toLowerCase().includes(q)))
      );
    }

    if (category && category !== 'All') {
      list = list.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    if (city && city.trim() !== '') {
      const c = city.trim().toLowerCase();
      list = list.filter((b) => b.city.toLowerCase().includes(c));
    }

    if (minRating) {
      const r = parseFloat(minRating);
      list = list.filter((b) => b.rating >= r);
    }

    if (maxPrice) {
      const p = parseFloat(maxPrice);
      list = list.filter((b) => b.price <= p);
    }

    if (sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      list.sort((a, b) => b.rating - a.rating);
    }

    const total = list.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby businesses using GeoJSON or Haversine
// @route   GET /api/businesses/nearby
// @access  Public
const getNearbyBusinesses = async (req, res, next) => {
  try {
    const {
      latitude,
      longitude,
      radius = 15,
      category,
      maxPrice,
      minRating,
      limit = 10
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude coordinates are required for nearby search'
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const radiusKm = parseFloat(radius);
    const limitNum = parseInt(limit, 10);

    let all = isDbConnected()
      ? await Business.find({ isActive: true }).lean()
      : memoryStore.businesses.filter((b) => b.isActive !== false);

    // Calculate real distance
    let withDistance = all
      .map((b) => {
        let dist = null;
        if (b.location && b.location.coordinates && b.location.coordinates.length === 2) {
          dist = calculateDistanceKm(
            lat,
            lon,
            b.location.coordinates[1],
            b.location.coordinates[0]
          );
        }
        return {
          ...b,
          distanceKm: dist
        };
      })
      .filter((b) => b.distanceKm === null || b.distanceKm <= radiusKm);

    if (category && category !== 'All') {
      withDistance = withDistance.filter(
        (b) => b.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (maxPrice) {
      withDistance = withDistance.filter((b) => b.price <= parseFloat(maxPrice));
    }

    if (minRating) {
      withDistance = withDistance.filter((b) => b.rating >= parseFloat(minRating));
    }

    withDistance.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    const results = withDistance.slice(0, limitNum);

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get business by ID or slug
// @route   GET /api/businesses/:id
// @access  Public
const getBusinessById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let business = null;

    if (isDbConnected()) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        business = await Business.findById(id).lean();
      } else {
        business = await Business.findOne({ slug: id }).lean();
      }

      if (!business) {
        return res.status(404).json({
          success: false,
          message: 'Consulting business not found'
        });
      }

      const reviews = await Review.find({ businessId: business._id })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      const related = await Business.find({
        category: business.category,
        _id: { $ne: business._id },
        isActive: true
      })
        .limit(3)
        .lean();

      return res.json({
        success: true,
        data: {
          ...business,
          reviews,
          relatedBusinesses: related
        }
      });
    }

    // In-memory
    business = memoryStore.businesses.find(
      (b) => b._id.toString() === id || b.slug === id
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Consulting business not found'
      });
    }

    const reviews = memoryStore.reviews.filter(
      (r) => r.businessId.toString() === business._id.toString()
    );

    const related = memoryStore.businesses
      .filter(
        (b) =>
          b.category === business.category &&
          b._id.toString() !== business._id.toString() &&
          b.isActive !== false
      )
      .slice(0, 3);

    res.json({
      success: true,
      data: {
        ...business,
        reviews,
        relatedBusinesses: related
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available consulting categories
// @route   GET /api/businesses/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const categoriesWithCount = await Business.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);

      const formatted = categoriesWithCount.map((item) => ({
        name: item._id,
        count: item.count
      }));

      return res.json({
        success: true,
        data: formatted
      });
    }

    // In-memory
    const map = {};
    memoryStore.businesses.forEach((b) => {
      if (b.isActive !== false) {
        map[b.category] = (map[b.category] || 0) + 1;
      }
    });

    const formatted = Object.keys(map)
      .sort()
      .map((k) => ({
        name: k,
        count: map[k]
      }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a business
// @route   GET /api/businesses/:id/reviews
// @access  Public
const getBusinessReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const reviews = await Review.find({ businessId: id })
        .sort({ createdAt: -1 })
        .lean();
      return res.json({
        success: true,
        count: reviews.length,
        data: reviews
      });
    }

    const reviews = memoryStore.reviews.filter(
      (r) => r.businessId.toString() === id.toString()
    );

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBusinesses,
  getNearbyBusinesses,
  getBusinessById,
  getCategories,
  getBusinessReviews
};
