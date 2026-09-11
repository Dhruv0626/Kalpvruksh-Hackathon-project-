const express = require('express');
const router = express.Router();
const {
  submitQuestion,
  getClassQuestions,
  upvoteQuestion,
  answerQuestionGroup,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitQuestion);
router.get('/class/:classId', protect, getClassQuestions);
router.post('/:id/vote', protect, upvoteQuestion);
router.post('/:groupId/answer', protect, answerQuestionGroup);

module.exports = router;
