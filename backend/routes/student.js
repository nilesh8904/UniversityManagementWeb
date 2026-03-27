const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Result = require('../models/Result');
const Material = require('../models/Material');
const Timetable = require('../models/Timetable');

// All routes are protected and only for students
router.use(protect);
router.use(authorize('student'));

// @route   GET /api/student/dashboard
// @desc    Get student dashboard stats
// @access  Private (Student)
router.get('/dashboard', async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get enrolled courses
    const enrolledCourses = await Course.find({
      enrolledStudents: studentId,
    }).countDocuments();

    // Calculate attendance percentage
    const totalAttendance = await Attendance.countDocuments({
      student: studentId,
    });
    const presentAttendance = await Attendance.countDocuments({
      student: studentId,
      status: 'present',
    });
    const attendancePercentage = totalAttendance > 0
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 0;

    // Calculate GPA (simplified - average of all results)
    const results = await Result.find({ student: studentId });
    const gpa = results.length > 0
      ? (results.reduce((sum, result) => sum + result.gpa, 0) / results.length).toFixed(2)
      : '0.00';

    res.json({
      success: true,
      data: {
        enrolledCourses,
        attendancePercentage,
        gpa,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/student/courses
// @desc    Get student's enrolled courses
// @access  Private (Student)
router.get('/courses', async (req, res) => {
  try {
    const studentId = req.user._id;

    const courses = await Course.find({
      enrolledStudents: studentId,
    })
      .populate('faculty', 'name email facultyInfo')
      .sort({ createdAt: -1 });

    // Get attendance for each course
    const coursesWithAttendance = await Promise.all(
      courses.map(async (course) => {
        const totalClasses = await Attendance.countDocuments({
          course: course._id,
          student: studentId,
        });
        const presentClasses = await Attendance.countDocuments({
          course: course._id,
          student: studentId,
          status: 'present',
        });
        const attendanceRate = totalClasses > 0
          ? Math.round((presentClasses / totalClasses) * 100)
          : 0;

        return {
          ...course.toObject(),
          attendanceRate,
        };
      })
    );

    res.json({
      success: true,
      data: coursesWithAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/student/attendance
// @desc    Get student's attendance records
// @access  Private (Student)
router.get('/attendance', async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.query;

    let query = { student: studentId };
    if (courseId) query.course = courseId;

    const attendance = await Attendance.find(query)
      .populate('course', 'name code')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/student/assignments
// @desc    Get student's assignments
// @access  Private (Student)
router.get('/assignments', async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all assignments for courses the student is enrolled in
    const studentCourses = await Course.find({
      enrolledStudents: studentId,
    }).select('_id');

    const courseIds = studentCourses.map((course) => course._id);

    const assignments = await Assignment.find({
      course: { $in: courseIds },
    })
      .populate('course', 'name code')
      .populate('faculty', 'name email')
      .sort({ dueDate: -1 });

    // Add submission status for each assignment
    const assignmentsWithStatus = assignments.map((assignment) => {
      const submission = assignment.submissions.find(
        (sub) => sub.student.toString() === studentId.toString()
      );

      return {
        ...assignment.toObject(),
        mySubmission: submission || null,
        isSubmitted: !!submission,
      };
    });

    res.json({
      success: true,
      data: assignmentsWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/student/assignments/:id/submit
// @desc    Submit an assignment
// @access  Private (Student)
router.post('/assignments/:id/submit', async (req, res) => {
  try {
    const studentId = req.user._id;
    const { files } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already submitted',
      });
    }

    // Determine if late submission
    const isLate = new Date() > new Date(assignment.dueDate);

    // Add submission
    assignment.submissions.push({
      student: studentId,
      submittedAt: new Date(),
      files: files || [],
      status: isLate ? 'late' : 'submitted',
    });

    await assignment.save();
    await assignment.populate('course', 'name code');
    await assignment.populate('faculty', 'name email');

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/student/results
// @desc    Get student's results
// @access  Private (Student)
router.get('/results', async (req, res) => {
  try {
    const studentId = req.user._id;

    const results = await Result.find({ student: studentId })
      .populate('course', 'name code credits')
      .sort({ publishedDate: -1 });

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/student/timetable
// @desc    Get timetable entries for enrolled courses
// @access  Private (Student)
router.get('/timetable', async (req, res) => {
  try {
    const studentId = req.user._id;

    const studentCourses = await Course.find({ enrolledStudents: studentId }).select('_id');
    const courseIds = studentCourses.map((course) => course._id);

    const timetable = await Timetable.find({ course: { $in: courseIds } })
      .populate('course', 'name code')
      .populate('faculty', 'name email')
      .sort({ day: 1, startTime: 1 });

    res.json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/student/materials
// @desc    Get course materials
// @access  Private (Student)
router.get('/materials', async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId } = req.query;

    console.log('\n=== MATERIALS DEBUG ===');
    console.log('📚 Student ID:', studentId);

    // Get student's enrolled courses
    const enrolledCourses = await Course.find({
      enrolledStudents: studentId,
    }).select('_id name code college');
    
    const enrolledCourseIds = enrolledCourses.map(c => c._id);
    const studentCollege = enrolledCourses[0]?.college;
    
    console.log('👤 Student enrolled in', enrolledCourses.length, 'courses');
    console.log('📚 Enrolled Courses:', enrolledCourses.map(c => ({ _id: c._id.toString(), name: c.name, college: c.college })));
    console.log('🏫 Student College:', studentCollege);

    // DEBUG: Get ALL materials with full details
    const allMaterials = await Material.find().lean();
    console.log(`\n🔍 TOTAL MATERIALS IN DATABASE: ${allMaterials.length}`);
    
    if (allMaterials.length > 0) {
      console.log('\n📋 ALL MATERIALS (with details):');
      allMaterials.forEach((m, idx) => {
        console.log(`  ${idx + 1}. "${m.title}"`);
        console.log(`     - ID: ${m._id}`);
        console.log(`     - Course: ${m.course}`);
        console.log(`     - College: ${m.college}`);
        console.log(`     - IsActive: ${m.isActive}`);
        console.log(`     - URL: ${m.url?.substring(0, 50)}...`);
      });
    }

    let materials = [];

    if (courseId && courseId !== 'all') {
      // Filter by specific course
      console.log('\n🔍 Filtering by specific course:', courseId);
      materials = await Material.find({ course: courseId })
        .populate('course', 'name code')
        .populate('uploadedBy', 'name email')
        .lean();
      console.log(`✅ Found ${materials.length} materials for course ${courseId}`);
    } else {
      // Return materials for all enrolled courses
      console.log('\n🔎 SEARCHING for materials matching enrolled courses');
      console.log('Course IDs to match:', enrolledCourseIds.map(id => id.toString()));

      if (enrolledCourseIds.length === 0) {
        console.log('⚠️ Student not enrolled in any courses');
        return res.json({ success: true, data: [] });
      }

      // TRY 1: Using $in operator
      console.log('\n📌 TRY 1: Using $in operator with course field');
      materials = await Material.find({ course: { $in: enrolledCourseIds } })
        .populate('course', 'name code')
        .populate('uploadedBy', 'name email')
        .lean();
      
      console.log(`Result: Found ${materials.length} materials`);

      // TRY 2: If nothing found, try without college filter
      if (materials.length === 0) {
        console.log('\n📌 TRY 2: Searching ALL materials (removing any college filter)');
        materials = await Material.find({})
          .populate('course', 'name code')
          .populate('uploadedBy', 'name email')
          .lean();
        
        console.log(`Total materials in DB: ${materials.length}`);
        
        // Filter in code to find matches
        const matchedMaterials = materials.filter(m => {
          const courseMatch = enrolledCourseIds.some(id => id.toString() === m.course?._id?.toString());
          return courseMatch;
        });
        
        console.log(`After filtering by enrolled courses: ${matchedMaterials.length} materials`);
        materials = matchedMaterials;
      }

      // TRY 3: Log which courses have materials
      if (materials.length === 0) {
        console.log('\n📌 TRY 3: Checking which courses have ANY materials');
        for (const course of enrolledCourses) {
          const courseMatCount = await Material.countDocuments({ course: course._id });
          console.log(`  Course "${course.name}" (${course._id}): ${courseMatCount} materials`);
        }
      }
    }
    
    console.log(`\n✅ FINAL RESULT: ${materials.length} materials to return`);
    if (materials.length > 0) {
      console.log('📊 Materials being returned:');
      materials.forEach((m, idx) => {
        console.log(`  ${idx + 1}. "${m.title}" - Course: ${m.course?.name || 'UNKNOWN'}`);
      });
    }
    console.log('=== END DEBUG ===\n');
    
    res.json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error('❌ Error fetching materials:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
