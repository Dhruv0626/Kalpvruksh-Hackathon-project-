const Question = require('../models/Question');
const QuestionGroup = require('../models/QuestionGroup');
const Class = require('../models/Class');

// @desc    Get post-class analytics & summary report
// @route   GET /api/summary/class/:classId
// @access  Private
exports.getClassSummary = async (req, res) => {
  try {
    const { classId } = req.params;

    const classSession = await Class.findById(classId)
      .populate('teacherId', 'name email teacherId departmentOrGrade');

    const totalQuestions = await Question.countDocuments({ classId });
    const groups = await QuestionGroup.find({ classId }).sort({ studentCount: -1 }).lean();

    const questionGroupsCount = groups.length;
    const answeredGroupsCount = groups.filter((g) => g.status === 'answered').length;
    const unansweredGroupsCount = groups.filter((g) => g.status !== 'answered').length;
    const repeatedQuestionsFiltered = Math.max(0, totalQuestions - questionGroupsCount);

    // Identify Most Confusing Concept
    const conceptualGroups = groups.filter((g) => g.category === 'conceptual');
    const mostConfusing = conceptualGroups.length > 0 ? conceptualGroups[0] : groups[0] || null;

    // Category Distribution
    const categoryCounts = {
      conceptual: groups.filter((g) => g.category === 'conceptual').length,
      technical: groups.filter((g) => g.category === 'technical').length,
      administrative: groups.filter((g) => g.category === 'administrative').length,
      homework: groups.filter((g) => g.category === 'homework').length,
    };

    const categoryStats = [
      {
        category: 'conceptual',
        label: 'Conceptual',
        count: categoryCounts.conceptual,
        percentage: questionGroupsCount > 0 ? Math.round((categoryCounts.conceptual / questionGroupsCount) * 100) : 0,
      },
      {
        category: 'technical',
        label: 'Technical',
        count: categoryCounts.technical,
        percentage: questionGroupsCount > 0 ? Math.round((categoryCounts.technical / questionGroupsCount) * 100) : 0,
      },
      {
        category: 'administrative',
        label: 'Administrative',
        count: categoryCounts.administrative,
        percentage: questionGroupsCount > 0 ? Math.round((categoryCounts.administrative / questionGroupsCount) * 100) : 0,
      },
      {
        category: 'homework',
        label: 'Homework',
        count: categoryCounts.homework,
        percentage: questionGroupsCount > 0 ? Math.round((categoryCounts.homework / questionGroupsCount) * 100) : 0,
      },
    ];

    // Transcripts
    const transcripts = groups.map((g) => ({
      id: g._id,
      mainQuestion: g.mainQuestion,
      category: g.category,
      priority: g.priority,
      studentCount: g.studentCount || 1,
      classWide: Boolean(g.classWide),
      status: g.status,
      answer: g.answer?.text || null,
      answeredAt: g.answer?.answeredAt || null,
    }));

    // Calculate Lecture Duration
    let durationMinutes = 0;
    if (classSession?.createdAt) {
      const endTime = classSession.endedAt ? new Date(classSession.endedAt) : new Date();
      const startTime = new Date(classSession.createdAt);
      durationMinutes = Math.max(1, Math.round((endTime - startTime) / (1000 * 60)));
    }

    const efficiencyGain = totalQuestions > 0
      ? `${Math.round(((totalQuestions - questionGroupsCount) / totalQuestions) * 100)}%`
      : '0%';

    return res.json({
      success: true,
      class: {
        id: classSession?._id,
        _id: classSession?._id,
        className: classSession?.className || 'Class Session',
        classCode: classSession?.classCode || '',
        subject: classSession?.subject || '',
        topic: classSession?.topic || 'Lecture Wrap-up',
        instructor: classSession?.teacherId?.name || 'Faculty Instructor',
        studentsCount: classSession?.students?.length || 0,
        status: classSession?.status || 'ended',
        createdAt: classSession?.createdAt,
        endedAt: classSession?.endedAt,
      },
      summary: {
        totalQuestions,
        questionGroups: questionGroupsCount,
        repeatedQuestionsFiltered,
        answeredGroups: answeredGroupsCount,
        unansweredGroups: unansweredGroupsCount,
        efficiencyGain,
        durationMinutes,
        mostConfusingTopic: mostConfusing
          ? {
              title: mostConfusing.mainQuestion,
              studentsAffected: mostConfusing.studentCount || 1,
              category: mostConfusing.category,
              severity: mostConfusing.priority,
              aiInsight: `Clustered from ${mostConfusing.studentCount || 1} student doubts. Addressing this core concept clarifies doubts across the class.`,
            }
          : null,
        categoryStats,
        transcripts,
      },
    });
  } catch (error) {
    console.error('Class Summary Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while generating summary',
    });
  }
};
