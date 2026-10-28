export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  role: {
    type: string;
    name: string;
    displayName: string;
  };
  department?: {
    id: string;
    code: string;
    name: string;
  };
  studentProfile?: {
    rollNumber: string;
    registrationNumber: string;
    currentSemester: number;
    cgpa?: number;
    section?: {
      name: string;
    };
  };
  facultyProfile?: {
    employeeId: string;
    designation: string;
    qualification: string;
    officeRoom?: string;
  };
}

export interface StudentDashboardData {
  success: boolean;
  student: {
    userId: string;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    rollNumber: string;
    registrationNumber: string;
    programName: string;
    programCode: string;
    departmentName: string;
  };
  academicSummary: {
    enrolledSemester: string;
    classSection: string;
    cumulativeCgpa: number;
    academicYear: string;
    degreeProgressPercentage: number;
  };
  financialSummary: {
    totalOutstandingDues: number;
    formattedOutstandingDues: string;
    totalBilled: number;
    formattedTotalBilled: string;
    totalPaid: number;
    formattedTotalPaid: string;
    hasPendingDues: boolean;
  };
  studentChallansLedger: Array<{
    id: string;
    challanNumber: string;
    semesterSession: string;
    challanType: string;
    issueDate: string;
    dueDate: string;
    paidDate?: string | null;
    status: 'Paid' | 'Valid' | 'Pending' | 'Overdue';
    rawStatus: string;
    amount: number;
    paidAmount: number;
    balance: number;
    bankReference?: string | null;
    breakdown?: Record<string, any>;
  }>;
  currentEnrolledCourses: Array<{
    courseCode: string;
    courseName: string;
    teacherName: string;
    type: 'Theory' | 'Lab';
    creditHours: number;
    totalClasses: number;
    presentClasses: number;
    absentClasses: number;
    attendancePercentage: number;
    status: 'ELIGIBLE' | 'WARNING_LOW';
  }>;
  academicCalendar: Array<{
    id: string;
    title: string;
    date: string;
    category: string;
    daysLeft: number;
    description: string;
  }>;
  recentNotices?: Array<{
    id: string;
    title: string;
    summary?: string;
    category: string;
    priority: string;
    publishedAt: string;
  }>;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  course: {
    code: string;
    title: string;
    creditHours: number;
  };
  room: {
    roomNumber: string;
    building: string;
  };
  teacher?: {
    firstName: string;
    lastName: string;
  };
  section?: {
    name: string;
  };
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  priority: string;
  publishedAt: string;
  isPinned: boolean;
}

export interface BusRoute {
  id: string;
  routeCode: string;
  routeName: string;
  morningDeparture: string;
  eveningDeparture: string;
  stops: Array<{
    stopName: string;
    time: string;
    lat: number;
    lng: number;
  }>;
}

export interface FeeChallan {
  id: string;
  challanNumber: string;
  semester: number;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
}

export interface LibraryBookItem {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  rackLocation: string;
  totalCopies: number;
  availableCopies: number;
  publicationYear?: number;
  publisher?: string;
}

export interface BorrowedBookItem {
  recordId: string;
  bookId: string;
  title: string;
  author: string;
  isbn: string;
  rackLocation: string;
  issueDate: string;
  dueDate: string;
  daysRemaining: number;
  isOverdue: boolean;
  overdueDays: number;
  fineAmount: number;
  status: 'ISSUED' | 'OVERDUE' | 'RETURNED';
}

export interface DigitalWorkstationLab {
  labId: string;
  name: string;
  location: string;
  totalPCs: number;
  occupiedPCs: number;
  availablePCs: number;
  hardwareSpecs: string;
  operatingSystem: string;
  rules: string;
  timeSlotsAvailable: Array<{
    slot: string;
    status: 'AVAILABLE' | 'FEW_LEFT' | 'FULL';
    openSeats: number;
  }>;
}

export interface EResourceItem {
  id: string;
  name: string;
  description: string;
  url: string;
  badge: string;
  category: string;
  coverage: string;
}
