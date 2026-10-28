import { PrismaClient, RoleType, DepartmentType, DegreeLevel, DayOfWeek, RoomType, Shift, BorrowStatus, BusStatus, ChallanStatus, PaymentMethod, OrderStatus, OrderPaymentStatus, NoticeCategory, NoticePriority, TargetAudience, GatePassType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper for random selection
const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const pad = (num: number, size: number = 3): string => num.toString().padStart(size, '0');

// Pakistani names dataset for realistic generation
const FIRST_NAMES_MALE = [
  'Muhammad', 'Ali', 'Ahmed', 'Hamza', 'Usman', 'Bilal', 'Hassan', 'Husnain', 'Zubair', 'Omer',
  'Tariq', 'Farhan', 'Saad', 'Daniyal', 'Shahzaib', 'Abdullah', 'Haris', 'Waleed', 'Mustafa', 'Zain',
  'Talha', 'Moeez', 'Faizan', 'Ahsan', 'Ibrahim', 'Raza', 'Kashif', 'Kamran', 'Shoaib', 'Naveed'
];

const FIRST_NAMES_FEMALE = [
  'Fatima', 'Ayesha', 'Zainab', 'Noor', 'Maryam', 'Khadija', 'Hira', 'Sana', 'Maham', 'Laiba',
  'Iqra', 'Rimsha', 'Anum', 'Sadia', 'Bushra', 'Amna', 'Mehak', 'Momina', 'Zoya', 'Alishba',
  'Kiran', 'Nida', 'Sidra', 'Areeba', 'Rabia', 'Farah', 'Sobia', 'Tehreem', 'Tayyaba', 'Kinza'
];

const LAST_NAMES = [
  'Khan', 'Malik', 'Chaudhry', 'Bhatti', 'Sheikh', 'Qureshi', 'Butt', 'Dar', 'Ansari', 'Siddiqui',
  'Mirza', 'Rana', 'Jutt', 'Gujjar', 'Rehman', 'Javed', 'Akram', 'Nawaz', 'Iqbal', 'Shah',
  'Gondal', 'Warraich', 'Cheema', 'Tarar', 'Bajwa', 'Gill', 'Virk', 'Dogar', 'Awan', 'Rizvi'
];

async function main() {
  console.log('================================================================');
  console.log('🚀 Lahore Garrison University (LGU) Super App - Seeding Database');
  console.log('================================================================');

  // 1. Clean Database in Reverse Dependency Order
  console.log('\n🧹 Cleaning existing database records...');
  await prisma.timetableSlot.deleteMany();
  await prisma.borrowRecord.deleteMany();
  await prisma.libraryBook.deleteMany();
  await prisma.busSubscription.deleteMany();
  await prisma.busRoute.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.cafeteriaOrderItem.deleteMany();
  await prisma.cafeteriaOrder.deleteMany();
  await prisma.cafeteriaItem.deleteMany();
  await prisma.feeChallan.deleteMany();
  await prisma.gatePass.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.program.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();
  console.log('✅ Database cleaned successfully.');

  // Pre-compute bcrypt password for high seeding speed (1 hash reused)
  const defaultPassword = 'LguPass2026!';
  console.log(`\n🔑 Pre-hashing default password for all mock accounts: "${defaultPassword}"`);
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 2. Seed RBAC Roles
  console.log('\n🛡️  Creating Roles & Permissions...');
  const roleDefinitions = [
    { type: RoleType.SUPER_ADMIN, name: 'SuperAdmin', displayName: 'Super Administrator', description: 'Complete system oversight and administrative privilege' },
    { type: RoleType.VC, name: 'VC', displayName: 'Vice Chancellor', description: 'Executive university governance and executive approvals' },
    { type: RoleType.REGISTRAR, name: 'Registrar', displayName: 'Registrar Office', description: 'Academic records, enrollment approvals, and policy notices' },
    { type: RoleType.HOD, name: 'HoD', displayName: 'Head of Department', description: 'Department-level faculty, syllabus, and timetable management' },
    { type: RoleType.FACULTY, name: 'Faculty', displayName: 'Academic Faculty / Professor', description: 'Course management, student grading, and timetable attendance' },
    { type: RoleType.STUDENT, name: 'Student', displayName: 'Enrolled Student', description: 'Portal access, timetables, fee challans, bus pass, library' },
    { type: RoleType.ACCOUNTS, name: 'Accounts', displayName: 'Accounts & Finance Staff', description: 'Fee generation, challan verification, and ledger reconciliation' },
    { type: RoleType.TRANSPORT, name: 'Transport', displayName: 'Transport Management Office', description: 'Bus fleet tracking, route planning, and bus pass allocation' },
    { type: RoleType.SECURITY, name: 'Security', displayName: 'Campus Security Wing', description: 'Gate pass scans, RFID vehicle clearance, and visitor logs' },
    { type: RoleType.LIBRARY, name: 'Library', displayName: 'Central Library Staff', description: 'Book inventory, ISBN cataloging, and borrow records' },
    { type: RoleType.CAFETERIA, name: 'Cafeteria', displayName: 'Campus Cafeteria Operations', description: 'Food menu management, order queueing, and canteen POS' },
  ];

  const rolesMap = new Map<RoleType, string>();
  for (const roleDef of roleDefinitions) {
    const role = await prisma.role.create({
      data: roleDef,
    });
    rolesMap.set(role.type, role.id);
  }

  // Permissions
  const permissionsList = [
    { slug: 'timetables:read', module: 'TIMETABLES', description: 'View room, teacher, and section timetables' },
    { slug: 'timetables:manage', module: 'TIMETABLES', description: 'Create, update, and resolve timetable clashes' },
    { slug: 'fees:view', module: 'ACCOUNTS', description: 'View fee challans and balance dues' },
    { slug: 'fees:manage', module: 'ACCOUNTS', description: 'Issue, edit, and mark fee challans as paid' },
    { slug: 'transport:track', module: 'TRANSPORT', description: 'Track buses and view route stops' },
    { slug: 'transport:manage', module: 'TRANSPORT', description: 'Manage bus fleet and route scheduling' },
    { slug: 'library:borrow', module: 'LIBRARY', description: 'Issue and return library books' },
    { slug: 'library:catalog', module: 'LIBRARY', description: 'Add and curate library book catalog' },
    { slug: 'cafeteria:order', module: 'CAFETERIA', description: 'Place food orders and track pickup queue' },
    { slug: 'cafeteria:manage', module: 'CAFETERIA', description: 'Update cafeteria menu and fulfill orders' },
    { slug: 'notices:publish', module: 'NOTICES', description: 'Publish and pin campus announcements' },
    { slug: 'security:scan', module: 'SECURITY', description: 'Scan RFID cards and approve campus entry' },
  ];

  for (const perm of permissionsList) {
    await prisma.permission.create({ data: perm });
  }

  // 3. Seed Departments (Academic & Administrative)
  console.log('\n🏛️  Creating University Departments...');
  const deptDefs = [
    { code: 'CS', name: 'Department of Computer Science', type: DepartmentType.ACADEMIC, location: 'Academic Block B, 2nd Floor' },
    { code: 'SE', name: 'Department of Software Engineering', type: DepartmentType.ACADEMIC, location: 'Academic Block B, 3rd Floor' },
    { code: 'IT', name: 'Department of Information Technology', type: DepartmentType.ACADEMIC, location: 'Academic Block B, 1st Floor' },
    { code: 'MATH', name: 'Department of Mathematics & Basic Sciences', type: DepartmentType.ACADEMIC, location: 'Academic Block A, 3rd Floor' },
    { code: 'MGMT', name: 'Department of Management Sciences & BBA', type: DepartmentType.ACADEMIC, location: 'Jinnah Block, 2nd Floor' },
    { code: 'ENG', name: 'Department of English & Humanities', type: DepartmentType.ACADEMIC, location: 'Jinnah Block, 1st Floor' },
    { code: 'ACC', name: 'Accounts & Finance Division', type: DepartmentType.ADMINISTRATIVE, location: 'Admin Complex, Ground Floor' },
    { code: 'TRANS', name: 'Campus Transport Directorate', type: DepartmentType.ADMINISTRATIVE, location: 'Transport Depot & Gate 2' },
    { code: 'LIB', name: 'Central University Library', type: DepartmentType.ADMINISTRATIVE, location: 'Iqbal Library Block' },
    { code: 'SEC', name: 'Campus Security & Vigilance Command', type: DepartmentType.ADMINISTRATIVE, location: 'Main Gate Security Office' },
    { code: 'CAFE', name: 'LGU Dining & Student Cafeteria', type: DepartmentType.ADMINISTRATIVE, location: 'Student Activity Center' },
    { code: 'REG', name: 'Office of the Registrar', type: DepartmentType.ADMINISTRATIVE, location: 'Admin Complex, 1st Floor' },
  ];

  const deptMap = new Map<string, string>();
  for (const d of deptDefs) {
    const dept = await prisma.department.create({ data: d });
    deptMap.set(d.code, dept.id);
  }

  // 4. Seed Academic Programs
  console.log('\n🎓 Creating Academic Programs...');
  const progDefs = [
    { code: 'BSCS', name: 'BS Computer Science', degreeLevel: DegreeLevel.UNDERGRADUATE, deptCode: 'CS' },
    { code: 'BSSE', name: 'BS Software Engineering', degreeLevel: DegreeLevel.UNDERGRADUATE, deptCode: 'SE' },
    { code: 'BSIT', name: 'BS Information Technology', degreeLevel: DegreeLevel.UNDERGRADUATE, deptCode: 'IT' },
    { code: 'BBA', name: 'Bachelor of Business Administration', degreeLevel: DegreeLevel.UNDERGRADUATE, deptCode: 'MGMT' },
    { code: 'MSCS', name: 'MS Computer Science', degreeLevel: DegreeLevel.GRADUATE, deptCode: 'CS', totalSemesters: 4 },
  ];

  const progMap = new Map<string, string>();
  for (const p of progDefs) {
    const prog = await prisma.program.create({
      data: {
        code: p.code,
        name: p.name,
        degreeLevel: p.degreeLevel,
        totalSemesters: p.totalSemesters || 8,
        departmentId: deptMap.get(p.deptCode)!,
      },
    });
    progMap.set(p.code, prog.id);
  }

  // 5. Seed Batches
  console.log('\n📅 Creating Academic Batches...');
  const batchDefs = [
    { code: 'FA21', name: 'Fall 2021', startYear: 2021, endYear: 2025 },
    { code: 'SP22', name: 'Spring 2022', startYear: 2022, endYear: 2026 },
    { code: 'FA22', name: 'Fall 2022', startYear: 2022, endYear: 2026 },
    { code: 'SP23', name: 'Spring 2023', startYear: 2023, endYear: 2027 },
    { code: 'FA23', name: 'Fall 2023', startYear: 2023, endYear: 2027 },
    { code: 'FA24', name: 'Fall 2024', startYear: 2024, endYear: 2028 },
  ];

  const batchMap = new Map<string, string>();
  for (const b of batchDefs) {
    const batch = await prisma.batch.create({ data: b });
    batchMap.set(b.code, batch.id);
  }

  // 6. Seed Sections
  console.log('\n👥 Creating Student Sections...');
  const sectionDefs = [
    // BSCS
    { name: 'BSCS-7A', semester: 7, prog: 'BSCS', batch: 'FA22' },
    { name: 'BSCS-7B', semester: 7, prog: 'BSCS', batch: 'FA22' },
    { name: 'BSCS-5A', semester: 5, prog: 'BSCS', batch: 'FA23' },
    { name: 'BSCS-5B', semester: 5, prog: 'BSCS', batch: 'FA23' },
    { name: 'BSCS-3A', semester: 3, prog: 'BSCS', batch: 'FA24' },
    { name: 'BSCS-3B', semester: 3, prog: 'BSCS', batch: 'FA24' },
    // BSSE
    { name: 'BSSE-7A', semester: 7, prog: 'BSSE', batch: 'FA22' },
    { name: 'BSSE-5A', semester: 5, prog: 'BSSE', batch: 'FA23' },
    { name: 'BSSE-3A', semester: 3, prog: 'BSSE', batch: 'FA24' },
    // BSIT
    { name: 'BSIT-5A', semester: 5, prog: 'BSIT', batch: 'FA23' },
    { name: 'BSIT-3A', semester: 3, prog: 'BSIT', batch: 'FA24' },
    // BBA
    { name: 'BBA-5A', semester: 5, prog: 'BBA', batch: 'FA23' },
    { name: 'BBA-3A', semester: 3, prog: 'BBA', batch: 'FA24' },
  ];

  const sectionsList: any[] = [];
  for (const sec of sectionDefs) {
    const created = await prisma.section.create({
      data: {
        name: sec.name,
        semester: sec.semester,
        shift: Shift.MORNING,
        maxCapacity: 50,
        programId: progMap.get(sec.prog)!,
        batchId: batchMap.get(sec.batch)!,
      },
    });
    sectionsList.push(created);
  }

  // 7. Seed Courses
  console.log('\n📚 Creating Academic Courses...');
  const courseDefs = [
    { code: 'CS-101', title: 'Programming Fundamentals', creditHours: 4, isLab: true, deptCode: 'CS' },
    { code: 'CS-201', title: 'Object Oriented Programming', creditHours: 4, isLab: true, deptCode: 'CS' },
    { code: 'CS-301', title: 'Data Structures & Algorithms', creditHours: 4, isLab: true, deptCode: 'CS' },
    { code: 'CS-305', title: 'Database Systems', creditHours: 4, isLab: true, deptCode: 'CS' },
    { code: 'CS-401', title: 'Operating Systems', creditHours: 4, isLab: true, deptCode: 'CS' },
    { code: 'CS-408', title: 'Computer Networks', creditHours: 4, isLab: true, deptCode: 'CS' },
    { code: 'CS-450', title: 'Artificial Intelligence & Neural Nets', creditHours: 3, isLab: false, deptCode: 'CS' },
    { code: 'CS-460', title: 'Cloud Computing & Distributed Architecture', creditHours: 3, isLab: false, deptCode: 'CS' },
    { code: 'SE-201', title: 'Software Engineering Concepts', creditHours: 3, isLab: false, deptCode: 'SE' },
    { code: 'SE-302', title: 'Software Architecture & Design Patterns', creditHours: 3, isLab: false, deptCode: 'SE' },
    { code: 'SE-404', title: 'Software Quality Assurance & Testing', creditHours: 3, isLab: false, deptCode: 'SE' },
    { code: 'SE-420', title: 'Mobile Application Development (React Native)', creditHours: 4, isLab: true, deptCode: 'SE' },
    { code: 'IT-301', title: 'Network Administration & Security', creditHours: 4, isLab: true, deptCode: 'IT' },
    { code: 'IT-305', title: 'Web Systems and Technologies', creditHours: 4, isLab: true, deptCode: 'IT' },
    { code: 'MTH-101', title: 'Calculus and Analytical Geometry', creditHours: 3, isLab: false, deptCode: 'MATH' },
    { code: 'MTH-201', title: 'Linear Algebra and Differential Equations', creditHours: 3, isLab: false, deptCode: 'MATH' },
    { code: 'ENG-101', title: 'Functional English & Technical Writing', creditHours: 3, isLab: false, deptCode: 'ENG' },
    { code: 'MGT-101', title: 'Principles of Management', creditHours: 3, isLab: false, deptCode: 'MGMT' },
    { code: 'MGT-205', title: 'Financial Accounting & Costing', creditHours: 3, isLab: false, deptCode: 'MGMT' },
  ];

  const coursesList: any[] = [];
  for (const c of courseDefs) {
    const created = await prisma.course.create({
      data: {
        code: c.code,
        title: c.title,
        creditHours: c.creditHours,
        isLab: c.isLab,
        departmentId: deptMap.get(c.deptCode)!,
      },
    });
    coursesList.push(created);
  }

  // 8. Seed 32+ Rooms & Venues (Lecture halls, Computer Labs, Seminar Rooms, Auditorium)
  console.log('\n🏢 Creating 32+ Lecture Halls, Computer Labs & Venues...');
  const roomDefs = [
    // Lecture Halls (Quaid Block)
    { roomNumber: 'LH-101', building: 'Quaid-e-Azam Block', floor: 1, capacity: 60, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'LH-102', building: 'Quaid-e-Azam Block', floor: 1, capacity: 60, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'LH-103', building: 'Quaid-e-Azam Block', floor: 1, capacity: 60, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'LH-201', building: 'Quaid-e-Azam Block', floor: 2, capacity: 55, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'LH-202', building: 'Quaid-e-Azam Block', floor: 2, capacity: 55, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'LH-203', building: 'Quaid-e-Azam Block', floor: 2, capacity: 55, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'LH-301', building: 'Quaid-e-Azam Block', floor: 3, capacity: 70, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'LH-302', building: 'Quaid-e-Azam Block', floor: 3, capacity: 70, roomType: RoomType.LECTURE_HALL },
    // Lecture Halls (Sir Syed Block)
    { roomNumber: 'SS-101', building: 'Sir Syed Block', floor: 1, capacity: 50, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'SS-102', building: 'Sir Syed Block', floor: 1, capacity: 50, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'SS-201', building: 'Sir Syed Block', floor: 2, capacity: 50, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'SS-202', building: 'Sir Syed Block', floor: 2, capacity: 50, roomType: RoomType.LECTURE_HALL },
    { roomNumber: 'SS-301', building: 'Sir Syed Block', floor: 3, capacity: 50, roomType: RoomType.LECTURE_HALL },
    // Computer Labs (CS Block)
    { roomNumber: 'CS-LAB-1', building: 'Academic Block B', floor: 1, capacity: 45, roomType: RoomType.COMPUTER_LAB },
    { roomNumber: 'CS-LAB-2', building: 'Academic Block B', floor: 1, capacity: 45, roomType: RoomType.COMPUTER_LAB },
    { roomNumber: 'CS-LAB-3', building: 'Academic Block B', floor: 2, capacity: 40, roomType: RoomType.COMPUTER_LAB },
    { roomNumber: 'CS-LAB-4', building: 'Academic Block B', floor: 2, capacity: 40, roomType: RoomType.COMPUTER_LAB },
    { roomNumber: 'SE-LAB-1', building: 'Academic Block B', floor: 3, capacity: 45, roomType: RoomType.COMPUTER_LAB },
    { roomNumber: 'SE-LAB-2', building: 'Academic Block B', floor: 3, capacity: 45, roomType: RoomType.COMPUTER_LAB },
    { roomNumber: 'AI-RESEARCH-LAB', building: 'Academic Block B', floor: 3, capacity: 35, roomType: RoomType.COMPUTER_LAB },
    { roomNumber: 'CISCO-NET-LAB', building: 'Academic Block B', floor: 4, capacity: 35, roomType: RoomType.COMPUTER_LAB },
    // Seminar Rooms (Jinnah Block)
    { roomNumber: 'SEM-HALL-A', building: 'Jinnah Block', floor: 1, capacity: 100, roomType: RoomType.SEMINAR_ROOM },
    { roomNumber: 'SEM-HALL-B', building: 'Jinnah Block', floor: 1, capacity: 100, roomType: RoomType.SEMINAR_ROOM },
    { roomNumber: 'SEM-HALL-C', building: 'Jinnah Block', floor: 2, capacity: 80, roomType: RoomType.SEMINAR_ROOM },
    { roomNumber: 'EXEC-SEM-1', building: 'Jinnah Block', floor: 3, capacity: 60, roomType: RoomType.SEMINAR_ROOM },
    // Auditoriums & Conference Rooms
    { roomNumber: 'AUD-MAIN', building: 'Convention Complex', floor: 1, capacity: 600, roomType: RoomType.AUDITORIUM },
    { roomNumber: 'AUD-MINI', building: 'Convention Complex', floor: 2, capacity: 250, roomType: RoomType.AUDITORIUM },
    { roomNumber: 'CONF-BOARD-1', building: 'Admin Complex', floor: 3, capacity: 40, roomType: RoomType.CONFERENCE_ROOM },
    { roomNumber: 'CONF-SYNDICATE', building: 'Admin Complex', floor: 3, capacity: 30, roomType: RoomType.CONFERENCE_ROOM },
    { roomNumber: 'FAC-CONF-CS', building: 'Academic Block B', floor: 2, capacity: 25, roomType: RoomType.CONFERENCE_ROOM },
    { roomNumber: 'FAC-CONF-BBA', building: 'Jinnah Block', floor: 2, capacity: 25, roomType: RoomType.CONFERENCE_ROOM },
    { roomNumber: 'STUDIO-MEDIA', building: 'Sir Syed Block', floor: 4, capacity: 30, roomType: RoomType.CONFERENCE_ROOM },
  ];

  const roomsList: any[] = [];
  for (const r of roomDefs) {
    const room = await prisma.room.create({ data: r });
    roomsList.push(room);
  }

  // 9. Seed Core Executive Leadership
  console.log('\n👑 Creating Executive Leadership Accounts (SuperAdmin, VC, Registrar)...');
  
  // SuperAdmin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@lgu.edu.pk',
      password: passwordHash,
      firstName: 'System',
      lastName: 'SuperAdministrator',
      phone: '+92-300-8400001',
      cnic: '35201-9999999-1',
      roleId: rolesMap.get(RoleType.SUPER_ADMIN)!,
      isActive: true,
    },
  });

  // Vice Chancellor
  const vcUser = await prisma.user.create({
    data: {
      email: 'vc@lgu.edu.pk',
      password: passwordHash,
      firstName: 'Maj Gen (R)',
      lastName: 'Dr. Muhammad Asghar',
      phone: '+92-300-8400002',
      cnic: '35201-8888888-1',
      roleId: rolesMap.get(RoleType.VC)!,
      isActive: true,
    },
  });

  // Registrar
  const registrarUser = await prisma.user.create({
    data: {
      email: 'registrar@lgu.edu.pk',
      password: passwordHash,
      firstName: 'Brig (R)',
      lastName: 'Shahid Mahmood',
      phone: '+92-300-8400003',
      cnic: '35201-7777777-1',
      roleId: rolesMap.get(RoleType.REGISTRAR)!,
      departmentId: deptMap.get('REG'),
      isActive: true,
    },
  });

  // 10. Seed 55+ Faculty Members with Profiles
  console.log('\n👨‍🏫 Creating 55+ Faculty Members across Academic Departments...');
  const facultyMembersList: any[] = [];

  const academicDeptCodes = ['CS', 'SE', 'IT', 'MATH', 'MGMT', 'ENG'];
  const designations = [
    'Professor', 'Professor',
    'Associate Professor', 'Associate Professor', 'Associate Professor',
    'Assistant Professor', 'Assistant Professor', 'Assistant Professor', 'Assistant Professor',
    'Senior Lecturer', 'Lecturer', 'Lecturer'
  ];
  const qualifications = [
    'Ph.D. in Computer Science (FAST-NUCES)',
    'Ph.D. in Artificial Intelligence (LUMS)',
    'Ph.D. in Software Engineering (Tsinghua University)',
    'Ph.D. in Applied Mathematics (Punjab University)',
    'Ph.D. in Marketing & Finance (IBA Karachi)',
    'Ph.D. in English Linguistics (Kinnaird)',
    'MS Computer Science (NUST)',
    'MS Software Engineering (GIKI)',
    'M.Phil Mathematics (GCU Lahore)',
  ];

  let facultyCounter = 1;
  for (const deptCode of academicDeptCodes) {
    // 9 to 10 faculty members per department -> ~55-60 faculty members
    const count = deptCode === 'CS' || deptCode === 'SE' ? 11 : 9;
    for (let i = 0; i < count; i++) {
      const isMale = Math.random() > 0.3;
      const firstName = isMale ? sample(FIRST_NAMES_MALE) : sample(FIRST_NAMES_FEMALE);
      const lastName = sample(LAST_NAMES);
      const empId = `FAC-${deptCode}-${pad(facultyCounter, 3)}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${facultyCounter}@lgu.edu.pk`;
      const isHod = i === 0; // First faculty member of dept is designated as HoD

      const user = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName: isHod ? `Dr. (HoD) ${firstName}` : (i < 4 ? `Dr. ${firstName}` : firstName),
          lastName,
          phone: `+92-30${randomInt(0, 4)}-${randomInt(1000000, 9999999)}`,
          cnic: `3520${randomInt(1, 2)}-${randomInt(1000000, 9999999)}-${randomInt(1, 9)}`,
          roleId: isHod ? rolesMap.get(RoleType.HOD)! : rolesMap.get(RoleType.FACULTY)!,
          departmentId: deptMap.get(deptCode)!,
          isActive: true,
          facultyProfile: {
            create: {
              employeeId: empId,
              designation: isHod ? 'Professor & Head of Department' : sample(designations),
              qualification: sample(qualifications),
              specialization: `Advanced Research in ${deptCode} Domain & System Optimization`,
              officeRoom: `${deptCode} Block, Room ${randomInt(101, 310)}`,
              officeHours: 'Mon-Thu: 11:00 AM - 01:00 PM',
              joiningDate: new Date(2018 + randomInt(0, 5), randomInt(0, 11), randomInt(1, 28)),
            },
          },
        },
      });

      if (isHod) {
        await prisma.department.update({
          where: { id: deptMap.get(deptCode)! },
          data: { hodId: user.id },
        });
      }

      facultyMembersList.push(user);
      facultyCounter++;
    }
  }
  console.log(`✅ Seeded ${facultyMembersList.length} faculty members with HoD designations.`);

  // 11. Seed 20+ Department Staff / Admins (Accounts, Transport, Security, Library, Cafeteria)
  console.log('\n🛠️  Creating 20+ Operational Staff Members...');
  const staffConfigs = [
    // Accounts (4 staff)
    { role: RoleType.ACCOUNTS, dept: 'ACC', title: 'Senior Accounts Officer', shift: Shift.GENERAL, count: 4 },
    // Transport (4 staff)
    { role: RoleType.TRANSPORT, dept: 'TRANS', title: 'Fleet Transport Supervisor', shift: Shift.MORNING, count: 4 },
    // Security (5 staff)
    { role: RoleType.SECURITY, dept: 'SEC', title: 'Security Command Officer', shift: Shift.GENERAL, count: 5 },
    // Library (4 staff)
    { role: RoleType.LIBRARY, dept: 'LIB', title: 'Central Librarian & Cataloger', shift: Shift.GENERAL, count: 4 },
    // Cafeteria (4 staff)
    { role: RoleType.CAFETERIA, dept: 'CAFE', title: 'Cafeteria Manager & POS Operator', shift: Shift.MORNING, count: 4 },
  ];

  let staffCounter = 1;
  const staffUsersList: any[] = [];
  for (const group of staffConfigs) {
    for (let i = 0; i < group.count; i++) {
      const isMale = Math.random() > 0.2;
      const firstName = isMale ? sample(FIRST_NAMES_MALE) : sample(FIRST_NAMES_FEMALE);
      const lastName = sample(LAST_NAMES);
      const empId = `STF-${group.dept}-${pad(staffCounter, 3)}`;
      const email = `staff.${group.dept.toLowerCase()}${i + 1}@lgu.edu.pk`;

      const staffUser = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName,
          lastName,
          phone: `+92-31${randomInt(0, 4)}-${randomInt(1000000, 9999999)}`,
          cnic: `3520${randomInt(3, 4)}-${randomInt(1000000, 9999999)}-${randomInt(1, 9)}`,
          roleId: rolesMap.get(group.role)!,
          departmentId: deptMap.get(group.dept)!,
          isActive: true,
          staffProfile: {
            create: {
              employeeId: empId,
              designation: group.title,
              shift: group.shift,
              deskLocation: `${group.dept} Operations Wing, Counter ${i + 1}`,
            },
          },
        },
      });
      staffUsersList.push(staffUser);
      staffCounter++;
    }
  }
  console.log(`✅ Seeded ${staffUsersList.length} operational staff members.`);

  // 12. Seed 520+ Students with Profiles, Sections, and Roll Numbers
  console.log('\n🎓 Creating 520+ Student Records across Semesters and Sections...');
  const studentUsersList: any[] = [];

  // Distribution per section: 13 sections * 40 students each = 520 students
  let studentCounter = 1;
  for (const section of sectionsList) {
    const studentsPerSec = 40;
    for (let s = 1; s <= studentsPerSec; s++) {
      const isMale = Math.random() > 0.45;
      const firstName = isMale ? sample(FIRST_NAMES_MALE) : sample(FIRST_NAMES_FEMALE);
      const lastName = sample(LAST_NAMES);

      // Roll format: e.g. FA23-BCS-042
      const batchCode = section.name.includes('7') ? 'FA22' : section.name.includes('5') ? 'FA23' : 'FA24';
      const progCode = section.name.split('-')[0];
      const rollNumber = `${batchCode}-${progCode}-${pad(s, 3)}`;
      const regNumber = `LGU-${batchCode.substring(2, 4)}-${progCode}-${pad(studentCounter, 4)}`;
      const email = `${rollNumber.toLowerCase()}@lgu.edu.pk`;

      const cgpa = Number((2.5 + Math.random() * 1.48).toFixed(2)); // realistic CGPA 2.50 - 3.98

      const student = await prisma.user.create({
        data: {
          email,
          password: passwordHash,
          firstName,
          lastName,
          phone: `+92-32${randomInt(1, 4)}-${randomInt(1000000, 9999999)}`,
          cnic: `3520${randomInt(1, 5)}-${randomInt(1000000, 9999999)}-${randomInt(1, 9)}`,
          roleId: rolesMap.get(RoleType.STUDENT)!,
          departmentId: deptMap.get(progCode.replace('BS', '').replace('B', 'MGMT')) || deptMap.get('CS')!,
          isActive: true,
          studentProfile: {
            create: {
              rollNumber,
              registrationNumber: regNumber,
              currentSemester: section.semester,
              cgpa,
              guardianName: `${sample(FIRST_NAMES_MALE)} ${lastName}`,
              guardianPhone: `+92-300-${randomInt(1000000, 9999999)}`,
              guardianRelation: 'Father',
              bloodGroup: sample(['A+', 'B+', 'O+', 'AB+', 'O-', 'A-']),
              homeAddress: `House #${randomInt(1, 250)}, Sector ${sample(['A', 'B', 'C', 'D', 'E', 'J', 'X'])}, DHA Phase ${randomInt(1, 6)}, Lahore`,
              programId: section.programId,
              sectionId: section.id,
            },
          },
        },
      });

      studentUsersList.push(student);
      studentCounter++;
    }
  }
  console.log(`✅ Seeded ${studentUsersList.length} student records with complete academic profiles.`);

  // 13. Populate Timetables Matrix without Clashes
  console.log('\n🗓️  Generating Timetable Matrix (Section, Room & Teacher schedules)...');
  const days: DayOfWeek[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
  ];

  const timeSlots = [
    { start: '08:30', end: '10:00' },
    { start: '10:15', end: '11:45' },
    { start: '12:00', end: '13:30' },
    { start: '14:00', end: '15:30' },
    { start: '15:45', end: '17:15' },
  ];

  // Map to track bookings and prevent clashes:
  // key: `${day}-${slot.start}` -> Set of used roomIds, teacherIds, sectionIds
  const roomBookings = new Set<string>();
  const teacherBookings = new Set<string>();
  const sectionBookings = new Set<string>();

  let timetableSlotsCreated = 0;

  for (const day of days) {
    for (const slot of timeSlots) {
      // Pick up to 8 parallel classes across different sections
      for (const section of sectionsList) {
        const sectionKey = `${day}-${slot.start}-${section.id}`;
        if (sectionBookings.has(sectionKey)) continue;

        // Find available room
        const availableRoom = roomsList.find((r) => {
          const roomKey = `${day}-${slot.start}-${r.id}`;
          return !roomBookings.has(roomKey);
        });

        // Find available teacher
        const availableTeacher = facultyMembersList.find((t) => {
          const teacherKey = `${day}-${slot.start}-${t.id}`;
          return !teacherBookings.has(teacherKey);
        });

        if (availableRoom && availableTeacher) {
          // Select course matching section's program
          const progCode = section.name.split('-')[0];
          const matchedCourse = coursesList.find((c) => c.code.includes(progCode.replace('BS', ''))) || coursesList[0];

          // 50% probability to schedule a lecture in this available slot so schedules look realistic
          if (Math.random() > 0.45) {
            await prisma.timetableSlot.create({
              data: {
                dayOfWeek: day,
                startTime: slot.start,
                endTime: slot.end,
                semester: section.semester,
                academicYear: '2026-2027',
                sectionId: section.id,
                courseId: matchedCourse.id,
                teacherId: availableTeacher.id,
                roomId: availableRoom.id,
              },
            });

            roomBookings.add(`${day}-${slot.start}-${availableRoom.id}`);
            teacherBookings.add(`${day}-${slot.start}-${availableTeacher.id}`);
            sectionBookings.add(sectionKey);
            timetableSlotsCreated++;
          }
        }
      }
    }
  }
  console.log(`✅ Successfully generated ${timetableSlotsCreated} conflict-free timetable slots.`);

  // 14. Seed Central Library Books and Borrow Records
  console.log('\n📖 Seeding Central Library Books & Borrow Records...');
  const booksCatalog = [
    { isbn: '978-0131103627', title: 'The C Programming Language (2nd Edition)', author: 'Brian W. Kernighan, Dennis M. Ritchie', category: 'Computer Science', rack: 'Rack A-1' },
    { isbn: '978-0262033848', title: 'Introduction to Algorithms (CLRS 3rd Ed)', author: 'Thomas H. Cormen, Charles E. Leiserson', category: 'Computer Science', rack: 'Rack A-3' },
    { isbn: '978-0132350884', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin (Uncle Bob)', category: 'Software Engineering', rack: 'Rack B-1' },
    { isbn: '978-0201633610', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma, Richard Helm', category: 'Software Engineering', rack: 'Rack B-2' },
    { isbn: '978-0133594140', title: 'Operating System Concepts (10th Edition)', author: 'Abraham Silberschatz, Peter B. Galvin', category: 'Computer Science', rack: 'Rack A-4' },
    { isbn: '978-0134444321', title: 'Computer Networks: A Systems Approach', author: 'Larry L. Peterson, Bruce S. Davie', category: 'Networking', rack: 'Rack C-1' },
    { isbn: '978-0073523323', title: 'Database System Concepts (7th Edition)', author: 'Avi Silberschatz, Henry F. Korth', category: 'Databases', rack: 'Rack C-3' },
    { isbn: '978-0262035613', title: 'Deep Learning (Adaptive Computation and Machine Learning)', author: 'Ian Goodfellow, Yoshua Bengio', category: 'Artificial Intelligence', rack: 'Rack D-1' },
    { isbn: '978-0134685991', title: 'Artificial Intelligence: A Modern Approach (4th Ed)', author: 'Stuart Russell, Peter Norvig', category: 'Artificial Intelligence', rack: 'Rack D-2' },
    { isbn: '978-0596517748', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category: 'Web Development', rack: 'Rack E-1' },
    { isbn: '978-1491950296', title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'Distributed Systems', rack: 'Rack E-3' },
    { isbn: '978-0134494166', title: 'Calculus: Early Transcendentals', author: 'James Stewart', category: 'Mathematics', rack: 'Rack M-1' },
    { isbn: '978-0134857473', title: 'Linear Algebra and Its Applications', author: 'David C. Lay, Steven R. Lay', category: 'Mathematics', rack: 'Rack M-2' },
    { isbn: '978-0134523859', title: 'Principles of Marketing (17th Edition)', author: 'Philip Kotler, Gary Armstrong', category: 'Management Sciences', rack: 'Rack BBA-1' },
    { isbn: '978-0078025631', title: 'Corporate Finance (11th Edition)', author: 'Stephen Ross, Randolph Westerfield', category: 'Finance', rack: 'Rack BBA-2' },
  ];

  const libraryBooksList: any[] = [];
  for (const b of booksCatalog) {
    const book = await prisma.libraryBook.create({
      data: {
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        category: b.category,
        rackLocation: b.rack,
        totalCopies: 8,
        availableCopies: 6,
        publicationYear: randomInt(2018, 2024),
        publisher: 'Pearson & O’Reilly Academic',
      },
    });
    libraryBooksList.push(book);
  }

  // Sample borrow records
  for (let i = 0; i < 40; i++) {
    const studentUser = studentUsersList[i];
    const book = sample(libraryBooksList);
    const issueDate = new Date(Date.now() - randomInt(5, 30) * 86400000);
    const dueDate = new Date(issueDate.getTime() + 14 * 86400000);
    const isReturned = Math.random() > 0.5;

    await prisma.borrowRecord.create({
      data: {
        bookId: book.id,
        userId: studentUser.id,
        issueDate,
        dueDate,
        returnDate: isReturned ? new Date(dueDate.getTime() - randomInt(1, 3) * 86400000) : null,
        status: isReturned ? BorrowStatus.RETURNED : (dueDate < new Date() ? BorrowStatus.OVERDUE : BorrowStatus.ISSUED),
        fineAmount: !isReturned && dueDate < new Date() ? 250.00 : 0.00,
      },
    });
  }
  console.log(`✅ Seeded ${libraryBooksList.length} books catalog & 40 student borrow records.`);

  // 15. Seed Campus Transport Buses, Routes & Subscriptions
  console.log('\n🚌 Seeding Transport Fleet, Routes & Bus Passes...');
  const busRoutesData = [
    {
      routeCode: 'R-01',
      routeName: 'Thokar Niaz Baig - Canal Road - LGU Main Campus',
      morning: '06:45 AM',
      evening: '04:15 PM',
      stops: [
        { stopName: 'Thokar Niaz Baig Flyover', time: '06:45 AM', lat: 31.4679, lng: 74.2415 },
        { stopName: 'Campus Bridge / PU Canal', time: '07:05 AM', lat: 31.5034, lng: 74.2989 },
        { stopName: 'Muslim Town Mor', time: '07:15 AM', lat: 31.5152, lng: 74.3218 },
        { stopName: 'Dharampura Underpass', time: '07:30 AM', lat: 31.5492, lng: 74.3721 },
        { stopName: 'LGU Gate 1 Entrance', time: '07:50 AM', lat: 31.5714, lng: 74.4021 },
      ],
      busNo: 'LGU-BUS-01',
      plate: 'LEA-2023-8801',
      driver: 'Muhammad Aslam',
      phone: '+92-301-4455661',
    },
    {
      routeCode: 'R-02',
      routeName: 'Shahdara - Ravi Road - Railway Station - LGU',
      morning: '06:30 AM',
      evening: '04:15 PM',
      stops: [
        { stopName: 'Shahdara Mor Chowk', time: '06:30 AM', lat: 31.6215, lng: 74.2831 },
        { stopName: 'Azadi Chowk Metro Station', time: '06:50 AM', lat: 31.5925, lng: 74.3089 },
        { stopName: 'Lahore Railway Station', time: '07:10 AM', lat: 31.5786, lng: 74.3412 },
        { stopName: 'Allama Iqbal Town Mor', time: '07:25 AM', lat: 31.5654, lng: 74.3689 },
        { stopName: 'LGU Gate 1 Entrance', time: '07:50 AM', lat: 31.5714, lng: 74.4021 },
      ],
      busNo: 'LGU-BUS-02',
      plate: 'LEA-2023-8802',
      driver: 'Karamat Ali',
      phone: '+92-302-5566772',
    },
    {
      routeCode: 'R-03',
      routeName: 'DHA Phase 5 - Bedian Road - Askari 10 - LGU',
      morning: '07:00 AM',
      evening: '04:15 PM',
      stops: [
        { stopName: 'DHA Phase 5 Commercial Center', time: '07:00 AM', lat: 31.4589, lng: 74.4095 },
        { stopName: 'Bedian Road Rangers Post', time: '07:15 AM', lat: 31.4891, lng: 74.4210 },
        { stopName: 'Askari 10 Main Gate', time: '07:30 AM', lat: 31.5305, lng: 74.4124 },
        { stopName: 'LGU Gate 2 Terminal', time: '07:45 AM', lat: 31.5714, lng: 74.4021 },
      ],
      busNo: 'LGU-BUS-03',
      plate: 'LEA-2024-8803',
      driver: 'Ghulam Rasool',
      phone: '+92-303-6677883',
    },
    {
      routeCode: 'R-04',
      routeName: 'Johar Town - Wapda Town - Model Town Link Road - LGU',
      morning: '06:40 AM',
      evening: '04:15 PM',
      stops: [
        { stopName: 'Johar Town G1 Market', time: '06:40 AM', lat: 31.4697, lng: 74.2728 },
        { stopName: 'Wapda Town Roundabout', time: '06:55 AM', lat: 31.4398, lng: 74.2699 },
        { stopName: 'Model Town Link Road Metro', time: '07:15 AM', lat: 31.4821, lng: 74.3204 },
        { stopName: 'Walton Road Cantt', time: '07:30 AM', lat: 31.4985, lng: 74.3642 },
        { stopName: 'LGU Gate 1 Entrance', time: '07:50 AM', lat: 31.5714, lng: 74.4021 },
      ],
      busNo: 'LGU-BUS-04',
      plate: 'LEA-2024-8804',
      driver: 'Abdul Sattar',
      phone: '+92-304-7788994',
    },
  ];

  const createdRoutes: any[] = [];
  for (const bData of busRoutesData) {
    const bus = await prisma.bus.create({
      data: {
        busNumber: bData.busNo,
        registrationPlate: bData.plate,
        driverName: bData.driver,
        driverPhone: bData.phone,
        capacity: 52,
        status: BusStatus.ACTIVE,
      },
    });

    const route = await prisma.busRoute.create({
      data: {
        routeCode: bData.routeCode,
        routeName: bData.routeName,
        morningDeparture: bData.morning,
        eveningDeparture: bData.evening,
        stops: bData.stops,
        busId: bus.id,
      },
    });
    createdRoutes.push(route);
  }

  // Subscriptions for 50 students
  for (let i = 0; i < 50; i++) {
    const student = studentUsersList[i];
    const route = sample(createdRoutes);
    await prisma.busSubscription.create({
      data: {
        userId: student.id,
        routeId: route.id,
        semester: 5,
        academicYear: '2026-2027',
        passCardNumber: `LGU-BUSPASS-2026-${pad(i + 1, 4)}`,
        feeStatus: 'PAID',
        expiresAt: new Date('2027-06-30'),
      },
    });
  }
  console.log(`✅ Seeded 4 transport routes, buses & 50 active bus passes.`);

  // 16. Seed Student Fee Challans (Accounts Module)
  console.log('\n💳 Seeding Student Fee Challans & Accounts Records...');
  const feeStatuses = [ChallanStatus.PAID, ChallanStatus.PAID, ChallanStatus.UNPAID, ChallanStatus.OVERDUE];
  const paymentMethods = [PaymentMethod.HBL_ONLINE, PaymentMethod.JAZZCASH, PaymentMethod.NAYAPAY, PaymentMethod.BANK_TRANSFER];

  for (let i = 0; i < studentUsersList.length; i++) {
    const student = studentUsersList[i];
    const status = sample(feeStatuses);
    const tuition = 85000;
    const labFee = 8500;
    const examFee = 5000;
    const libraryFee = 2000;
    const totalAmount = tuition + labFee + examFee + libraryFee;
    const isPaid = status === ChallanStatus.PAID;

    await prisma.feeChallan.create({
      data: {
        challanNumber: `LGU-CH-2026-${pad(i + 1001, 5)}`,
        studentId: student.id,
        semester: 5,
        academicYear: '2026-2027',
        issueDate: new Date('2026-09-01'),
        dueDate: new Date('2026-10-15'),
        totalAmount,
        paidAmount: isPaid ? totalAmount : 0.00,
        status,
        paymentMethod: isPaid ? sample(paymentMethods) : null,
        bankReference: isPaid ? `HBL-TXN-${randomInt(10000000, 99999999)}` : null,
        paidAt: isPaid ? new Date('2026-09-25') : null,
        breakdownJson: {
          tuitionFee: tuition,
          labCharges: labFee,
          examinationFee: examFee,
          libraryFund: libraryFee,
          campusDevFund: 3000,
        },
      },
    });
  }
  console.log(`✅ Seeded ${studentUsersList.length} fee challans (Paid, Unpaid, and Overdue).`);

  // 17. Seed Campus Cafeteria Menu & Sample Orders
  console.log('\n🍔 Seeding Cafeteria Menu & Student Orders...');
  const cafeteriaMenu = [
    { name: 'Garrison Grilled Zinger Burger', price: 420.00, category: 'Fast Food', prepTime: 12 },
    { name: 'Club Sandwich with French Fries', price: 380.00, category: 'Fast Food', prepTime: 10 },
    { name: 'Chicken Patty Burger', price: 250.00, category: 'Fast Food', prepTime: 8 },
    { name: 'Chicken Biryani Plate (Special)', price: 320.00, category: 'Meals', prepTime: 5 },
    { name: 'Chicken Daal Chawal Combo', price: 220.00, category: 'Meals', prepTime: 5 },
    { name: 'Chicken Shawarma Wrap', price: 200.00, category: 'Fast Food', prepTime: 7 },
    { name: 'Crispy Samosa Platter (2 Pcs)', price: 100.00, category: 'Snacks', prepTime: 3 },
    { name: 'Vegetable Spring Rolls', price: 120.00, category: 'Snacks', prepTime: 5 },
    { name: 'Doodh Patti Karak Chai', price: 80.00, category: 'Beverages', prepTime: 5 },
    { name: 'Cardamom Green Tea (Kahwa)', price: 60.00, category: 'Beverages', prepTime: 4 },
    { name: 'Cold Coffee Frappe with Ice Cream', price: 280.00, category: 'Beverages', prepTime: 8 },
    { name: 'Fresh Mint Margarita', price: 180.00, category: 'Beverages', prepTime: 5 },
    { name: 'Mineral Water (500ml)', price: 50.00, category: 'Beverages', prepTime: 1 },
    { name: 'Chocolate Fudge Brownie Slice', price: 190.00, category: 'Desserts', prepTime: 2 },
  ];

  const cafeteriaItemsList: any[] = [];
  for (const item of cafeteriaMenu) {
    const createdItem = await prisma.cafeteriaItem.create({
      data: {
        name: item.name,
        price: item.price,
        category: item.category,
        preparationTimeMinutes: item.prepTime,
        isAvailable: true,
        description: `Freshly prepared at LGU Central Cafeteria with hygienic food standards.`,
      },
    });
    cafeteriaItemsList.push(createdItem);
  }

  // Create 30 sample orders
  for (let i = 0; i < 30; i++) {
    const buyer = studentUsersList[i];
    const item1 = sample(cafeteriaItemsList);
    const item2 = sample(cafeteriaItemsList);
    const totalAmount = Number(item1.price) + Number(item2.price);

    const order = await prisma.cafeteriaOrder.create({
      data: {
        orderNumber: `LGU-CAF-${pad(i + 1, 4)}`,
        userId: buyer.id,
        totalAmount,
        status: sample([OrderStatus.PLACED, OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP, OrderStatus.COMPLETED]),
        paymentMethod: PaymentMethod.CASH_COUNTER,
        paymentStatus: OrderPaymentStatus.PAID,
        pickupCode: `OTP-${randomInt(100, 999)}`,
      },
    });

    await prisma.cafeteriaOrderItem.createMany({
      data: [
        { orderId: order.id, itemId: item1.id, quantity: 1, unitPrice: item1.price, subtotal: item1.price },
        { orderId: order.id, itemId: item2.id, quantity: 1, unitPrice: item2.price, subtotal: item2.price },
      ],
    });
  }
  console.log(`✅ Seeded ${cafeteriaItemsList.length} menu items & 30 cafeteria orders.`);

  // 18. Seed Campus Notices & Announcements
  console.log('\n📢 Seeding Campus Circulars & Digital Notices...');
  const noticesData = [
    {
      title: 'Fall 2026 Mid-Term Examination Schedule Announced',
      summary: 'The Controller of Examinations has published the date sheet for all Undergraduate & Graduate programs.',
      content: 'All faculty members and enrolled students are notified that Mid-Term Examinations for Fall 2026 will commence from Monday, 17th November 2026. Detailed section-wise timetables and assigned exam halls are available on the portal. No student without an official digital admit card will be permitted into examination halls.',
      category: NoticeCategory.EXAMINATION,
      priority: NoticePriority.HIGH,
      targetAudience: TargetAudience.ALL,
      isPinned: true,
    },
    {
      title: 'LGU Annual Mega Hackathon & Tech Olympiad 2026',
      summary: 'Department of Computer Science invites teams across Pakistan for a 48-hour competitive coding hackathon.',
      content: 'Registration is now open for the 7th Edition of LGU TechFest 2026. Tracks include Generative AI & Agents, Cyber Defense, Mobile Innovation, and Distributed Systems. Exciting cash prizes worth PKR 1,500,000 to be won. Last date for registration is 10th November 2026.',
      category: NoticeCategory.EVENTS,
      priority: NoticePriority.MEDIUM,
      targetAudience: TargetAudience.STUDENTS,
      isPinned: true,
    },
    {
      title: 'Transport Notice: Updated Morning Route Departure Timings',
      summary: 'Adjustment of 15 minutes in Route R-01 and R-02 due to Canal Road Underpass construction work.',
      content: 'Students commuting via Route R-01 (Thokar Niaz Baig) and R-02 (Shahdara) are advised that morning departures will commence 15 minutes earlier starting next Monday to ensure timely arrival at campus by 07:50 AM. Please cooperate with the fleet captains.',
      category: NoticeCategory.TRANSPORT,
      priority: NoticePriority.HIGH,
      targetAudience: TargetAudience.ALL,
      isPinned: false,
    },
    {
      title: 'Faculty Research Grant Applications (Phase-II)',
      summary: 'Office of Research, Innovation and Commercialization (ORIC) invites proposals for internal seed funding.',
      content: 'Full-time faculty members holding Ph.D. or MS qualifications are eligible to apply for research funding up to PKR 800,000 for industry-collaborative prototypes and Scopus-indexed research. Proposal submission deadline is 30th November 2026.',
      category: NoticeCategory.ACADEMIC,
      priority: NoticePriority.NORMAL ? NoticePriority.MEDIUM : NoticePriority.LOW,
      targetAudience: TargetAudience.FACULTY,
      isPinned: false,
    },
    {
      title: 'Last Date for Semester Fee Challan Submission Without Late Surcharge',
      summary: 'Accounts division notification regarding payment deadlines for Fall 2026 semester dues.',
      content: 'Students are advised to clear their pending semester dues through HBL Internet Banking, 1Bill, JazzCash, or campus cash counters by 15th October 2026 to avoid a late fee surcharge of PKR 2,000.',
      category: NoticeCategory.SCHOLARSHIPS,
      priority: NoticePriority.HIGH,
      targetAudience: TargetAudience.STUDENTS,
      isPinned: false,
    },
  ];

  for (const n of noticesData) {
    await prisma.notice.create({
      data: {
        title: n.title,
        summary: n.summary,
        content: n.content,
        category: n.category,
        priority: n.priority,
        targetAudience: n.targetAudience,
        isPinned: n.isPinned,
        authorId: registrarUser.id,
      },
    });
  }
  console.log(`✅ Seeded ${noticesData.length} campus announcements & notices.`);

  // 19. Seed Security RFID Smart Gate Passes
  console.log('\n🛡️  Seeding Security RFID Gate Passes...');
  for (let i = 0; i < 50; i++) {
    const user = i < 40 ? studentUsersList[i] : facultyMembersList[i - 40];
    await prisma.gatePass.create({
      data: {
        userId: user.id,
        passType: i < 40 ? GatePassType.STUDENT_CARD : GatePassType.FACULTY_CARD,
        rfidCardTag: `LGU-RFID-${randomInt(100000, 999999)}`,
        vehicleNumber: i % 2 === 0 ? `LEA-202${randomInt(1, 5)}-${randomInt(1000, 9999)}` : null,
        isAllowedEntry: true,
        lastScanTimestamp: new Date(),
      },
    });
  }
  console.log('✅ Seeded 50 RFID Gate Passes.');

  console.log('\n================================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
  console.log(`Summary of Created Entities:`);
  console.log(` • Roles & Permissions : 11 Roles, 12 granular permissions`);
  console.log(` • Departments         : 12 (Academic & Administrative)`);
  console.log(` • Academic Programs   : 5 (BSCS, BSSE, BSIT, BBA, MSCS)`);
  console.log(` • Batches & Sections  : 6 Batches, 13 Active Sections`);
  console.log(` • Courses             : 19 Core University Courses`);
  console.log(` • Venues & Rooms      : ${roomsList.length} Halls, Labs, and Auditoriums`);
  console.log(` • SuperAdmin / VC / Reg: 3 Executive Leadership Accounts`);
  console.log(` • Faculty Members     : ${facultyMembersList.length} Professors/Lecturers with HoDs`);
  console.log(` • Operational Staff   : ${staffUsersList.length} across Accounts, Transport, Security, Library, Cafeteria`);
  console.log(` • Enrolled Students   : ${studentUsersList.length} Students with Full Profiles & Roll Numbers`);
  console.log(` • Timetable Slots     : ${timetableSlotsCreated} Scheduled Class Sessions`);
  console.log(` • Central Library     : ${libraryBooksList.length} Books & 40 Borrow Records`);
  console.log(` • Transport System    : 4 Lahore City Routes & 50 Bus Passes`);
  console.log(` • Fee Challans        : ${studentUsersList.length} Student Challans`);
  console.log(` • Cafeteria Portal    : ${cafeteriaItemsList.length} Menu Items & 30 Orders`);
  console.log(` • Campus Notices      : ${noticesData.length} Circulars`);
  console.log(`\nDefault Password for all seeded accounts: ${defaultPassword}`);
  console.log(`Example Logins:`);
  console.log(` - Super Admin: admin@lgu.edu.pk / ${defaultPassword}`);
  console.log(` - Vice Chancellor: vc@lgu.edu.pk / ${defaultPassword}`);
  console.log(` - Registrar: registrar@lgu.edu.pk / ${defaultPassword}`);
  console.log(` - Student: fa23-bcs-001@lgu.edu.pk / ${defaultPassword}`);
  console.log('================================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
