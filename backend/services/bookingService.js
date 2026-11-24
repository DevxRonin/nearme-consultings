const Booking = require('../models/Booking');
const Business = require('../models/Business');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');

// Helper to generate a memorable and secure booking reference
const generateBookingReference = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `NMC-${dateStr}-${randomStr}`;
};

/**
 * Check if the consultant has a slot conflict
 */
const checkSlotAvailability = async (businessId, bookingDate, bookingTime) => {
  if (isDbConnected()) {
    const existingBooking = await Booking.findOne({
      businessId,
      bookingDate,
      bookingTime,
      status: { $in: ['confirmed', 'pending'] }
    });
    return !existingBooking;
  }

  // In-memory check
  const bId = businessId.toString();
  const conflict = memoryStore.bookings.find(
    (b) =>
      b.businessId.toString() === bId &&
      b.bookingDate === bookingDate &&
      b.bookingTime === bookingTime &&
      ['confirmed', 'pending'].includes(b.status)
  );

  return !conflict;
};

/**
 * Create a new consultation booking
 */
const createConsultationBooking = async (bookingData) => {
  const {
    userId,
    businessId,
    customerName,
    email,
    phone,
    service,
    bookingDate,
    bookingTime,
    location,
    requirements
  } = bookingData;

  const bIdStr = businessId.toString();

  // 1. Verify business exists and is active
  let business = null;
  if (isDbConnected()) {
    business = await Business.findById(businessId);
  } else {
    business = memoryStore.businesses.find((b) => b._id.toString() === bIdStr);
  }

  if (!business || business.isActive === false) {
    throw new Error('Selected consulting business is not available');
  }

  // 2. Check slot conflict / availability
  const isAvailable = await checkSlotAvailability(businessId, bookingDate, bookingTime);
  if (!isAvailable) {
    throw new Error(
      `The selected time slot (${bookingTime} on ${bookingDate}) has already been reserved for ${business.name}. Please select another time or date.`
    );
  }

  // 3. Create booking with unique reference
  let bookingReference = generateBookingReference();

  if (isDbConnected()) {
    let duplicate = await Booking.findOne({ bookingReference });
    while (duplicate) {
      bookingReference = generateBookingReference();
      duplicate = await Booking.findOne({ bookingReference });
    }

    const newBooking = await Booking.create({
      userId: userId || null,
      businessId,
      customerName,
      email: email.toLowerCase(),
      phone,
      service,
      bookingDate,
      bookingTime,
      location: location || `${business.city} / Online`,
      requirements: requirements || '',
      status: 'confirmed',
      bookingReference
    });

    const populatedBooking = await Booking.findById(newBooking._id).populate(
      'businessId',
      'name category address city phone email price rating images'
    );
    return populatedBooking;
  }

  // In-memory booking
  const newBooking = {
    _id: memoryStore.generateId(),
    userId: userId || null,
    businessId: business._id,
    customerName,
    email: email.toLowerCase(),
    phone,
    service,
    bookingDate,
    bookingTime,
    location: location || `${business.city} / Online`,
    requirements: requirements || '',
    status: 'confirmed',
    bookingReference,
    createdAt: new Date().toISOString()
  };

  memoryStore.bookings.push(newBooking);

  return {
    ...newBooking,
    businessId: {
      _id: business._id,
      name: business.name,
      category: business.category,
      address: business.address,
      city: business.city,
      phone: business.phone,
      email: business.email,
      price: business.price,
      rating: business.rating,
      images: business.images
    }
  };
};

/**
 * Cancel a booking
 */
const cancelBookingById = async (bookingId, user) => {
  if (isDbConnected()) {
    let booking;
    if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(bookingId);
    } else {
      booking = await Booking.findOne({ bookingReference: bookingId });
    }
    if (!booking) throw new Error('Booking not found');

    if (user) {
      const isOwner =
        (booking.userId && booking.userId.toString() === user._id.toString()) ||
        booking.email.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';
      if (!isOwner && !isAdmin) throw new Error('Unauthorized to cancel this booking');
    }

    if (booking.status === 'cancelled') throw new Error('Booking is already cancelled');

    booking.status = 'cancelled';
    await booking.save();
    return booking;
  }

  // In-memory
  const booking = memoryStore.bookings.find(
    (b) => b._id.toString() === bookingId.toString() || b.bookingReference === bookingId
  );
  if (!booking) throw new Error('Booking not found');

  if (user) {
    const isOwner =
      (booking.userId && booking.userId.toString() === user._id.toString()) ||
      booking.email.toLowerCase() === user.email.toLowerCase();
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new Error('Unauthorized to cancel this booking');
  }

  if (booking.status === 'cancelled') throw new Error('Booking is already cancelled');

  booking.status = 'cancelled';
  booking.updatedAt = new Date().toISOString();
  return booking;
};

module.exports = {
  checkSlotAvailability,
  createConsultationBooking,
  cancelBookingById,
  generateBookingReference
};
