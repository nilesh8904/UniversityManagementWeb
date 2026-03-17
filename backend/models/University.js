const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'University code is required'],
    unique: true,
    uppercase: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  establishedYear: {
    type: Number,
    required: true
  },
  website: {
    type: String
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('University', universitySchema);
