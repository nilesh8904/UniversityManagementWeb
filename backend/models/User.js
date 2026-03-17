const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['university_admin', 'college_admin', 'student'],
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
  },
  studentInfo: {
    rollNumber: String,
    department: String,
    semester: Number,
    year: Number,
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
  },
  facultyInfo: {
    employeeId: String,
    department: String,
    specialization: String,
    phone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
