const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
      default: 'General Assignment',
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Subject',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    points: {
      type: Number,
      default: 100,
      min: 0,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacherName: {
      type: String,
      default: 'Faculty Member',
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      default: null,
    },
    attachments: [
      {
        title: { type: String, default: '' },
        url: { type: String, default: '' },
        type: { type: String, default: 'link' },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
