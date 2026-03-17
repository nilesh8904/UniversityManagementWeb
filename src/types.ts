export type UserRole = 'university_admin' | 'college_admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  collegeId?: string;
  studentId?: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  address: string;
  establishedYear: number;
  dean: string;
  totalStudents: number;
  totalFaculty: number;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  duration: string;
  degree: string;
  collegeId: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  facultyId: string;
  facultyName: string;
  programId: string;
  collegeId: string;
  semester: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  collegeId: string;
  specialization: string;
  phone: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  collegeId: string;
  programId: string;
  semester: number;
  enrollmentYear: number;
  phone: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  facultyId: string;
  dueDate: string;
  maxMarks: number;
  attachments: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  files: string[];
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  examType: string;
  marks: number;
  maxMarks: number;
  grade: string;
  semester: number;
}

export interface Timetable {
  id: string;
  courseId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  facultyId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetRole: UserRole | 'all';
  createdAt: string;
  read: boolean;
}