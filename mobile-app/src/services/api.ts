import axios from 'axios';
import {
  StudentDashboardData,
  LibraryBookItem,
  BorrowedBookItem,
  DigitalWorkstationLab,
  EResourceItem,
} from '../types';

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

// ==============================================================================
// 1. STUDENT PORTAL DATA
// ==============================================================================
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

// ==============================================================================
// 2. CENTRAL LIBRARY & DIGITAL WORKSTATIONS DATA
// ==============================================================================
export const MOCK_LIBRARY_BOOKS: LibraryBookItem[] = [
  {
    id: 'book-01',
    isbn: '978-0131103627',
    title: 'The C Programming Language (2nd Edition)',
    author: 'Brian W. Kernighan, Dennis M. Ritchie',
    category: 'Computer Science',
    rackLocation: 'Rack CS-01, Shelf-A',
    totalCopies: 12,
    availableCopies: 8,
    publicationYear: 1988,
    publisher: 'Prentice Hall',
  },
  {
    id: 'book-02',
    isbn: '978-0262033848',
    title: 'Introduction to Algorithms (CLRS 4th Edition)',
    author: 'Thomas H. Cormen, Charles E. Leiserson',
    category: 'Computer Science',
    rackLocation: 'Rack CS-03, Shelf-B',
    totalCopies: 20,
    availableCopies: 14,
    publicationYear: 2022,
    publisher: 'MIT Press',
  },
  {
    id: 'book-03',
    isbn: '978-0132350884',
    title: 'Clean Code: Agile Software Craftsmanship',
    author: 'Robert C. Martin (Uncle Bob)',
    category: 'Software Engineering',
    rackLocation: 'Rack SE-02, Shelf-A',
    totalCopies: 15,
    availableCopies: 9,
    publicationYear: 2008,
    publisher: 'Pearson',
  },
  {
    id: 'book-04',
    isbn: '978-0201633610',
    title: 'Design Patterns: Elements of Reusable OO Software',
    author: 'Erich Gamma, Richard Helm',
    category: 'Software Engineering',
    rackLocation: 'Rack SE-04, Shelf-C',
    totalCopies: 10,
    availableCopies: 6,
    publicationYear: 1994,
    publisher: 'Addison-Wesley',
  },
  {
    id: 'book-05',
    isbn: '978-0262035613',
    title: 'Deep Learning (Adaptive Computation & ML)',
    author: 'Ian Goodfellow, Yoshua Bengio',
    category: 'Artificial Intelligence',
    rackLocation: 'Rack AI-01, Shelf-D',
    totalCopies: 14,
    availableCopies: 11,
    publicationYear: 2016,
    publisher: 'MIT Press',
  },
  {
    id: 'book-06',
    isbn: '978-0134685991',
    title: 'Artificial Intelligence: A Modern Approach (4th Ed)',
    author: 'Stuart Russell, Peter Norvig',
    category: 'Artificial Intelligence',
    rackLocation: 'Rack AI-03, Shelf-B',
    totalCopies: 18,
    availableCopies: 7,
    publicationYear: 2020,
    publisher: 'Pearson',
  },
  {
    id: 'book-07',
    isbn: '978-1491950296',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Distributed Systems',
    rackLocation: 'Rack CS-08, Shelf-A',
    totalCopies: 12,
    availableCopies: 5,
    publicationYear: 2017,
    publisher: "O'Reilly Media",
  },
];

