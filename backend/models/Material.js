const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    topic: {
      type: String,
      trim: true,
      default: 'General Resources',
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Subject',
    },
    type: {
      type: String,
      enum: ['notes', 'slides', 'syllabus', 'video', 'code', 'pdf', 'link'],
      default: 'pdf',
    },
    fileUrl: {
      type: String,
      required: [true, 'Resource link or URL is required'],
      trim: true,
    },
    fileSize: {
      type: String,
      default: 'Online Document',
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Material', materialSchema);
