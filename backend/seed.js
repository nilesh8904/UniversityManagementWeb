const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const College = require('./models/College');
const Program = require('./models/Program');
const Course = require('./models/Course');
const Attendance = require('./models/Attendance');
const Assignment = require('./models/Assignment');
const Result = require('./models/Result');
const Material = require('./models/Material');
const Timetable = require('./models/Timetable');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected for Seeding'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

const seedData = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await College.deleteMany({});
    await Program.deleteMany({});
    await Course.deleteMany({});
    await Attendance.deleteMany({});
    await Assignment.deleteMany({});
    await Result.deleteMany({});
    await Material.deleteMany({});
    await Timetable.deleteMany({});

    // Create Colleges
    console.log('🏫 Creating colleges...');
    const colleges = await College.insertMany([
      {
        name: 'Engineering College',
        code: 'ENG001',
        address: '123 University Ave, Tech City',
        dean: 'Dr. John Smith',
        establishedYear: 1995,
        studentCount: 1200,
        facultyCount: 85,
      },
      {
        name: 'Business School',
        code: 'BUS001',
        address: '456 Commerce St, Business Park',
        dean: 'Dr. Sarah Johnson',
        establishedYear: 2000,
        studentCount: 800,
        facultyCount: 55,
      },
      {
        name: 'Arts & Science College',
        code: 'ART001',
        address: '789 Liberal Arts Rd, Campus North',
        dean: 'Dr. Michael Brown',
        establishedYear: 1985,
        studentCount: 950,
        facultyCount: 70,
      },
    ]);

    // Create Programs
    console.log('📚 Creating programs...');
    const programs = await Program.insertMany([
      {
        name: 'Computer Science',
        code: 'CS-BTech',
        degree: 'B.Tech',
        duration: '4 years',
        college: colleges[0]._id,
        department: 'Computer Science',
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME-BTech',
        degree: 'B.Tech',
        duration: '4 years',
        college: colleges[0]._id,
        department: 'Mechanical',
      },
      {
        name: 'Business Administration',
        code: 'BBA',
        degree: 'BBA',
        duration: '3 years',
        college: colleges[1]._id,
        department: 'Management',
      },
      {
        name: 'Physics',
        code: 'PHY-BSc',
        degree: 'B.Sc',
        duration: '3 years',
        college: colleges[2]._id,
        department: 'Physics',
      },
    ]);

    // Create University Admin
    console.log('👤 Creating university admin...');
    const universityAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@university.edu',
      password: 'password123',
      role: 'university_admin',
    });

    // Create College Admins (Faculty)
    console.log('👨‍🏫 Creating college admins and faculty...');
    const collegeAdmins = await User.insertMany([
      {
        name: 'Prof. James Wilson',
        email: 'james@eng.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[0]._id,
        facultyInfo: {
          employeeId: 'EMP001',
          department: 'Computer Science',
          specialization: 'Artificial Intelligence',
          phone: '+1234567890',
        },
      },
      {
        name: 'Prof. Emily Davis',
        email: 'emily@eng.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[0]._id,
        facultyInfo: {
          employeeId: 'EMP002',
          department: 'Mechanical',
          specialization: 'Thermodynamics',
          phone: '+1234567891',
        },
      },
      {
        name: 'Prof. Robert Martinez',
        email: 'robert@business.edu',
        password: 'password123',
        role: 'college_admin',
        collegeId: colleges[1]._id,
        facultyInfo: {
          employeeId: 'EMP003',
          department: 'Management',
          specialization: 'Strategic Management',
          phone: '+1234567892',
        },
      },
    ]);

    // Create Courses
    console.log('📖 Creating courses...');
    const courses = await Course.insertMany([
      {
        name: 'Data Structures and Algorithms',
        code: 'CS301',
        credits: 4,
        semester: 3,
        college: colleges[0]._id,
        faculty: collegeAdmins[0]._id,
        description: 'Advanced data structures and algorithm design',
      },
      {
        name: 'Database Management Systems',
        code: 'CS401',
        credits: 3,
        semester: 4,
        college: colleges[0]._id,
        faculty: collegeAdmins[0]._id,
        description: 'Relational databases and SQL',
      },
      {
        name: 'Thermodynamics',
        code: 'ME201',
        credits: 4,
        semester: 2,
        college: colleges[0]._id,
        faculty: collegeAdmins[1]._id,
        description: 'Laws of thermodynamics and applications',
      },
      {
        name: 'Marketing Management',
        code: 'BUS301',
        credits: 3,
        semester: 3,
        college: colleges[1]._id,
        faculty: collegeAdmins[2]._id,
        description: 'Principles of marketing and strategy',
      },
    ]);

    // Create Students
    console.log('🎓 Creating students...');
    const students = await User.insertMany([
      {
        name: 'Alice Johnson',
        email: 'alice@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id,
        studentInfo: {
          rollNumber: 'CS2021001',
          department: 'Computer Science',
          semester: 3,
          year: 2,
          courses: [courses[0]._id, courses[1]._id],
        },
      },
      {
        name: 'Bob Smith',
        email: 'bob@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id,
        studentInfo: {
          rollNumber: 'CS2021002',
          department: 'Computer Science',
          semester: 3,
          year: 2,
          courses: [courses[0]._id, courses[1]._id],
        },
      },
      {
        name: 'Carol Williams',
        email: 'carol@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[0]._id,
        studentInfo: {
          rollNumber: 'ME2021001',
          department: 'Mechanical',
          semester: 2,
          year: 1,
          courses: [courses[2]._id],
        },
      },
      {
        name: 'David Brown',
        email: 'david@student.edu',
        password: 'password123',
        role: 'student',
        collegeId: colleges[1]._id,
        studentInfo: {
          rollNumber: 'BUS2021001',
          department: 'Management',
          semester: 3,
          year: 2,
          courses: [courses[3]._id],
        },
      },
    ]);

    // Update courses with enrolled students
    await Course.findByIdAndUpdate(courses[0]._id, {
      enrolledStudents: [students[0]._id, students[1]._id],
    });
    await Course.findByIdAndUpdate(courses[1]._id, {
      enrolledStudents: [students[0]._id, students[1]._id],
    });
    await Course.findByIdAndUpdate(courses[2]._id, {
      enrolledStudents: [students[2]._id],
    });
    await Course.findByIdAndUpdate(courses[3]._id, {
      enrolledStudents: [students[3]._id],
    });

    // Create Timetable
    console.log('🗓️  Creating timetable...');
    await Timetable.insertMany([
      {
        course: courses[0]._id,
        college: colleges[0]._id,
        faculty: collegeAdmins[0]._id,
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:30',
        room: 'CS-101',
        semester: 3,
      },
      {
        course: courses[1]._id,
        college: colleges[0]._id,
        faculty: collegeAdmins[0]._id,
        day: 'Tuesday',
        startTime: '11:00',
        endTime: '12:30',
        room: 'CS-102',
        semester: 4,
      },
      {
        course: courses[2]._id,
        college: colleges[0]._id,
        faculty: collegeAdmins[1]._id,
        day: 'Wednesday',
        startTime: '14:00',
        endTime: '15:30',
        room: 'ME-201',
        semester: 2,
      },
    ]);

    // Create Attendance
    console.log('✅ Creating attendance records...');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    await Attendance.insertMany([
      {
        course: courses[0]._id,
        student: students[0]._id,
        date: today,
        status: 'present',
        markedBy: collegeAdmins[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[0]._id,
        student: students[1]._id,
        date: today,
        status: 'present',
        markedBy: collegeAdmins[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[0]._id,
        student: students[0]._id,
        date: yesterday,
        status: 'absent',
        markedBy: collegeAdmins[0]._id,
        college: colleges[0]._id,
      },
      {
        course: courses[0]._id,
        student: students[1]._id,
        date: yesterday,
        status: 'late',
        markedBy: collegeAdmins[0]._id,
        college: colleges[0]._id,
      },
    ]);

    // Create Assignments
    console.log('📝 Creating assignments...');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const assignments = await Assignment.insertMany([
      {
        title: 'Implement Binary Search Tree',
        description: 'Create a BST with insert, delete, and search operations',
        course: courses[0]._id,
        college: colleges[0]._id,
        faculty: collegeAdmins[0]._id,
        dueDate: futureDate,
        maxMarks: 100,
        submissions: [
          {
            student: students[0]._id,
            submittedAt: new Date(),
            files: [],
            marks: 85,
            feedback: 'Good implementation, minor improvements needed',
            status: 'graded',
          },
        ],
      },
      {
        title: 'Database Design Project',
        description: 'Design a database for a library management system',
        course: courses[1]._id,
        college: colleges[0]._id,
        faculty: collegeAdmins[0]._id,
        dueDate: futureDate,
        maxMarks: 100,
      },
    ]);

    // Create Results
    console.log('📊 Creating results...');
    await Result.insertMany([
      {
        student: students[0]._id,
        course: courses[0]._id,
        college: colleges[0]._id,
        semester: 3,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 85,
        grade: 'A',
        gpa: 8.5,
      },
      {
        student: students[0]._id,
        course: courses[1]._id,
        college: colleges[0]._id,
        semester: 4,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 90,
        grade: 'A+',
        gpa: 9.0,
      },
      {
        student: students[1]._id,
        course: courses[0]._id,
        college: colleges[0]._id,
        semester: 3,
        examType: 'Mid-Term',
        totalMarks: 100,
        obtainedMarks: 78,
        grade: 'B+',
        gpa: 7.8,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('University Admin:');
    console.log('  Email: admin@university.edu');
    console.log('  Password: password123');
    console.log('\nCollege Admin (Engineering):');
    console.log('  Email: james@eng.edu');
    console.log('  Password: password123');
    console.log('\nStudent:');
    console.log('  Email: alice@student.edu');
    console.log('  Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