export const MOCK_MY_BORROWED_BOOKS: {
  studentId: string;
  activeLoansCount: number;
  totalFinesAccrued: number;
  activeLoans: BorrowedBookItem[];
  loanHistory: any[];
} = {
  studentId: 'c64a51eb-0cb3-4217-bf24-2c24ef84c71e',
  activeLoansCount: 2,
  totalFinesAccrued: 0.0,
  activeLoans: [
    {
      recordId: 'rec-01',
      bookId: 'book-02',
      title: 'Introduction to Algorithms (CLRS 4th Edition)',
      author: 'Thomas H. Cormen, Charles E. Leiserson',
      isbn: '978-0262033848',
      rackLocation: 'Rack CS-03, Shelf-B',
      issueDate: '2026-10-18',
      dueDate: '2026-11-01',
      daysRemaining: 4,
      isOverdue: false,
      overdueDays: 0,
      fineAmount: 0.0,
      status: 'ISSUED',
    },
    {
      recordId: 'rec-02',
      bookId: 'book-03',
      title: 'Clean Code: Agile Software Craftsmanship',
      author: 'Robert C. Martin (Uncle Bob)',
      isbn: '978-0132350884',
      rackLocation: 'Rack SE-02, Shelf-A',
      issueDate: '2026-10-22',
      dueDate: '2026-11-05',
      daysRemaining: 8,
      isOverdue: false,
      overdueDays: 0,
      fineAmount: 0.0,
      status: 'ISSUED',
    },
  ],
  loanHistory: [
    {
      recordId: 'rec-hist-01',
      bookId: 'book-01',
      title: 'The C Programming Language (2nd Edition)',
      author: 'Brian W. Kernighan, Dennis M. Ritchie',
      isbn: '978-0131103627',
      issueDate: '2026-09-05',
      dueDate: '2026-09-19',
      returnDate: '2026-09-18',
      fineAmount: 0.0,
      status: 'RETURNED',
    },
  ],
};

export const MOCK_WORKSTATION_LABS: DigitalWorkstationLab[] = [
  {
    labId: 'LAB-01',
    name: 'Sir Syed AI & High-Performance Computing Lab',
    location: 'Central Library 2nd Floor, Wing A',
    totalPCs: 30,
    occupiedPCs: 12,
    availablePCs: 18,
    hardwareSpecs: 'Intel Core i9 14th Gen, 64GB DDR5, NVIDIA RTX 4080 (16GB), Dual 27" 4K',
    operatingSystem: 'Ubuntu 24.04 LTS (PyTorch, TensorFlow, CUDA 12.4)',
    rules: 'Reserved for Deep Learning, Data Science, AI & FYP research.',
    timeSlotsAvailable: [
      { slot: '08:30 - 10:30', status: 'AVAILABLE', openSeats: 8 },
      { slot: '10:30 - 12:30', status: 'FEW_LEFT', openSeats: 3 },
      { slot: '13:00 - 15:00', status: 'AVAILABLE', openSeats: 12 },
      { slot: '15:00 - 17:00', status: 'AVAILABLE', openSeats: 14 },
    ],
  },
  {
    labId: 'LAB-02',
    name: 'Digital Archive & Scientific Repository Lab',
    location: 'Central Library 2nd Floor, Wing B',
    totalPCs: 30,
    occupiedPCs: 7,
    availablePCs: 23,
    hardwareSpecs: 'Intel Core i7 13th Gen, 32GB RAM, Dual IPS 24" Monitors',
    operatingSystem: 'Windows 11 Enterprise (MATLAB, SPSS, LaTeX, EndNote)',
    rules: 'Open for literature review, thesis writing, journal paper research.',
    timeSlotsAvailable: [
      { slot: '08:30 - 10:30', status: 'AVAILABLE', openSeats: 15 },
      { slot: '10:30 - 12:30', status: 'AVAILABLE', openSeats: 11 },
      { slot: '13:00 - 15:00', status: 'AVAILABLE', openSeats: 18 },
      { slot: '15:00 - 17:00', status: 'AVAILABLE', openSeats: 20 },
    ],
  },
];

