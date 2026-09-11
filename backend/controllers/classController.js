const Class = require('../models/Class');
const User = require('../models/User');

// Helper to generate 6-character class code if none provided
function generateCode(prefix = 'CS') {
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
}

// @desc    Create a new class session
// @route   POST /api/classes
// @access  Private (Teacher)
exports.createClass = async (req, res) => {
  try {
    const { className, subject, topic, classCode } = req.body;

    if (!className || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course name and subject',
      });
    }

    const code = (classCode || generateCode()).toUpperCase().trim();

    // Check if code already exists
    const existing = await Class.findOne({ classCode: code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Class code ${code} is already in use. Please choose another code.`,
      });
    }

    const newClass = await Class.create({
      className: className.trim(),
      subject: subject.trim(),
      topic: topic ? topic.trim() : 'Live Classroom Session',
      classCode: code,
      teacherId: req.user._id,
      status: 'active',
      students: [],
    });

    return res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: newClass,
    });
  } catch (error) {
    console.error('Create Class Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating class',
    });
  }
};

// @desc    Join class with class code
// @route   POST /api/classes/join
// @access  Private (Student)
exports.joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;

    if (!classCode) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a 6-character class code',
      });
    }

    const code = classCode.toUpperCase().trim();
    const classSession = await Class.findOne({ classCode: code }).populate('teacherId', 'name email teacherId');

    if (!classSession) {
      return res.status(404).json({
        success: false,
        message: `No active class found with code ${code}`,
      });
    }

    if (classSession.status === 'ended') {
      return res.status(400).json({
        success: false,
        message: `This classroom session (${classSession.className}) has already ended. You cannot join a closed lecture.`,
      });
    }

    // Add student to class if not already enrolled
    const studentId = req.user._id;
    if (!classSession.students.some((id) => id.toString() === studentId.toString())) {
      classSession.students.push(studentId);
      await classSession.save();
    }

    return res.json({
      success: true,
      message: `Successfully joined ${classSession.className}`,
      class: classSession,
    });
  } catch (error) {
    console.error('Join Class Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while joining class',
    });
  }
};

// @desc    Get all classes for current user
// @route   GET /api/classes
// @access  Private
exports.getClasses = async (req, res) => {
  try {
    let classes;
    if (req.user.role === 'teacher') {
      classes = await Class.find({ teacherId: req.user._id }).sort({ createdAt: -1 });
    } else {
      classes = await Class.find({ students: req.user._id }).sort({ createdAt: -1 });
    }

    return res.json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    console.error('Get Classes Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while retrieving classes',
    });
  }
};

// @desc    Get single class by ID
// @route   GET /api/classes/:id
// @access  Private
exports.getClassById = async (req, res) => {
  try {
    const classSession = await Class.findById(req.params.id)
      .populate('teacherId', 'name email teacherId departmentOrGrade')
      .populate('students', 'name email rollNumber');

    if (!classSession) {
      return res.status(404).json({
        success: false,
        message: 'Class session not found',
      });
    }

    return res.json({
      success: true,
      class: classSession,
    });
  } catch (error) {
    console.error('Get Class By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while retrieving class details',
    });
  }
};

// @desc    End class session
// @route   POST /api/classes/:id/end
// @access  Private (Teacher)
exports.endClass = async (req, res) => {
  try {
    const classSession = await Class.findById(req.params.id);

    if (!classSession) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    classSession.status = 'ended';
    classSession.endedAt = new Date();
    await classSession.save();

    return res.json({
      success: true,
      message: 'Class session ended successfully',
      class: classSession,
    });
  } catch (error) {
    console.error('End Class Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while ending class',
    });
  }
};

// @desc    Leave/Exit class session
// @route   POST /api/classes/:id/leave
// @access  Private (Student)
exports.leaveClass = async (req, res) => {
  try {
    const classSession = await Class.findById(req.params.id);

    if (!classSession) {
      return res.status(404).json({
        success: false,
        message: 'Class session not found',
      });
    }

    // Remove student from students array
    const studentId = req.user._id.toString();
    classSession.students = classSession.students.filter(
      (id) => id.toString() !== studentId
    );
    await classSession.save();

    return res.json({
      success: true,
      message: 'Successfully exited live class session',
      class: classSession,
    });
  } catch (error) {
    console.error('Leave Class Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while leaving class',
    });
  }
};

// @desc    Get all active ongoing classes (for joining / live list)
// @route   GET /api/classes/active
// @access  Private
exports.getActiveClasses = async (req, res) => {
  try {
    const classes = await Class.find({ status: 'active' })
      .populate('teacherId', 'name email teacherId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    console.error('Get Active Classes Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while retrieving active classes',
    });
  }
};
