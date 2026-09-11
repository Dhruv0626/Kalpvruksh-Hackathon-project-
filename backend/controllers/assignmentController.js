const { Assignment, Submission, User, Class } = require('../models');

// Helper to simulate smart AI evaluation for student submissions
const evaluateContentWithAI = (assignmentTitle, assignmentDesc, studentSubmission, maxPoints) => {
  const text = (studentSubmission || '').toLowerCase();
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  
  // Keyword and depth analysis
  let scoreRatio = 0.7; // baseline 70%
  const strengths = [];
  const improvements = [];

  if (wordCount > 60) {
    scoreRatio += 0.15;
    strengths.push('Provided a comprehensive and well-elaborated response with sufficient detail.');
  } else if (wordCount > 25) {
    scoreRatio += 0.05;
    strengths.push('Clear and direct response addressing the prompt core.');
  } else {
    scoreRatio -= 0.2;
    improvements.push('Answer is somewhat brief; consider including more specific examples or technical justification.');
  }

  // Check relevance to key terms in description
  const keywords = assignmentDesc
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4);

  const matchedKeywords = keywords.filter((k) => text.includes(k));
  if (matchedKeywords.length >= 2) {
    scoreRatio += 0.1;
    strengths.push(`Directly referenced key concepts (${matchedKeywords.slice(0, 3).join(', ')}).`);
  } else {
    improvements.push('Could further integrate course terminology and key theoretical references.');
  }

  // Bound score ratio between 0.5 and 0.98
  scoreRatio = Math.max(0.5, Math.min(0.98, scoreRatio));
  const suggestedScore = Math.round(scoreRatio * (maxPoints || 100));

  let summary = `The student's submission demonstrates a strong conceptual grasp of ${assignmentTitle}. The reasoning is logically organized with valid explanations.`;
  if (scoreRatio < 0.7) {
    summary = `The response covers foundational points for ${assignmentTitle}, but lacks deeper elaboration on technical specifics.`;
  }

  return {
    suggestedScore,
    summary,
    strengths: strengths.length ? strengths : ['Submitted on time with relevant subject context.'],
    improvements: improvements.length ? improvements : ['Elaborate on real-world edge cases to achieve full marks.'],
    evaluatedAt: new Date(),
  };
};

// Create a new assignment (Teacher)
const createAssignment = async (req, res) => {
  try {
    const { title, description, topic, subject, dueDate, points, classId, attachments } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and due date for the assignment.',
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      topic: topic || 'General Assignment',
      subject: subject || 'General Subject',
      dueDate: new Date(dueDate),
      points: points !== undefined ? Number(points) : 100,
      teacherId: req.user._id,
      teacherName: req.user.name || 'Professor',
      classId: classId || null,
      attachments: attachments || [],
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully!',
      assignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment due to a server error.',
    });
  }
};

// Get all assignments (For Teachers: includes submission stats; For Students: includes personal submission status)
const getAssignments = async (req, res) => {
  try {
    const { classId, topic } = req.query;
    const filter = { status: 'active' };

    if (classId) filter.classId = classId;
    if (topic) filter.topic = topic;

    const assignments = await Assignment.find(filter).sort({ createdAt: -1 }).lean();

    // Enrich with submission info
    const enriched = await Promise.all(
      assignments.map(async (assign) => {
        const totalSubmissions = await Submission.countDocuments({ assignmentId: assign._id });
        const gradedCount = await Submission.countDocuments({
          assignmentId: assign._id,
          status: 'graded',
        });

        let mySubmission = null;
        if (req.user && req.user.role === 'student') {
          mySubmission = await Submission.findOne({
            assignmentId: assign._id,
            studentId: req.user._id,
          }).lean();
        }

        return {
          ...assign,
          totalSubmissions,
          gradedCount,
          mySubmission,
          isSubmitted: !!mySubmission,
          myGrade: mySubmission?.grade ?? null,
          myStatus: mySubmission?.status ?? (new Date() > new Date(assign.dueDate) ? 'missing' : 'pending'),
        };
      })
    );

    res.status(200).json({
      success: true,
      assignments: enriched,
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments.',
    });
  }
};

// Get single assignment with submissions
const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id).lean();

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    let submissions = [];
    let mySubmission = null;

    if (req.user.role === 'teacher') {
      submissions = await Submission.find({ assignmentId: id })
        .populate('studentId', 'name email role')
        .sort({ submittedAt: -1 })
        .lean();
    } else {
      mySubmission = await Submission.findOne({
        assignmentId: id,
        studentId: req.user._id,
      }).lean();
    }

    res.status(200).json({
      success: true,
      assignment,
      submissions,
      mySubmission,
    });
  } catch (error) {
    console.error('Error fetching assignment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment details.',
    });
  }
};

// Student submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, attachmentUrl } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your solution or answer text.',
      });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment does not exist or has been removed.',
      });
    }

    const isLate = new Date() > new Date(assignment.dueDate);
    const status = isLate ? 'late' : 'submitted';

    // Auto-generate initial AI evaluation preview
    const aiEval = evaluateContentWithAI(
      assignment.title,
      assignment.description,
      content,
      assignment.points
    );

    const submission = await Submission.findOneAndUpdate(
      { assignmentId: id, studentId: req.user._id },
      {
        assignmentId: id,
        studentId: req.user._id,
        studentName: req.user.name || 'Student',
        studentEmail: req.user.email || '',
        content: content.trim(),
        attachmentUrl: attachmentUrl || '',
        submittedAt: new Date(),
        status,
        aiEvaluation: aiEval,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: isLate ? 'Assignment submitted (Late).' : 'Assignment submitted successfully!',
      submission,
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment.',
    });
  }
};

// Teacher Grade Submission
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    if (grade === undefined || grade === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid grade score.',
      });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    submission.grade = Number(grade);
    submission.feedback = feedback || 'Well done.';
    submission.status = 'graded';
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Grade and feedback saved successfully!',
      submission,
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to grade submission.',
    });
  }
};

// AI Evaluate Submission on-demand (Teacher / Assistant)
const aiEvaluateSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId).populate('assignmentId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    const assign = submission.assignmentId;
    const aiEval = evaluateContentWithAI(
      assign?.title || 'Assignment',
      assign?.description || '',
      submission.content,
      assign?.points || 100
    );

    submission.aiEvaluation = aiEval;
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'AI Evaluation generated successfully!',
      aiEvaluation: aiEval,
    });
  } catch (error) {
    console.error('Error in AI evaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI evaluation.',
    });
  }
};

// Delete Assignment (Teacher)
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    await Submission.deleteMany({ assignmentId: id });

    res.status(200).json({
      success: true,
      message: 'Assignment and related submissions deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment.',
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
  gradeSubmission,
  aiEvaluateSubmission,
  deleteAssignment,
};
