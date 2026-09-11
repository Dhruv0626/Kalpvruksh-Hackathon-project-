const express = require('express');
const router = express.Router();
const {
  createClass,
  joinClass,
  leaveClass,
  getClasses,
  getActiveClasses,
  getClassById,
  endClass,
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createClass)
  .get(protect, getClasses);

router.get('/active', protect, getActiveClasses);
router.post('/join', protect, joinClass);
router.get('/:id', protect, getClassById);
router.post('/:id/leave', protect, leaveClass);
router.post('/:id/end', protect, endClass);

module.exports = router;
