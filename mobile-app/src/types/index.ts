export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
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
