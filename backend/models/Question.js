const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class ID is required'],
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    text: {
      type: String,
      required: [true, 'Question text cannot be empty'],
      trim: true,
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['conceptual', 'administrative', 'technical', 'homework', 'other'],
      default: 'conceptual',
      index: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
      index: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionGroup',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'grouped', 'answered'],
      default: 'pending',
      index: true,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);
