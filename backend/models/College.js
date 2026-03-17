const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  dean: {
    type: String,
    required: true,
  },
  establishedYear: {
    type: Number,
    required: true,
  },
  studentCount: {
    type: Number,
    default: 0,
  },
  facultyCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('College', collegeSchema);
