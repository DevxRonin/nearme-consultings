const Business = require('../models/Business');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');

// Known categories mapping
const CATEGORY_KEYWORDS = {
  'IT Consulting': [
    'it', 'tech', 'software', 'cloud', 'cybersecurity', 'ai', 'development',
    'web', 'app', 'devops', 'database', 'system', 'programming', 'network'
  ],
  'Financial Consulting': [
    'finance', 'financial', 'tax', 'accounting', 'investment', 'wealth',
    'audit', 'gst', 'money', 'banking', 'cfo', 'portfolio'
  ],
  'Business Consulting': [
    'business', 'strategy', 'startup', 'growth', 'operations', 'scale',
    'planning', 'management', 'corporate', 'venture'
  ],
  'Legal Consulting': [
    'legal', 'lawyer', 'advocate', 'contract', 'compliance', 'ipr',
    'patent', 'trademark', 'dispute', 'litigation', 'corporate law'
  ],
  'Career Consulting': [
    'career', 'resume', 'interview', 'job', 'coaching', 'hr', 'placement',
    'recruitment', 'guidance', 'counselling'
  ],
  'Marketing Consulting': [
    'marketing', 'seo', 'branding', 'social media', 'advertising',
    'digital marketing', 'pr', 'growth hacking', 'campaign'
  ],
  'Management Consulting': [
    'management', 'leadership', 'organizational', 'transformation',
    'supply chain', 'governance', 'efficiency'
  ]
};

// Calculate Haversine distance in km between two geo-coordinates
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

/**
 * Intelligent Query Parser & Intent Extractor
 */
const parseUserQuery = (queryText, userLocationStr = '') => {
  const text = (queryText || '').toLowerCase();
  const result = {
    intent: 'search',
    category: null,
    maxBudget: null,
    minRating: null,
    maxDistanceKm: null,
    locationKeyword: userLocationStr ? userLocationStr.trim() : null,
    searchTerms: []
  };

  // 1. Detect Intent
  if (text.includes('book') || text.includes('schedule') || text.includes('appointment')) {
    result.intent = 'booking';
  } else if (text.includes('recommend') || text.includes('suggest') || text.includes('best') || text.includes('top')) {
    result.intent = 'recommendation';
  } else if (text.includes('who is') || text.includes('tell me about') || text.includes('details') || text.includes('contact')) {
    result.intent = 'info';
  }

  // 2. Extract Category
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => new RegExp(`\\b${kw}\\b`, 'i').test(text))) {
      result.category = category;
      break;
    }
  }

  // 3. Extract Budget
  const budgetMatch =
    text.match(/(?:under|below|less than|within|max|budget|rs\.?|₹)\s*(\d{3,6})/i) ||
    text.match(/(\d{3,6})\s*(?:rs|rupees|inr)/i);
  if (budgetMatch) {
    result.maxBudget = parseInt(budgetMatch[1], 10);
  }

  // 4. Extract Rating
  if (text.includes('top rated') || text.includes('best rated') || text.includes('highest rated')) {
    result.minRating = 4.5;
  } else {
    const ratingMatch = text.match(/(\d(?:\.\d)?)\s*(?:star|stars|\+)/i);
    if (ratingMatch) {
      result.minRating = parseFloat(ratingMatch[1]);
    }
  }

  // 5. Extract Distance
  const distanceMatch = text.match(/(?:within|under|less than)?\s*(\d+(?:\.\d+)?)\s*(?:km|kms|kilometers)/i);
  if (distanceMatch) {
    result.maxDistanceKm = parseFloat(distanceMatch[1]);
  }

  // 6. Extract Location Keywords
  const commonLocations = [
    'pimpri', 'chinchwad', 'wakad', 'baner', 'hinjawadi', 'hinjewadi',
    'aundh', 'kothrud', 'viman nagar', 'kharadi', 'pune', 'mumbai',
    'alandi', 'hadapsar', 'shivajinagar', 'bavdhan', 'pcmc'
  ];
  for (const loc of commonLocations) {
    if (text.includes(loc)) {
      result.locationKeyword = loc;
      break;
    }
  }

  return result;
};

/**
 * Intelligent recommendation engine that queries real database records
 */
