const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const College = require('../models/College');
const Program = require('../models/Program');
const User = require('../models/User');

// All routes are protected and only for university admins
router.use(protect);
router.use(authorize('university_admin'));

// @route   GET /api/university/stats
// @desc    Get university statistics
// @access  Private (University Admin)
router.get('/stats', async (req, res) => {
  try {
    const totalColleges = await College.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'college_admin' });
    const totalPrograms = await Program.countDocuments();

    res.json({
      success: true,
      data: {
        totalColleges,
        totalStudents,
        totalFaculty,
        totalPrograms,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/university/colleges
// @desc    Get all colleges
// @access  Private (University Admin)
router.get('/colleges', async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: colleges,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/university/colleges
// @desc    Create a new college
// @access  Private (University Admin)
router.post('/colleges', async (req, res) => {
  try {
    const college = await College.create(req.body);

    res.status(201).json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/university/colleges/:id
// @desc    Update a college
// @access  Private (University Admin)
router.put('/colleges/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found',
      });
    }

    res.json({
      success: true,
      data: college,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/university/colleges/:id
// @desc    Delete a college
// @access  Private (University Admin)
router.delete('/colleges/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found',
      });
    }

    res.json({
      success: true,
      message: 'College deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/university/programs
// @desc    Get all programs
// @access  Private (University Admin)
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find().populate('college').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/university/programs
// @desc    Create a new program
// @access  Private (University Admin)
router.post('/programs', async (req, res) => {
  try {
    const program = await Program.create(req.body);
    await program.populate('college');

    res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/university/programs/:id
// @desc    Update a program
// @access  Private (University Admin)
router.put('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('college');

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }

    res.json({
      success: true,
      data: program,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/university/programs/:id
// @desc    Delete a program
// @access  Private (University Admin)
router.delete('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found',
      });
    }

    res.json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/university/analytics
// @desc    Get analytics data
// @access  Private (University Admin)
router.get('/analytics', async (req, res) => {
  try {
    // Get student distribution by college
    const colleges = await College.find();
    const studentDistribution = await Promise.all(
      colleges.map(async (college) => {
        const count = await User.countDocuments({
          role: 'student',
          collegeId: college._id,
        });
        return {
          name: college.name,
          students: count,
        };
      })
    );

    // Get faculty distribution by college
    const facultyDistribution = await Promise.all(
      colleges.map(async (college) => {
        const count = await User.countDocuments({
          role: 'college_admin',
          collegeId: college._id,
        });
        return {
          name: college.name,
          faculty: count,
        };
      })
    );

    // Get programs by college
    const programsByCollege = await Program.aggregate([
      {
        $lookup: {
          from: 'colleges',
          localField: 'college',
          foreignField: '_id',
          as: 'collegeInfo',
        },
      },
      {
        $unwind: '$collegeInfo',
      },
      {
        $group: {
          _id: '$collegeInfo.name',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          programs: '$count',
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        studentDistribution,
        facultyDistribution,
        programsByCollege,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
