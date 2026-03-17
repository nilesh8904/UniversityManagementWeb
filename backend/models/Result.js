const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  examType: {
    type: String,
    required: true,
    enum: ['Mid-Term', 'End-Term', 'Final', 'Quiz', 'Assignment'],
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  obtainedMarks: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  gpa: {
    type: Number,
    required: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Result', resultSchema);
