const mongoose = require('mongoose');

const questionGroupSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class ID is required'],
      index: true,
    },
    mainQuestion: {
      type: String,
      required: [true, 'Main representative question is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['conceptual', 'administrative', 'technical', 'homework', 'other'],
      default: 'conceptual',
      index: true,
    },
    studentCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
      index: true,
    },
    classWide: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['unanswered', 'answered'],
      default: 'unanswered',
      index: true,
    },
    answer: {
      text: { type: String, trim: true },
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answeredAt: { type: Date },
    },
    embedding: {
      type: [Number], // Optional sentence embedding vector from AI service
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('QuestionGroup', questionGroupSchema);