export const MOCK_E_RESOURCES: EResourceItem[] = [
  {
    id: 'eres-01',
    name: 'HEC National Digital Library',
    description: 'Access to over 20,000 international peer-reviewed journals and 75,000+ electronic books.',
    url: 'https://www.digitallibrary.edu.pk',
    badge: 'HEC Sponsored',
    category: 'MULTI_DISCIPLINARY',
    coverage: 'Full-text journals across all disciplines',
  },
  {
    id: 'eres-02',
    name: 'IEEE Xplore Digital Library',
    description: 'Flagship repository for electrical engineering, computer science, and electronics.',
    url: 'https://ieeexplore.ieee.org',
    badge: 'High Impact',
    category: 'ENGINEERING_AND_CS',
    coverage: '5M+ conference papers & IEEE transactions',
  },
  {
    id: 'eres-03',
    name: 'ACM Digital Library',
    description: 'Association for Computing Machinery flagship collection of computing research.',
    url: 'https://dl.acm.org',
    badge: 'Core CS',
    category: 'COMPUTER_SCIENCE',
    coverage: 'SIGGRAPH, SIGCOMM, SIGMOD proceedings',
  },
  {
    id: 'eres-04',
    name: 'ScienceDirect (Elsevier)',
    description: 'Leading database of scientific, technical, and medical research papers.',
    url: 'https://www.sciencedirect.com',
    badge: 'Peer-Reviewed',
    category: 'SCIENCE_AND_TECH',
    coverage: '18M+ articles across 2,500+ journals',
  },
  {
    id: 'eres-05',
    name: 'SpringerLink Academic',
    description: 'Research repository covering physics, mathematics, business, and CS.',
    url: 'https://link.springer.com',
    badge: 'Springer Nature',
    category: 'MULTI_DISCIPLINARY',
    coverage: '3,000+ journals and 300,000+ books',
  },
  {
    id: 'eres-06',
    name: 'LGU Institutional Repository & Past Papers',
    description: 'Official university digital archive hosting theses, faculty publications, and past exams.',
    url: 'https://repository.lgu.edu.pk',
    badge: 'LGU Internal',
    category: 'UNIVERSITY_ARCHIVE',
    coverage: 'Faculty research outputs, capstone projects, past exams',
  },
];

export const fetchLibraryBooks = async (search?: string, category?: string): Promise<{ data: LibraryBookItem[]; totalCatalogSize: number }> => {
  try {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    const response = await apiClient.get('/library/books', { params });
    return response.data;
  } catch {
    let filtered = MOCK_LIBRARY_BOOKS;
    if (category) {
      filtered = filtered.filter((b) => b.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q) ||
          b.rackLocation.toLowerCase().includes(q),
      );
    }
    return { data: filtered, totalCatalogSize: 15420 };
  }
};

export const fetchMyBorrowedBooks = async (studentId?: string) => {
  try {
    const endpoint = studentId ? `/library/borrowed/${studentId}` : `/library/my-borrows`;
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch {
    return MOCK_MY_BORROWED_BOOKS;
  }
};

export const fetchDigitalWorkstations = async () => {
  try {
    const response = await apiClient.get('/library/digital-workstations');
    return response.data;
  } catch {
    return {
      summary: {
        totalWorkstations: 60,
        activeUsers: 19,
        availableSlots: 41,
        maintenanceCount: 2,
        networkSpeed: '1 Gbps Dedicated Fiber (PERN / HEC)',
      },
      labs: MOCK_WORKSTATION_LABS,
    };
  }
};

export const reserveWorkstationSlot = async (
  workstationId: string,
  date: string,
  timeSlot: string,
  purpose?: string,
) => {
  try {
    const response = await apiClient.post('/library/workstation/reserve', {
      workstationId,
      date,
      timeSlot,
      purpose,
    });
    return response.data;
  } catch {
    return {
      success: true,
      message: `Workstation reservation confirmed for ${timeSlot} on ${date}.`,
      reservation: {
        reservationCode: `LGU-WS-${Date.now().toString().slice(-4)}-891`,
        allocatedDesk: `Desk-${workstationId || '12'} (Sir Syed AI Lab)`,
        timeSlot,
        date,
      },
    };
  }
};

export const fetchEResources = async (): Promise<EResourceItem[]> => {
  try {
    const response = await apiClient.get('/library/e-resources');
    return response.data.eResources || MOCK_E_RESOURCES;
  } catch {
    return MOCK_E_RESOURCES;
  }
};
