const express = require('express');
const router = express.Router();
const { getClassSummary } = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/class/:classId', protect, getClassSummary);

module.exports = router;
