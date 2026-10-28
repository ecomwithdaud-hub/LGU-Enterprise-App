import axios from 'axios';
import { StudentDashboardData } from '../types';

// Change to your machine LAN IP or localhost for Expo development
export const API_BASE_URL = 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Fallback high-fidelity mock data matching official LGU Portal specification
export const MOCK_STUDENT_DASHBOARD: StudentDashboardData = {
  success: true,
  student: {
    userId: 'c64a51eb-0cb3-4217-bf24-2c24ef84c71e',
    fullName: 'Muhammad Hamza Khan',
    email: 'fa23-bcs-042@lgu.edu.pk',
    phone: '+92-301-8492011',
    avatarUrl: undefined,
    rollNumber: 'FA23-BCS-042',
    registrationNumber: 'LGU-23-BCS-0042',
    programName: 'BS Computer Science',
    programCode: 'BSCS',
    departmentName: 'Department of Computer Science',
  },
  academicSummary: {
    enrolledSemester: 'Fa-2026',
    classSection: 'F',
    cumulativeCgpa: 2.39,
    academicYear: '2026-2027',
    degreeProgressPercentage: 62,
  },
  financialSummary: {
    totalOutstandingDues: 138008,
    formattedOutstandingDues: 'Rs. 138,008',
    totalBilled: 175000,
    formattedTotalBilled: 'Rs. 175,000',
    totalPaid: 36992,
    formattedTotalPaid: 'Rs. 36,992',
    hasPendingDues: true,
  },
  studentChallansLedger: [
    {
      id: 'ch-01',
      challanNumber: 'LGU-CH-2026-89104',
      semesterSession: 'Fall 2026 (Sem-5)',
      challanType: 'Installment-II',
      issueDate: '2026-09-01',
      dueDate: '2026-10-15',
      paidDate: null,
      status: 'Valid',
      rawStatus: 'UNPAID',
      amount: 138008,
      paidAmount: 0,
      balance: 138008,
      bankReference: null,
      breakdown: {
        tuitionFee: 110000,
        labCharges: 15000,
        examinationFee: 8000,
        campusDevFund: 5008,
      },
    },
    {
      id: 'ch-02',
      challanNumber: 'LGU-CH-2026-88019',
      semesterSession: 'Fall 2026 (Sem-5)',
      challanType: 'Registration & Initial Dues',
      issueDate: '2026-08-10',
      dueDate: '2026-08-25',
      paidDate: '2026-08-22',
      status: 'Paid',
      rawStatus: 'PAID',
      amount: 36992,
      paidAmount: 36992,
      balance: 0,
      bankReference: 'HBL-BILL-9902148',
      breakdown: {
        registrationFee: 15000,
        installmentOne: 21992,
      },
    },
    {
      id: 'ch-03',
      challanNumber: 'LGU-CH-2026-74910',
      semesterSession: 'Spring 2026 (Sem-4)',
      challanType: 'Installment-II',
      issueDate: '2026-02-15',
      dueDate: '2026-03-20',
      paidDate: '2026-03-18',
      status: 'Paid',
      rawStatus: 'PAID',
      amount: 125000,
      paidAmount: 125000,
      balance: 0,
      bankReference: 'JAZZCASH-TXN-112903',
    },
  ],
  currentEnrolledCourses: [
    {
      courseCode: 'CS-301',
      courseName: 'Data Structures and Algorithms',
      teacherName: 'Dr. Tariq Chaudhry',
      type: 'Theory',
      creditHours: 3,
      totalClasses: 28,
      presentClasses: 24,
      absentClasses: 4,
      attendancePercentage: 85.7,
      status: 'ELIGIBLE',
    },
    {
      courseCode: 'CS-301L',
      courseName: 'Data Structures and Algorithms Lab',
      teacherName: 'Engr. Bilal Ahmed',
      type: 'Lab',
      creditHours: 1,
      totalClasses: 14,
      presentClasses: 13,
      absentClasses: 1,
      attendancePercentage: 92.9,
      status: 'ELIGIBLE',
    },
    {
      courseCode: 'CS-305',
      courseName: 'Database Management Systems',
      teacherName: 'Dr. Ayesha Malik',
      type: 'Theory',
      creditHours: 3,
      totalClasses: 28,
      presentClasses: 20,
      absentClasses: 8,
      attendancePercentage: 71.4,
      status: 'WARNING_LOW',
    },
    {
      courseCode: 'SE-302',
      courseName: 'Software Architecture & Design',
      teacherName: 'Prof. Muhammad Hamza',
      type: 'Theory',
      creditHours: 3,
      totalClasses: 28,
      presentClasses: 26,
      absentClasses: 2,
      attendancePercentage: 92.9,
      status: 'ELIGIBLE',
    },
    {
      courseCode: 'MTH-201',
      courseName: 'Linear Algebra and Differential Equations',
      teacherName: 'Dr. Shahid Mahmood',
      type: 'Theory',
      creditHours: 3,
      totalClasses: 28,
      presentClasses: 22,
      absentClasses: 6,
      attendancePercentage: 78.6,
      status: 'ELIGIBLE',
    },
  ],
  academicCalendar: [
    {
      id: 'cal-01',
      title: 'Fall 2026 Mid-Term Examinations',
      date: '2026-11-17',
      category: 'EXAMINATION',
      daysLeft: 20,
      description: 'Mid-term centralized exams across all undergraduate academic blocks.',
    },
    {
      id: 'cal-02',
      title: 'Last Date for Fee Installment-II',
      date: '2026-10-31',
      category: 'FEES',
      daysLeft: 3,
      description: 'Submission of voucher via 1Bill, HBL Konnect, or Campus Counter.',
    },
    {
      id: 'cal-03',
      title: 'LGU TechFest & Sports Olympiad 2026',
      date: '2026-12-05',
      category: 'EVENT',
      daysLeft: 38,
      description: 'Annual inter-department sports, hackathons, and cultural festivities.',
    },
    {
      id: 'cal-04',
      title: 'Fall 2026 Final Term Examinations',
      date: '2027-01-18',
      category: 'EXAMINATION',
      daysLeft: 82,
      description: 'Final term theory and comprehensive practical evaluations.',
    },
  ],
  recentNotices: [
    {
      id: 'not-01',
      title: 'Fall 2026 Mid-Term Examination Schedule Announced',
      summary: 'Centralized examination schedule published by the Controller of Examinations.',
      category: 'EXAMINATION',
      priority: 'HIGH',
      publishedAt: '2026-10-25',
    },
    {
      id: 'not-02',
      title: 'Transport Notice: Updated Morning Route Departure Timings',
      summary: '15-minute adjustment in morning route R-01 and R-02.',
      category: 'TRANSPORT',
      priority: 'MEDIUM',
      publishedAt: '2026-10-24',
    },
  ],
};

export const fetchStudentDashboard = async (userId?: string): Promise<StudentDashboardData> => {
  try {
    const endpoint = userId ? `/students/dashboard/${userId}` : `/students/dashboard/me`;
    const response = await apiClient.get<StudentDashboardData>(endpoint);
    return response.data;
  } catch (error) {
    console.warn('API call failed or server offline; falling back to high-fidelity mock data:', error);
    return MOCK_STUDENT_DASHBOARD;
  }
};
