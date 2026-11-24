const { body, query, validationResult } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  };
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone').optional().trim()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const bookingValidation = [
  body('businessId').isMongoId().withMessage('Valid business ID is required'),
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email address is required'),
  body('phone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Please provide a valid phone number (10-15 digits)'),
  body('service').trim().notEmpty().withMessage('Consultation service is required'),
  body('bookingDate')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in YYYY-MM-DD format')
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error('Booking date cannot be in the past');
      }
      return true;
    }),
  body('bookingTime').trim().notEmpty().withMessage('Booking time slot is required')
];

const reviewValidation = [
  body('businessId').isMongoId().withMessage('Valid business ID is required'),
  body('userName').trim().notEmpty().withMessage('User name is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('comment')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Comment must be between 5 and 1000 characters')
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  bookingValidation,
  reviewValidation
};
