require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const University = require('./models/University');
const College = require('./models/College');
const Program = require('./models/Program');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/university_management')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const universities = [
  {
    name: 'State University',
    code: 'SU001',
    address: '123 University Road',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    establishedYear: 1985,
    website: 'https://stateuniversity.edu',
    contactEmail: 'info@stateuniversity.edu',
    contactPhone: '+91-11-12345678',
    description: 'A premier state university offering diverse programs'
  }
];

const colleges = [
  {
    name: 'College of Engineering',
    code: 'CE001',
    address: 'Engineering Campus, SU001',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    establishedYear: 1990,
    dean: 'Dr. Rajesh Kumar',
    website: 'https://ce.stateuniversity.edu',
    contactEmail: 'ce@stateuniversity.edu',
    contactPhone: '+91-11-23456789',
    description: 'Leading engineering college'
  },
  {
    name: 'College of Arts & Sciences',
    code: 'CAS001',
    address: 'Arts Campus, SU001',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    establishedYear: 1992,
    dean: 'Dr. Priya Sharma',
    website: 'https://cas.stateuniversity.edu',
    contactEmail: 'cas@stateuniversity.edu',
    contactPhone: '+91-11-34567890',
    description: 'Excellence in arts and sciences'
  }
];

const programs = [
  {
    name: 'Bachelor of Technology in Computer Science',
    code: 'BTECH-CS',
    degree: 'B.Tech',
    specialization: 'Computer Science',
    duration: 4,
    totalCredits: 160
  },
  {
    name: 'Bachelor of Science in Mathematics',
    code: 'BSC-MATH',
    degree: 'B.Sc',
    specialization: 'Mathematics',
    duration: 3,
    totalCredits: 120
  }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@university.edu',
    password: 'password',
    role: 'university_admin'
  },
  {
    name: 'College Admin 1',
    email: 'college@admin.edu',
    password: 'password',
    role: 'college_admin'
  },
  {
    name: 'Student 1',
    email: 'student@edu.com',
    password: 'password',
    role: 'student',
    studentId: 'STU001'
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await University.deleteMany({});
    await College.deleteMany({});
    await Program.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});

    // Create university
    console.log('🏫 Creating university...');
    const university = await University.create(universities[0]);
    console.log('✅ University created:', university.name);

    // Create colleges
    console.log('🏢 Creating colleges...');
    const collegesCreated = await Promise.all(
      colleges.map(college => College.create({ ...college, university: university._id }))
    );
    console.log(`✅ ${collegesCreated.length} colleges created`);

    // Create programs
    console.log('📚 Creating programs...');
    const programsCreated = await Promise.all(
      programs.map((program, index) => 
        Program.create({
          ...program,
          university: university._id,
          college: collegesCreated[index % collegesCreated.length]._id
        })
      )
    );
    console.log(`✅ ${programsCreated.length} programs created`);

    // Create users
    console.log('👥 Creating users...');
    const usersCreated = [];
    
    // University admin
    const uniAdmin = await User.create({
      ...users[0],
      university: university._id
    });
    usersCreated.push(uniAdmin);
    console.log('✅ University admin created');

    // College admins
    for (let i = 0; i < collegesCreated.length; i++) {
      const collegeAdmin = await User.create({
        name: `College Admin ${i + 1}`,
        email: `admin${i + 1}@college.edu`,
        password: 'password',
        role: 'college_admin',
        college: collegesCreated[i]._id,
        university: university._id
      });
      usersCreated.push(collegeAdmin);
      console.log(`✅ College admin ${i + 1} created`);
    }

    // Students
    for (let i = 0; i < 5; i++) {
      const student = await User.create({
        name: `Student ${i + 1}`,
        email: `student${i + 1}@edu.com`,
        password: 'password',
        role: 'student',
        studentId: `STU${String(i + 1).padStart(3, '0')}`,
        college: collegesCreated[i % collegesCreated.length]._id,
        university: university._id
      });
      usersCreated.push(student);
      console.log(`✅ Student ${i + 1} created`);
    }

    // Create courses
    console.log('📖 Creating courses...');
    const courses = [
      {
        name: 'Data Structures & Algorithms',
        code: 'CS101',
        semester: 1,
        credits: 4,
        faculty: usersCreated[1]._id,
        program: programsCreated[0]._id
      },
      {
        name: 'Object Oriented Programming',
        code: 'CS102',
        semester: 1,
        credits: 4,
        faculty: usersCreated[1]._id,
        program: programsCreated[0]._id
      },
      {
        name: 'Calculus I',
        code: 'MATH101',
        semester: 1,
        credits: 3,
        faculty: usersCreated[2]._id,
        program: programsCreated[1]._id
      }
    ];

    const coursesCreated = await Promise.all(
      courses.map(course => 
        Course.create({
          ...course,
          college: course.program
        })
      )
    );
    console.log(`✅ ${coursesCreated.length} courses created`);

    // Create enrollments
    console.log('🎓 Creating enrollments...');
    const enrollments = [];
    for (let i = 3; i < usersCreated.length; i++) {
      for (let j = 0; j < coursesCreated.length; j++) {
        enrollments.push({
          student: usersCreated[i]._id,
          course: coursesCreated[j]._id,
          semester: 1,
          status: 'active'
        });
      }
    }
    await Enrollment.insertMany(enrollments);
    console.log(`✅ ${enrollments.length} enrollments created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('   University Admin: admin@university.edu / password');
    console.log('   College Admin: admin1@college.edu / password');
    console.log('   Student: student1@edu.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
