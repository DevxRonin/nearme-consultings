const express = require('express');
const router = express.Router();
const { handleAIChat, handleRecommend } = require('../controllers/aiController');

router.post('/chat', handleAIChat);
router.post('/recommend', handleRecommend);

module.exports = router;
