const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validate,
  registerValidation,
  loginValidation
} = require('../utils/validators');

router.post('/register', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);
router.get('/me', protect, getMe);

module.exports = router;
