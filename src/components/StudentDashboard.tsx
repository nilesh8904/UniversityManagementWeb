import { useState } from 'react';
import { Course, Attendance, Assignment, Submission, Result } from '../types';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'attendance' | 'assignments' | 'results' | 'materials'>('overview');
  
  const studentId = 'STU001';
  
  const [courses] = useState<Course[]>([
    { id: 'c1', name: 'Data Structures', code: 'CS201', credits: 4, facultyId: 'f1', facultyName: 'Dr. Alice Johnson', programId: 'p1', collegeId: 'col1', semester: 3 },
    { id: 'c2', name: 'Database Systems', code: 'CS301', credits: 3, facultyId: 'f2', facultyName: 'Prof. Bob Smith', programId: 'p1', collegeId: 'col1', semester: 5 },
    { id: 'c3', name: 'Machine Learning', code: 'CS401', credits: 4, facultyId: 'f1', facultyName: 'Dr. Alice Johnson', programId: 'p1', collegeId: 'col1', semester: 7 },
  ]);

  const [attendance] = useState<Attendance[]>([
    { id: 'a1', studentId: 'STU001', courseId: 'c1', date: '2024-01-15', status: 'present', markedBy: 'f1' },
    { id: 'a2', studentId: 'STU001', courseId: 'c1', date: '2024-01-16', status: 'present', markedBy: 'f1' },
    { id: 'a3', studentId: 'STU001', courseId: 'c1', date: '2024-01-17', status: 'absent', markedBy: 'f1' },
    { id: 'a4', studentId: 'STU001', courseId: 'c2', date: '2024-01-15', status: 'present', markedBy: 'f2' },
    { id: 'a5', studentId: 'STU001', courseId: 'c2', date: '2024-01-16', status: 'late', markedBy: 'f2' },
  ]);

  const [assignments] = useState<Assignment[]>([
    { id: 'as1', title: 'Binary Trees Implementation', description: 'Implement various binary tree operations including insertion, deletion, and traversal', courseId: 'c1', facultyId: 'f1', dueDate: '2024-02-01', maxMarks: 100, attachments: ['assignment1.pdf'], createdAt: '2024-01-10' },
    { id: 'as2', title: 'SQL Queries', description: 'Write complex SQL queries for the given database schema', courseId: 'c2', facultyId: 'f2', dueDate: '2024-02-05', maxMarks: 50, attachments: ['database_schema.pdf'], createdAt: '2024-01-12' },
    { id: 'as3', title: 'Neural Network Implementation', description: 'Build a simple neural network from scratch', courseId: 'c3', facultyId: 'f1', dueDate: '2024-02-10', maxMarks: 100, attachments: [], createdAt: '2024-01-15' },
  ]);

  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: 's1', assignmentId: 'as1', studentId: 'STU001', submittedAt: '2024-01-30', files: ['solution.pdf'], marks: 85, feedback: 'Good work! Minor improvements needed in optimization.', status: 'graded' },
  ]);

  const [results] = useState<Result[]>([
    { id: 'r1', studentId: 'STU001', courseId: 'c1', examType: 'Midterm', marks: 42, maxMarks: 50, grade: 'A', semester: 3 },
    { id: 'r2', studentId: 'STU001', courseId: 'c2', examType: 'Midterm', marks: 38, maxMarks: 50, grade: 'B+', semester: 5 },
    { id: 'r3', studentId: 'STU001', courseId: 'c1', examType: 'Quiz 1', marks: 18, maxMarks: 20, grade: 'A+', semester: 3 },
  ]);

  const [materials] = useState([
    { id: 'm1', title: 'Data Structures Lecture Notes', courseId: 'c1', type: 'PDF', url: '#', uploadedAt: '2024-01-10' },
    { id: 'm2', title: 'Database Design Tutorial', courseId: 'c2', type: 'Video', url: '#', uploadedAt: '2024-01-12' },
    { id: 'm3', title: 'ML Algorithms Cheat Sheet', courseId: 'c3', type: 'PDF', url: '#', uploadedAt: '2024-01-15' },
  ]);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');

  const handleSubmitAssignment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedAssignment) {
      const newSubmission: Submission = {
        id: `s${submissions.length + 1}`,
        assignmentId: selectedAssignment,
        studentId: studentId,
        submittedAt: new Date().toISOString().split('T')[0],
        files: [file.name],
        status: 'submitted'
      };
      setSubmissions([...submissions, newSubmission]);
      setShowSubmitModal(false);
      setSelectedAssignment('');
      alert(`Assignment submitted successfully! File: ${file.name} (Uploaded to Cloudinary)`);
    }
  };

  const handleDownload = (filename: string) => {
    alert(`Downloading ${filename} from Cloudinary...`);
  };

  const getAttendancePercentage = (courseId: string) => {
    const courseAttendance = attendance.filter(a => a.studentId === studentId && a.courseId === courseId);
    if (courseAttendance.length === 0) return 0;
    const present = courseAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    return ((present / courseAttendance.length) * 100).toFixed(1);
  };

  const getOverallAttendance = () => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    if (studentAttendance.length === 0) return 0;
    const present = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    return ((present / studentAttendance.length) * 100).toFixed(1);
  };

  const getSubmissionStatus = (assignmentId: string) => {
    return submissions.find(s => s.assignmentId === assignmentId && s.studentId === studentId);
  };

  const calculateGPA = () => {
    const gradePoints: { [key: string]: number } = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0 };
    const studentResults = results.filter(r => r.studentId === studentId);
    if (studentResults.length === 0) return 0;
    const totalPoints = studentResults.reduce((sum, r) => sum + (gradePoints[r.grade] || 0), 0);
    return (totalPoints / studentResults.length).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <div className="text-sm text-gray-600">
              Student ID: <span className="font-semibold text-gray-900">{studentId}</span>
            </div>
          </div>
          <div className="flex space-x-8 border-b overflow-x-auto">
            {(['overview', 'courses', 'attendance', 'assignments', 'results', 'materials'] as const).map((tab) => (
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
                    <p className="text-sm text-gray-600">Enrolled Courses</p>
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
                    <p className="text-sm text-gray-600">Overall Attendance</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{getOverallAttendance()}%</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Assignments</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {assignments.filter(a => !getSubmissionStatus(a.id)).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current GPA</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{calculateGPA()}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {assignments
                    .filter(a => !getSubmissionStatus(a.id))
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .slice(0, 3)
                    .map((assignment) => {
                      const course = courses.find(c => c.id === assignment.courseId);
                      const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{assignment.title}</p>
                            <p className="text-sm text-gray-600">{course?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-orange-600">{daysLeft} days left</p>
                            <p className="text-xs text-gray-500">{assignment.dueDate}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
                <div className="space-y-3">
                  {results.slice(0, 3).map((result) => {
                    const course = courses.find(c => c.id === result.courseId);
                    return (
                      <div key={result.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{course?.name}</p>
                          <p className="text-sm text-gray-600">{result.examType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{result.grade}</p>
                          <p className="text-xs text-gray-500">{result.marks}/{result.maxMarks}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">{course.code}</span>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{course.credits} Credits</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-medium">Faculty:</span> {course.facultyName}</p>
                    <p><span className="font-medium">Semester:</span> {course.semester}</p>
                    <div className="pt-2 border-t border-gray-100 mt-3">
                      <p className="font-medium text-gray-900">Attendance: {getAttendancePercentage(course.id)}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${getAttendancePercentage(course.id)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">My Attendance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-3xl font-bold text-green-600">{getAttendancePercentage(course.id)}%</p>
                  <p className="text-sm text-gray-600 mt-1">Attendance Rate</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendance
                    .filter(a => a.studentId === studentId)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => {
                      const course = courses.find(c => c.id === record.courseId);
                      return (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{record.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{course?.name}</td>
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
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => {
                const course = courses.find(c => c.id === assignment.courseId);
                const submission = getSubmissionStatus(assignment.id);
                const isOverdue = new Date(assignment.dueDate) < new Date() && !submission;
                
                return (
                  <div key={assignment.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{assignment.maxMarks} marks</span>
                        {submission && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            submission.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.status}
                          </span>
                        )}
                        {isOverdue && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Overdue</span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    <div className="space-y-2 text-sm text-gray-600 border-t pt-3">
                      <p><span className="font-medium">Course:</span> {course?.name}</p>
                      <p><span className="font-medium">Due Date:</span> {assignment.dueDate}</p>
                      {assignment.attachments.length > 0 && (
                        <div>
                          <span className="font-medium">Attachments:</span>
                          {assignment.attachments.map((file, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleDownload(file)}
                              className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                              {file}
                            </button>
                          ))}
                        </div>
                      )}
                      {submission && (
                        <div className="pt-2 border-t mt-2">
                          <p><span className="font-medium">Submitted:</span> {submission.submittedAt}</p>
                          {submission.marks !== undefined && (
                            <>
                              <p><span className="font-medium">Marks:</span> {submission.marks}/{assignment.maxMarks}</p>
                              <p><span className="font-medium">Feedback:</span> {submission.feedback}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {!submission && (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment.id);
                          setShowSubmitModal(true);
                        }}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Assignment
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {showSubmitModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Submit Assignment</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Upload your assignment file (PDF, DOC, DOCX, ZIP)</p>
                    <input
                      type="file"
                      onChange={handleSubmitAssignment}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      accept=".pdf,.doc,.docx,.zip"
                    />
                    <p className="text-xs text-gray-500">Files will be uploaded to Cloudinary for secure storage</p>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowSubmitModal(false);
                        setSelectedAssignment('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Results</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current GPA</p>
                <p className="text-2xl font-bold text-purple-600">{calculateGPA()}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.filter(r => r.studentId === studentId).map((result) => {
                    const course = courses.find(c => c.id === result.courseId);
                    const percentage = ((result.marks / result.maxMarks) * 100).toFixed(1);
                    return (
                      <tr key={result.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{course?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.examType}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {result.marks}/{result.maxMarks} ({percentage}%)
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                            result.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                            result.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.semester}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Course Materials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => {
                const course = courses.find(c => c.id === material.courseId);
                return (
                  <div key={material.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{material.type}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{material.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Course:</span> {course?.name}</p>
                      <p><span className="font-medium">Uploaded:</span> {material.uploadedAt}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(material.title)}
                      className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}