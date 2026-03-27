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
    console.log('📚 Student ID:', studentId.toString());

    // Get student's enrolled courses AND their college
    const enrolledCourses = await Course.find({
      enrolledStudents: studentId,
    }).select('_id name code college');
    
    const enrolledCourseIds = enrolledCourses.map(c => c._id);
    const studentColleges = [...new Set(enrolledCourses.map(c => c.college?.toString()))];
    
    console.log('👤 Student enrolled in', enrolledCourses.length, 'courses');
    console.log('📚 Enrolled Courses:');
    enrolledCourses.forEach(c => {
      console.log(`   - "${c.name}" (ID: ${c._id.toString()}) | College: ${c.college?.toString()}`);
    });
    console.log('🏫 Student Colleges:', studentColleges);

    // DEBUG: Get ALL materials with full details
    const allMaterials = await Material.find()
      .populate('course', 'name code _id')
      .populate('college', 'name _id')
      .lean();
    
    console.log(`\n🔍 TOTAL MATERIALS IN DATABASE: ${allMaterials.length}`);
    
    if (allMaterials.length > 0) {
      console.log('\n📋 ALL MATERIALS (with details):');
      allMaterials.forEach((m, idx) => {
        console.log(`  ${idx + 1}. "${m.title}"`);
        console.log(`     - ID: ${m._id}`);
        console.log(`     - Course: ${m.course?.name || 'NULL'} (${m.course?._id})`);
        console.log(`     - College: ${m.college?.name || 'NULL'} (${m.college?._id})`);
        console.log(`     - IsActive: ${m.isActive}`);
      });
    }

    let materials = [];

    if (courseId && courseId !== 'all') {
      // Filter by specific course
      console.log('\n🔍 Filtering by specific course:', courseId);
      materials = await Material.find({ course: courseId })
        .populate('course', 'name code')
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .lean();
      console.log(`✅ Found ${materials.length} materials for course ${courseId}`);
    } else {
      // Return materials for all enrolled courses AND student's college
      console.log('\n🔎 SEARCHING materials for enrolled courses in student colleges');
      console.log('Course IDs to match:', enrolledCourseIds.map(id => id.toString()));
      console.log('College IDs to match:', studentColleges);

      if (enrolledCourseIds.length === 0) {
        console.log('⚠️ Student not enrolled in any courses');
        return res.json({ success: true, data: [] });
      }

      // Query: materials that match enrolled courses (WITHOUT college restriction)
      // This ensures we get all materials from courses the student is enrolled in
      console.log('\n📌 Query: Finding materials with course IN enrolled courses');
      materials = await Material.find({ 
        course: { $in: enrolledCourseIds }
      })
        .populate('course', 'name code')
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      console.log(`Result: Found ${materials.length} materials matching enrolled courses`);

      // DEBUG: Show what matches
      if (materials.length > 0) {
        console.log('\n📊 Matching materials:');
        materials.forEach((m, idx) => {
          console.log(`  ${idx + 1}. "${m.title}" - Course: ${m.course?.name || 'NULL'}`);
        });
      } else {
        console.log('\n⚠️ No materials found matching enrolled courses');
        console.log('🔧 Debugging: Checking materials by course');
        
        // Check materials for each enrolled course
        for (const course of enrolledCourses) {
          const courseMatCount = await Material.countDocuments({ course: course._id });
          console.log(`  Course "${course.name}" (${course._id}): ${courseMatCount} materials`);
        }

        // Show ALL materials for reference
        console.log(`\n📋 ALL ${allMaterials.length} materials in database by course:`);
        const courseGroups = {};
        allMaterials.forEach(m => {
          const courseKey = m.course?._id?.toString() || 'UNLINKED';
          if (!courseGroups[courseKey]) courseGroups[courseKey] = [];
          courseGroups[courseKey].push(m);
        });
        
        Object.entries(courseGroups).forEach(([courseId, mats]) => {
          const matchingCourse = enrolledCourses.find(c => c._id.toString() === courseId);
          const courseName = matchingCourse?.name || `Unknown Course (${courseId})`;
          console.log(`  ${courseName}: ${mats.length} materials`);
          mats.forEach((m, idx) => {
            console.log(`    ${idx + 1}. "${m.title}"`);
          });
        });
      }
    }
    
    console.log(`\n✅ FINAL RESULT: ${materials.length} materials to return`);
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
