const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  gradeSubmission,
  aiEvaluateSubmission,
  deleteAssignment,
} = require('../controllers/assignmentController');

// All assignment routes require authenticated user
router.use(protect);

router.route('/')
  .post(createAssignment)
  .get(getAssignments);

router.route('/:id')
  .get(getAssignmentById)
  .delete(deleteAssignment);

router.post('/:id/submit', submitAssignment);
router.post('/submissions/:submissionId/grade', gradeSubmission);
router.post('/submissions/:submissionId/ai-evaluate', aiEvaluateSubmission);

module.exports = router;