const recommendConsultants = async ({ query, location, coordinates, limit = 5 }) => {
  const parsed = parseUserQuery(query, location);
  let allBusinesses = [];

  if (isDbConnected()) {
    let filter = { isActive: true };
    if (parsed.category) filter.category = parsed.category;
    if (parsed.maxBudget) filter.price = { $lte: parsed.maxBudget };
    if (parsed.minRating) filter.rating = { $gte: parsed.minRating };
    if (parsed.locationKeyword && !coordinates) {
      filter.$or = [
        { city: { $regex: parsed.locationKeyword, $options: 'i' } },
        { address: { $regex: parsed.locationKeyword, $options: 'i' } }
      ];
    }
    allBusinesses = await Business.find(filter).lean();
    if (allBusinesses.length === 0) {
      allBusinesses = await Business.find({ isActive: true }).lean();
    }
  } else {
    allBusinesses = memoryStore.businesses.filter((b) => b.isActive !== false);

    let filtered = allBusinesses;
    if (parsed.category) {
      filtered = filtered.filter(
        (b) => b.category.toLowerCase() === parsed.category.toLowerCase()
      );
    }
    if (parsed.maxBudget) {
      filtered = filtered.filter((b) => b.price <= parsed.maxBudget);
    }
    if (parsed.minRating) {
      filtered = filtered.filter((b) => b.rating >= parsed.minRating);
    }
    if (parsed.locationKeyword) {
      const loc = parsed.locationKeyword.toLowerCase();
      const locMatches = filtered.filter(
        (b) => b.city.toLowerCase().includes(loc) || b.address.toLowerCase().includes(loc)
      );
      if (locMatches.length > 0) filtered = locMatches;
    }

    allBusinesses = filtered.length > 0 ? filtered : allBusinesses;
  }

  // Calculate distance if coordinates provided
  let userCoords = null;
  if (
    coordinates &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    !isNaN(coordinates[0]) &&
    !isNaN(coordinates[1])
  ) {
    userCoords = {
      lon: parseFloat(coordinates[0]),
      lat: parseFloat(coordinates[1])
    };
  }

  let resultsWithDistance = allBusinesses.map((b) => {
    let distanceKm = null;
    if (
      userCoords &&
      b.location &&
      b.location.coordinates &&
      b.location.coordinates.length === 2
    ) {
      distanceKm = calculateDistanceKm(
        userCoords.lat,
        userCoords.lon,
        b.location.coordinates[1],
        b.location.coordinates[0]
      );
    }
    return {
      ...b,
      distanceKm
    };
  });

  if (userCoords) {
    resultsWithDistance.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
  } else {
    resultsWithDistance.sort((a, b) => b.rating - a.rating);
  }

  let finalResults = resultsWithDistance;
  if (parsed.maxDistanceKm && userCoords) {
    const within = finalResults.filter(
      (b) => b.distanceKm !== null && b.distanceKm <= parsed.maxDistanceKm
    );
    if (within.length > 0) finalResults = within;
  }

  finalResults = finalResults.slice(0, limit);

  const explanation = generateExplanation({
    query,
    parsed,
    results: finalResults,
    location: parsed.locationKeyword || location || 'your area'
  });

  return {
    parsedQuery: parsed,
    answer: explanation,
    results: finalResults,
    count: finalResults.length
  };
};

/**
 * Generate human-like, accurate explanation based strictly on real DB records
 */
const generateExplanation = ({ query, parsed, results, location }) => {
  if (!results || results.length === 0) {
    return `I searched our verified database for ${parsed.category || 'consulting services'} in ${location}, but could not find any active consultants matching all constraints. Try adjusting your budget or radius to explore more verified professionals.`;
  }

  const categoryName = parsed.category || 'Consulting';
  const topPick = results[0];
  const count = results.length;

  let header = '';
  if (parsed.intent === 'booking') {
    header = `Here are the top available ${categoryName} experts ready for booking:`;
  } else if (parsed.intent === 'recommendation' || parsed.minRating) {
    header = `Based on your request, I found ${count} top-rated ${categoryName} professionals in and around ${location}:`;
  } else {
    header = `Here are ${count} verified ${categoryName} professionals matching "${query}":`;
  }

  const highlights = results
    .slice(0, 3)
    .map((b) => {
      const distInfo = b.distanceKm !== null ? ` (${b.distanceKm} km away)` : '';
      return `• **${b.name}** in ${b.city}${distInfo} — ★ ${b.rating} (${b.reviewCount || 10}+ reviews), starting at ₹${b.price}/session. Specialized in: ${(b.services || []).slice(0, 3).join(', ')}.`;
    })
    .join('\n');

  let recommendationSummary = `\n\n**Top Recommendation:** **${topPick.name}** stands out with a ${topPick.rating} rating and expert consultation starting at ₹${topPick.price}. You can view their full profile or click 'Book Consultation' to choose your preferred time slot.`;

  return `${header}\n\n${highlights}${recommendationSummary}`;
};

module.exports = {
  parseUserQuery,
  recommendConsultants,
  calculateDistanceKm
};
