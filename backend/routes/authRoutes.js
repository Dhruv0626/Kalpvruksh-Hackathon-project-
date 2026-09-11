const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'edunova_default_jwt_secret', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new student or teacher
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { role, name, identifier, email, teacherId, password, departmentOrGrade, rollNumber } = req.body;

    const userEmail = (email || identifier || '').toLowerCase().trim();

    if (!userEmail || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (role === 'teacher' && !teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Teacher / Faculty ID is required for teacher registration',
      });
    }

    // Check if email already registered
    const existingEmail = await User.findOne({ email: userEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // If teacher, check if teacherId already registered
    if (role === 'teacher' && teacherId) {
      const existingTeacherId = await User.findOne({ teacherId: teacherId.trim() });
      if (existingTeacherId) {
        return res.status(400).json({
          success: false,
          message: 'A teacher with this ID is already registered',
        });
      }
    }

    // Create user
    const user = await User.create({
      role: role || 'student',
      name: name.trim(),
      email: userEmail,
      teacherId: role === 'teacher' && teacherId ? teacherId.trim() : undefined,
      rollNumber: role === 'student' ? (rollNumber || identifier || '').trim() : undefined,
      password,
      departmentOrGrade: departmentOrGrade ? departmentOrGrade.trim() : undefined,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        teacherId: user.teacherId,
        departmentOrGrade: user.departmentOrGrade,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate student or teacher & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { role, identifier, email, teacherId, password } = req.body;

    const loginIdentifier = (identifier || email || '').toLowerCase().trim();

    if (!loginIdentifier && !teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, ID, and password',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your password',
      });
    }

    // Query condition: match role and either email, teacherId, or rollNumber
    let query = { role: role || 'student' };

    if (role === 'teacher') {
      if (teacherId && loginIdentifier) {
        query.$or = [{ teacherId: teacherId.trim() }, { email: loginIdentifier }];
      } else if (teacherId) {
        query.teacherId = teacherId.trim();
      } else {
        query.email = loginIdentifier;
      }
    } else {
      // Student: identifier could be email or rollNumber
      query.$or = [{ email: loginIdentifier }, { rollNumber: loginIdentifier }];
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account does not exist for this role',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/ID or password',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        teacherId: user.teacherId,
        departmentOrGrade: user.departmentOrGrade,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user profile
// @access  Private (Protected by JWT)
router.get('/me', protect, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
