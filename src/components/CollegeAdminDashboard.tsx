import { useState } from 'react';
import { Course, Faculty, Timetable, Attendance, Assignment } from '../types';

export default function CollegeAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'faculty' | 'timetable' | 'attendance' | 'assignments'>('overview');
  
  const [courses, setCourses] = useState<Course[]>([
    { id: 'c1', name: 'Data Structures', code: 'CS201', credits: 4, facultyId: 'f1', facultyName: 'Dr. Alice Johnson', programId: 'p1', collegeId: 'col1', semester: 3 },
    { id: 'c2', name: 'Database Systems', code: 'CS301', credits: 3, facultyId: 'f2', facultyName: 'Prof. Bob Smith', programId: 'p1', collegeId: 'col1', semester: 5 },
    { id: 'c3', name: 'Machine Learning', code: 'CS401', credits: 4, facultyId: 'f1', facultyName: 'Dr. Alice Johnson', programId: 'p1', collegeId: 'col1', semester: 7 },
  ]);

  const [faculty, setFaculty] = useState<Faculty[]>([
    { id: 'f1', name: 'Dr. Alice Johnson', email: 'alice@college.edu', department: 'Computer Science', collegeId: 'col1', specialization: 'AI & ML', phone: '123-456-7890' },
    { id: 'f2', name: 'Prof. Bob Smith', email: 'bob@college.edu', department: 'Computer Science', collegeId: 'col1', specialization: 'Databases', phone: '123-456-7891' },
    { id: 'f3', name: 'Dr. Carol White', email: 'carol@college.edu', department: 'Computer Science', collegeId: 'col1', specialization: 'Networks', phone: '123-456-7892' },
  ]);

  const [timetable, setTimetable] = useState<Timetable[]>([
    { id: 't1', courseId: 'c1', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 101', facultyId: 'f1' },
    { id: 't2', courseId: 'c2', day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Room 102', facultyId: 'f2' },
    { id: 't3', courseId: 'c3', day: 'Wednesday', startTime: '14:00', endTime: '15:30', room: 'Room 103', facultyId: 'f1' },
  ]);

  const [attendance, setAttendance] = useState<Attendance[]>([
    { id: 'a1', studentId: 'STU001', courseId: 'c1', date: '2024-01-15', status: 'present', markedBy: 'f1' },
    { id: 'a2', studentId: 'STU002', courseId: 'c1', date: '2024-01-15', status: 'absent', markedBy: 'f1' },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 'as1', title: 'Binary Trees Implementation', description: 'Implement various binary tree operations', courseId: 'c1', facultyId: 'f1', dueDate: '2024-02-01', maxMarks: 100, attachments: [], createdAt: '2024-01-10' },
    { id: 'as2', title: 'SQL Queries', description: 'Write complex SQL queries', courseId: 'c2', facultyId: 'f2', dueDate: '2024-02-05', maxMarks: 50, attachments: [], createdAt: '2024-01-12' },
  ]);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [showAddTimetable, setShowAddTimetable] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);

  const [newCourse, setNewCourse] = useState({ name: '', code: '', credits: 3, facultyId: '', semester: 1 });
  const [newFaculty, setNewFaculty] = useState({ name: '', email: '', department: '', specialization: '', phone: '' });
  const [newTimetable, setNewTimetable] = useState({ courseId: '', day: 'Monday', startTime: '', endTime: '', room: '', facultyId: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', courseId: '', dueDate: '', maxMarks: 100 });
  const [newAttendance, setNewAttendance] = useState({ studentId: '', courseId: '', date: '', status: 'present' as const });

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.code && newCourse.facultyId) {
      const selectedFaculty = faculty.find(f => f.id === newCourse.facultyId);
      setCourses([...courses, {
        ...newCourse,
        id: `c${courses.length + 1}`,
        facultyName: selectedFaculty?.name || '',
        programId: 'p1',
        collegeId: 'col1'
      }]);
      setNewCourse({ name: '', code: '', credits: 3, facultyId: '', semester: 1 });
      setShowAddCourse(false);
    }
  };

  const handleAddFaculty = () => {
    if (newFaculty.name && newFaculty.email) {
      setFaculty([...faculty, { ...newFaculty, id: `f${faculty.length + 1}`, collegeId: 'col1' }]);
      setNewFaculty({ name: '', email: '', department: '', specialization: '', phone: '' });
      setShowAddFaculty(false);
    }
  };

  const handleAddTimetable = () => {
    if (newTimetable.courseId && newTimetable.startTime && newTimetable.endTime) {
      setTimetable([...timetable, { ...newTimetable, id: `t${timetable.length + 1}` }]);
      setNewTimetable({ courseId: '', day: 'Monday', startTime: '', endTime: '', room: '', facultyId: '' });
      setShowAddTimetable(false);
    }
  };

  const handleAddAssignment = () => {
    if (newAssignment.title && newAssignment.courseId) {
      const course = courses.find(c => c.id === newAssignment.courseId);
      setAssignments([...assignments, {
        ...newAssignment,
        id: `as${assignments.length + 1}`,
        facultyId: course?.facultyId || '',
        attachments: [],
        createdAt: new Date().toISOString().split('T')[0]
      }]);
      setNewAssignment({ title: '', description: '', courseId: '', dueDate: '', maxMarks: 100 });
      setShowAddAssignment(false);
    }
  };

  const handleMarkAttendance = () => {
    if (newAttendance.studentId && newAttendance.courseId && newAttendance.date) {
      setAttendance([...attendance, {
        ...newAttendance,
        id: `a${attendance.length + 1}`,
        markedBy: 'f1'
      }]);
      setNewAttendance({ studentId: '', courseId: '', date: '', status: 'present' });
      setShowMarkAttendance(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File "${file.name}" uploaded successfully! (Cloudinary integration would handle this)`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">College Admin Dashboard</h1>
          </div>
          <div className="flex space-x-8 border-b overflow-x-auto">
            {(['overview', 'courses', 'faculty', 'timetable', 'attendance', 'assignments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Courses</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{courses.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Faculty</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{faculty.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Assignments</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{assignments.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Classes Today</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{timetable.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Courses</h2>
              <button
                onClick={() => setShowAddCourse(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Course
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.credits}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.facultyName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{course.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showAddCourse && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add New Course</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Course Name"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Course Code"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Credits"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newCourse.facultyId}
                      onChange={(e) => setNewCourse({ ...newCourse, facultyId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Faculty</option>
                      {faculty.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Semester"
                      value={newCourse.semester}
                      onChange={(e) => setNewCourse({ ...newCourse, semester: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button onClick={handleAddCourse} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Add Course
                    </button>
                    <button onClick={() => setShowAddCourse(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Manage Faculty</h2>
              <button
                onClick={() => setShowAddFaculty(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Faculty
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map((f) => (
                <div key={f.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-lg">{f.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{f.name}</h3>
                      <p className="text-sm text-gray-600">{f.department}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Email:</span> {f.email}</p>
                    <p><span className="font-medium">Phone:</span> {f.phone}</p>
                    <p><span className="font-medium">Specialization:</span> {f.specialization}</p>
                  </div>
                </div>
              ))}
            </div>

            {showAddFaculty && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add New Faculty</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Department"
                      value={newFaculty.department}
                      onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Specialization"
                      value={newFaculty.specialization}
                      onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newFaculty.phone}
                      onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button onClick={handleAddFaculty} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Add Faculty
                    </button>
                    <button onClick={() => setShowAddFaculty(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Timetable Management</h2>
              <button
                onClick={() => setShowAddTimetable(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Schedule
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timetable.map((slot) => {
                    const course = courses.find(c => c.id === slot.courseId);
                    const facultyMember = faculty.find(f => f.id === slot.facultyId);
                    return (
                      <tr key={slot.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{slot.day}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{slot.startTime} - {slot.endTime}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{facultyMember?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{slot.room}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {showAddTimetable && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add Schedule</h3>
                  <div className="space-y-4">
                    <select
                      value={newTimetable.courseId}
                      onChange={(e) => setNewTimetable({ ...newTimetable, courseId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <select
                      value={newTimetable.day}
                      onChange={(e) => setNewTimetable({ ...newTimetable, day: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      placeholder="Start Time"
                      value={newTimetable.startTime}
                      onChange={(e) => setNewTimetable({ ...newTimetable, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      placeholder="End Time"
                      value={newTimetable.endTime}
                      onChange={(e) => setNewTimetable({ ...newTimetable, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Room"
                      value={newTimetable.room}
                      onChange={(e) => setNewTimetable({ ...newTimetable, room: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newTimetable.facultyId}
                      onChange={(e) => setNewTimetable({ ...newTimetable, facultyId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Faculty</option>
                      {faculty.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button onClick={handleAddTimetable} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Add Schedule
                    </button>
                    <button onClick={() => setShowAddTimetable(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Attendance Management</h2>
              <button
                onClick={() => setShowMarkAttendance(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark Attendance
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendance.map((record) => {
                    const course = courses.find(c => c.id === record.courseId);
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.studentId}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {showMarkAttendance && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Mark Attendance</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Student ID"
                      value={newAttendance.studentId}
                      onChange={(e) => setNewAttendance({ ...newAttendance, studentId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newAttendance.courseId}
                      onChange={(e) => setNewAttendance({ ...newAttendance, courseId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={newAttendance.date}
                      onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newAttendance.status}
                      onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button onClick={handleMarkAttendance} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Mark Attendance
                    </button>
                    <button onClick={() => setShowMarkAttendance(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Assignment Management</h2>
              <div className="flex space-x-3">
                <label className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  Upload Material
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.jpg,.png" />
                </label>
                <button
                  onClick={() => setShowAddAssignment(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Assignment
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => {
                const course = courses.find(c => c.id === assignment.courseId);
                return (
                  <div key={assignment.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{assignment.maxMarks} marks</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    <div className="space-y-2 text-sm text-gray-600 border-t pt-3">
                      <p><span className="font-medium">Course:</span> {course?.name}</p>
                      <p><span className="font-medium">Due Date:</span> {assignment.dueDate}</p>
                      <p><span className="font-medium">Created:</span> {assignment.createdAt}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {showAddAssignment && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Create Assignment</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Assignment Title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Description"
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <select
                      value={newAssignment.courseId}
                      onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      placeholder="Due Date"
                      value={newAssignment.dueDate}
                      onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Marks"
                      value={newAssignment.maxMarks}
                      onChange={(e) => setNewAssignment({ ...newAssignment, maxMarks: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attach Files (Cloudinary)</label>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        multiple
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button onClick={handleAddAssignment} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Create Assignment
                    </button>
                    <button onClick={() => setShowAddAssignment(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}