const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Submission response content is required'],
      trim: true,
    },
    attachmentUrl: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    aiEvaluation: {
      suggestedScore: { type: Number, default: null },
      summary: { type: String, default: '' },
      strengths: [{ type: String }],
      improvements: [{ type: String }],
      evaluatedAt: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted',
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index so a student submits once per assignment (or updates it)
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
