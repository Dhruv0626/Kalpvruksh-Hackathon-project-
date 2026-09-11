const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createMaterial,
  getMaterials,
  deleteMaterial,
} = require('../controllers/materialController');

// All material routes require authenticated user
router.use(protect);

router.route('/')
  .post(createMaterial)
  .get(getMaterials);

router.route('/:id')
  .delete(deleteMaterial);

module.exports = router;
