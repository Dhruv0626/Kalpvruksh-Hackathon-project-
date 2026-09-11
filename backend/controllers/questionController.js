const Question = require('../models/Question');
const QuestionGroup = require('../models/QuestionGroup');
const Answer = require('../models/Answer');
const Class = require('../models/Class');
const aiService = require('../services/aiService');

// @desc    Submit student doubt & cluster with AI
// @route   POST /api/questions
// @access  Private (Student)
exports.submitQuestion = async (req, res) => {
  try {
    const { classId, text, category, isAnonymous } = req.body;

    if (!classId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide class ID and question text',
      });
    }

    const trimmedText = text.trim();
    const studentId = req.user._id;

    // 1. Process with AI clustering service
    const aiResult = await aiService.processQuestionWithAi(classId, trimmedText, category);

    // 2. Save individual question record
    const question = await Question.create({
      classId,
      studentId,
      text: trimmedText,
      category: aiResult.category,
      priority: aiResult.priority,
      groupId: aiResult.group._id,
      status: 'grouped',
      isAnonymous: Boolean(isAnonymous),
    });

    return res.status(201).json({
      success: true,
      message: aiResult.isNewGroup
        ? 'Question posted and prioritized by AI'
        : `Question automatically grouped under: "${aiResult.group.mainQuestion}"`,
      question,
      group: aiResult.group,
      isNewGroup: aiResult.isNewGroup,
    });
  } catch (error) {
    console.error('Submit Question Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while processing question',
    });
  }
};

// @desc    Get all question groups and questions for a class
// @route   GET /api/classes/:classId/questions
// @access  Private
exports.getClassQuestions = async (req, res) => {
  try {
    const { classId } = req.params;

    // Get all groups for this class
    const groups = await QuestionGroup.find({ classId })
      .sort({ classWide: -1, priority: 1, createdAt: -1 })
      .lean();

    // Attach individual questions for each group
    const groupsWithQuestions = await Promise.all(
      groups.map(async (grp) => {
        const questions = await Question.find({ groupId: grp._id })
          .populate('studentId', 'name email rollNumber')
          .lean();

        const formattedQuestions = questions.map((q) => ({
          id: q._id,
          text: q.text,
          studentName: q.isAnonymous ? 'Anonymous Student' : (q.studentId?.name || 'Student'),
          createdAt: q.createdAt,
        }));

        return {
          ...grp,
          id: grp._id,
          questions: formattedQuestions,
        };
      })
    );

    return res.json({
      success: true,
      count: groupsWithQuestions.length,
      groups: groupsWithQuestions,
    });
  } catch (error) {
    console.error('Get Class Questions Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching questions',
    });
  }
};

// @desc    Upvote question / "Same Doubt" on group or question
// @route   POST /api/questions/:id/vote
// @access  Private
exports.upvoteQuestion = async (req, res) => {
  try {
    const targetId = req.params.id;

    // Check if target is a QuestionGroup
    const group = await QuestionGroup.findById(targetId);
    if (group) {
      group.studentCount = (group.studentCount || 1) + 1;
      if (group.studentCount >= 3) {
        group.classWide = true;
      }
      await group.save();

      return res.json({
        success: true,
        message: 'Upvote recorded on question cluster',
        group,
      });
    }

    // Otherwise check if it is a specific Question
    const question = await Question.findById(targetId);
    if (question) {
      const userId = req.user._id;
      const hasVoted = question.upvotes.some((id) => id.toString() === userId.toString());

      if (!hasVoted) {
        question.upvotes.push(userId);
        await question.save();

        if (question.groupId) {
          const parentGroup = await QuestionGroup.findById(question.groupId);
          if (parentGroup) {
            parentGroup.studentCount = (parentGroup.studentCount || 1) + 1;
            if (parentGroup.studentCount >= 3) {
              parentGroup.classWide = true;
            }
            await parentGroup.save();
          }
        }
      }

      return res.json({
        success: true,
        upvotesCount: question.upvotes.length,
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Question or doubt cluster not found',
    });
  } catch (error) {
    console.error('Upvote Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during upvote',
    });
  }
};

// @desc    Answer a question group
// @route   POST /api/questions/:groupId/answer
// @access  Private (Teacher)
exports.answerQuestionGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { answer } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the instructor answer',
      });
    }

    const group = await QuestionGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Question group not found',
      });
    }

    // 1. Create Answer document
    const answerDoc = await Answer.create({
      groupId: group._id,
      classId: group.classId,
      teacherId: req.user._id,
      answer: answer.trim(),
    });

    // 2. Update QuestionGroup status and answer field
    group.status = 'answered';
    group.answer = {
      text: answer.trim(),
      teacherId: req.user._id,
      answeredAt: new Date(),
    };
    await group.save();

    // 3. Mark all questions under this group as answered
    await Question.updateMany({ groupId: group._id }, { status: 'answered' });

    return res.json({
      success: true,
      message: 'Answer broadcasted to all related students',
      group,
      answer: answerDoc,
    });
  } catch (error) {
    console.error('Answer Question Group Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting answer',
    });
  }
};
