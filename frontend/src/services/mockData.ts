import { 
  College, 
  Department, 
  Batch, 
  Semester, 
  OfficialStudentRecord, 
  Dormitory, 
  Room, 
  AccommodationApplication, 
  Property, 
  MaintenanceComplaint, 
  User,
  SystemAuditLog
} from '../types';

export const INITIAL_COLLEGES: College[] = [
  {
    id: 'col-1',
    name: 'College of Engineering and Technology',
    amharicName: 'ኢንጂነሪንግና ቴክኖሎጂ ኮሌጅ',
    code: 'ENGTECH',
    description: 'Faculty of Engineering, Computing, and Advanced Technologies',
    isActive: true
  },
  {
    id: 'col-2',
    name: 'College of Natural and Computational Sciences',
    amharicName: 'የተፈጥሮና ኮምፒውቴሽናል ሳይንስ ኮሌጅ',
    code: 'CNCS',
    description: 'Faculty of Pure and Applied Sciences',
    isActive: true
  },
  {
    id: 'col-3',
    name: 'College of Medicine and Health Sciences',
    amharicName: 'የሕክምናና ጤና ሳይንስ ኮሌጅ',
    code: 'CMHS',
    description: 'Comprehensive Health, Clinical Medicine and Nursing School',
    isActive: true
  },
  {
    id: 'col-4',
    name: 'College of Business and Economics',
    amharicName: 'ቢዝነስና ኢኮኖሚክስ ኮሌጅ',
    code: 'CBE',
    description: 'School of Commerce, Management and Financial Studies',
    isActive: true
  },
  {
    id: 'col-5',
    name: 'College of Agricultural Sciences',
    amharicName: 'የግብርና ሳይንስ ኮሌጅ',
    code: 'AGRI',
    description: 'Faculty of Plant Sciences, Animal Production and Rural Economics',
    isActive: true
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  // Engineering
  { id: 'dept-1', collegeId: 'col-1', collegeName: 'College of Engineering and Technology', name: 'Software Engineering', amharicName: 'ሶፍትዌር ኢንጂነሪንግ', code: 'SE', isActive: true },
  { id: 'dept-2', collegeId: 'col-1', collegeName: 'College of Engineering and Technology', name: 'Electrical & Computer Engineering', amharicName: 'ኤሌክትሪካልና ኮምፒውተር ኢንጂነሪንግ', code: 'ECE', isActive: true },
  { id: 'dept-3', collegeId: 'col-1', collegeName: 'College of Engineering and Technology', name: 'Mechanical Engineering', amharicName: 'ሜካኒካል ኢንጂነሪንግ', code: 'ME', isActive: true },
  { id: 'dept-4', collegeId: 'col-1', collegeName: 'College of Engineering and Technology', name: 'Civil Engineering', amharicName: 'ሲቪል ኢንጂነሪንግ', code: 'CE', isActive: true },
  
  // Natural Sciences
  { id: 'dept-5', collegeId: 'col-2', collegeName: 'College of Natural and Computational Sciences', name: 'Computer Science', amharicName: 'ኮምፒውተር ሳይንስ', code: 'CS', isActive: true },
  { id: 'dept-6', collegeId: 'col-2', collegeName: 'College of Natural and Computational Sciences', name: 'Mathematics', amharicName: 'ሒሳብ', code: 'MATH', isActive: true },
  { id: 'dept-7', collegeId: 'col-2', collegeName: 'College of Natural and Computational Sciences', name: 'Statistics', amharicName: 'ስታቲስቲክስ', code: 'STAT', isActive: true },
  
  // Medicine
  { id: 'dept-8', collegeId: 'col-3', collegeName: 'College of Medicine and Health Sciences', name: 'Medicine (MD)', amharicName: 'ሕክምና', code: 'MED', isActive: true },
  { id: 'dept-9', collegeId: 'col-3', collegeName: 'College of Medicine and Health Sciences', name: 'Public Health', amharicName: 'የሕዝብ ጤና', code: 'PH', isActive: true },
  { id: 'dept-10', collegeId: 'col-3', collegeName: 'College of Medicine and Health Sciences', name: 'Nursing', amharicName: 'ነርሲንግ', code: 'NURS', isActive: true },
  
  // Business
  { id: 'dept-11', collegeId: 'col-4', collegeName: 'College of Business and Economics', name: 'Accounting and Finance', amharicName: 'አካውንቲንግና ፋይናንስ', code: 'ACC', isActive: true },
  { id: 'dept-12', collegeId: 'col-4', collegeName: 'College of Business and Economics', name: 'Management', amharicName: 'ማኔጅመንት', code: 'MGMT', isActive: true },
  { id: 'dept-13', collegeId: 'col-4', collegeName: 'College of Business and Economics', name: 'Economics', amharicName: 'ኢኮኖሚክስ', code: 'ECON', isActive: true },

  // Agriculture
  { id: 'dept-14', collegeId: 'col-5', collegeName: 'College of Agricultural Sciences', name: 'Plant Science', amharicName: 'ዕፅዋት ሳይንስ', code: 'PLNT', isActive: true },
  { id: 'dept-15', collegeId: 'col-5', collegeName: 'College of Agricultural Sciences', name: 'Animal Science', amharicName: 'እንስሳት ሳይንስ', code: 'ANML', isActive: true }
];

export const INITIAL_BATCHES: Batch[] = [
  { id: 'batch-2024', name: 'Batch 2024', yearEC: '2016 E.C.', yearGC: '2024', isActive: true },
  { id: 'batch-2023', name: 'Batch 2023', yearEC: '2015 E.C.', yearGC: '2023', isActive: true },
  { id: 'batch-2022', name: 'Batch 2022', yearEC: '2014 E.C.', yearGC: '2022', isActive: true },
  { id: 'batch-2021', name: 'Batch 2021', yearEC: '2013 E.C.', yearGC: '2021', isActive: true }
];

export const INITIAL_SEMESTERS: Semester[] = [
  { id: 'sem-1', name: 'Semester 1', academicYear: '2024/2025 (2017 E.C.)', isActive: true },
  { id: 'sem-2', name: 'Semester 2', academicYear: '2024/2025 (2017 E.C.)', isActive: true }
];

// Official Student Records uploaded/managed by Super Admin
export const INITIAL_OFFICIAL_STUDENTS: OfficialStudentRecord[] = [
  {
    id: 'rec-1',
    studentId: 'WU/2024/001',
    fullName: 'Abebe Kebede Tadesse',
    amharicName: 'አበበ ከበደ ታደሰ',
    collegeName: 'College of Engineering and Technology',
    departmentName: 'Software Engineering',
    batch: 'Batch 2024',
    semester: 'Semester 1',
    gender: 'MALE',
    status: 'VERIFIED',
    isRegistered: true,
    uploadedAt: '2024-10-01',
    notes: 'Official registrar intake roster'
  },
  {
    id: 'rec-2',
    studentId: 'WU/2024/002',
    fullName: 'Tigist Haile Mengistu',
    amharicName: 'ትዕግስት ኃይሌ መንግስቱ',
    collegeName: 'College of Natural and Computational Sciences',
    departmentName: 'Computer Science',
    batch: 'Batch 2024',
    semester: 'Semester 1',
    gender: 'FEMALE',
    status: 'VERIFIED',
    isRegistered: false,
    uploadedAt: '2024-10-01',
    notes: 'Eligible for online registration'
  },
  {
    id: 'rec-3',
    studentId: 'WU/2024/003',
    fullName: 'Daniel Getachew Bekele',
    amharicName: 'ዳንኤል ጌታቸው በቀለ',
    collegeName: 'College of Business and Economics',
    departmentName: 'Accounting and Finance',
    batch: 'Batch 2023',
    semester: 'Semester 2',
    gender: 'MALE',
    status: 'VERIFIED',
    isRegistered: false,
    uploadedAt: '2024-10-01',
    notes: 'Eligible for online registration'
  },
  {
    id: 'rec-4',
    studentId: 'WU/2024/004',
    fullName: 'Meron Alemayehu Zewde',
    amharicName: 'ሜሮን አለማየሁ ዘውዴ',
    collegeName: 'College of Medicine and Health Sciences',
    departmentName: 'Public Health',
    batch: 'Batch 2024',
    semester: 'Semester 1',
    gender: 'FEMALE',
    status: 'VERIFIED',
    isRegistered: false,
    uploadedAt: '2024-10-01',
    notes: 'Eligible for online registration'
  },
  {
    id: 'rec-5',
    studentId: 'WU/2024/005',
    fullName: 'Yonas Berhanu Tefera',
    amharicName: 'ዮናስ ብርሃኑ ተፈራ',
    collegeName: 'College of Engineering and Technology',
    departmentName: 'Electrical & Computer Engineering',
    batch: 'Batch 2022',
    semester: 'Semester 1',
    gender: 'MALE',
    status: 'VERIFIED',
    isRegistered: false,
    uploadedAt: '2024-10-01',
    notes: 'Eligible for online registration'
  },
  {
    id: 'rec-6',
    studentId: 'WU/2024/006',
    fullName: 'Selamawit Desta Kassa',
    amharicName: 'ሰላማዊት ደስታ ካሳ',
    collegeName: 'College of Agricultural Sciences',
    departmentName: 'Plant Science',
    batch: 'Batch 2024',
    semester: 'Semester 1',
    gender: 'FEMALE',
    status: 'VERIFIED',
    isRegistered: false,
    uploadedAt: '2024-10-01',
    notes: 'Eligible for online registration'
  },
  {
    id: 'rec-7',
    studentId: 'WU/2024/007',
    fullName: 'Biruk Wolde Gidey',
    amharicName: 'ብሩክ ወልዴ ጊደይ',
    collegeName: 'College of Engineering and Technology',
    departmentName: 'Civil Engineering',
    batch: 'Batch 2023',
    semester: 'Semester 1',
    gender: 'MALE',
    status: 'FLAGGED',
    isRegistered: false,
    uploadedAt: '2024-10-01',
    notes: 'Pending verification review - name spelling mismatch'
  }
];

// Pre-configured Users for System Access & Role Testing
export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Dr. Habtamu Belay',
    amharicName: 'ዶ/ር ሀብታሙ በላይ',
    email: 'admin@wachemo.edu.et',
    studentId: 'ADMIN-001',
    password: 'password123',
    role: 'SUPER_ADMIN',
    phone: '+251 911 000001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'ACTIVE'
  },
  {
    id: 'user-student',
    name: 'Abebe Kebede Tadesse',
    amharicName: 'አበበ ከበደ ታደሰ',
    email: 'abebe.wu@wachemo.edu.et',
    studentId: 'WU/2024/001',
    password: 'password123',
    role: 'STUDENT',
    collegeId: 'col-1',
    departmentId: 'dept-1',
    departmentName: 'Software Engineering',
    batch: 'Batch 2024',
    semester: 'Semester 1',
    phone: '+251 922 123456',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    status: 'ACTIVE'
  },
  {
    id: 'user-dorm-mgr',
    name: 'Proctor Tariku Mengistu',
    amharicName: 'ፕሮክተር ታሪኩ መንግስቱ',
    email: 'dorm.mgr@wachemo.edu.et',
    studentId: 'STAFF-DORM-01',
    password: 'password123',
    role: 'DORMITORY_MANAGER',
    phone: '+251 912 345678',
    assignedDormId: 'dorm-1',
    assignedDormName: 'Block 45 - Tewodros Hall (Men)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'ACTIVE'
  },
  {
    id: 'user-accom-off',
    name: 'W/ro Genet Assefa',
    amharicName: 'ወ/ሮ ገነት አሰፋ',
    email: 'accommodation@wachemo.edu.et',
    studentId: 'STAFF-ACCOM-01',
    password: 'password123',
    role: 'ACCOMMODATION_OFFICER',
    phone: '+251 913 456789',
    assignedArea: 'Main Placement Directorate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    status: 'ACTIVE'
  },
  {
    id: 'user-prop-mgr',
    name: 'Ato Solomon Tesfaye',
    amharicName: 'አቶ ሰለሞን ተስፋዬ',
    email: 'property@wachemo.edu.et',
    studentId: 'STAFF-PROP-01',
    password: 'password123',
    role: 'PROPERTY_MANAGER',
    phone: '+251 914 567890',
    assignedArea: 'Campus Central Inventory Store',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    status: 'ACTIVE'
  },
  {
    id: 'user-maint-staff',
    name: 'Engineer Dawit Girma',
    amharicName: 'ኢንጂነር ዳዊት ግርማ',
    email: 'maintenance@wachemo.edu.et',
    studentId: 'STAFF-MAINT-01',
    password: 'password123',
    role: 'MAINTENANCE_STAFF',
    phone: '+251 915 678901',
    assignedArea: 'Electrical & Plumbing Section',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    status: 'ACTIVE'
  }
];

// Dormitories
export const INITIAL_DORMITORIES: Dormitory[] = [
  {
    id: 'dorm-1',
    name: 'Block 45 - Tewodros Hall (Men)',
    amharicName: 'ብሎክ 45 - ቴዎድሮስ አዳራሽ (ወንድ)',
    blockNumber: 'Block 45',
    genderType: 'MALE',
    totalFloors: 4,
    totalRooms: 48,
    totalBeds: 192,
    occupiedBeds: 148,
    managerId: 'user-dorm-mgr',
    managerName: 'Tariku Mengistu',
    image: '/assets/images/dormitory_blocks.jpg',
    isActive: true
  },
  {
    id: 'dorm-2',
    name: 'Block 46 - Taytu Hall (Women)',
    amharicName: 'ብሎክ 46 - ጣይቱ አዳራሽ (ሴት)',
    blockNumber: 'Block 46',
    genderType: 'FEMALE',
    totalFloors: 4,
    totalRooms: 48,
    totalBeds: 192,
    occupiedBeds: 160,
    managerId: 'user-dorm-mgr',
    managerName: 'Tariku Mengistu',
    image: '/assets/images/dormitory_blocks.jpg',
    isActive: true
  },
  {
    id: 'dorm-3',
    name: 'Block 47 - Postgraduate & Special Needs Block',
    amharicName: 'ብሎክ 47 - ድኅረ ምረቃና ልዩ ፍላጎት ብሎክ',
    blockNumber: 'Block 47',
    genderType: 'MIXED',
    totalFloors: 3,
    totalRooms: 36,
    totalBeds: 108,
    occupiedBeds: 62,
    managerId: 'user-dorm-mgr',
    managerName: 'Tariku Mengistu',
    image: '/assets/images/dormitory_blocks.jpg',
    isActive: true
  }
];

// Generate sample rooms for Block 45
export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-101',
    dormitoryId: 'dorm-1',
    dormitoryName: 'Block 45 - Tewodros Hall (Men)',
    roomNumber: 'B45-101',
    floorNumber: 1,
    capacity: 4,
    occupiedCount: 4,
    roomType: 'STANDARD',
    status: 'FULL',
    beds: [
      { id: 'b-101-1', roomId: 'room-101', bedNumber: 'Bed 1 (Lower)', status: 'OCCUPIED', studentId: 'WU/2024/001', studentName: 'Abebe Kebede Tadesse', studentDepartment: 'Software Engineering', studentBatch: '2024', assignedDate: '2024-10-05' },
      { id: 'b-101-2', roomId: 'room-101', bedNumber: 'Bed 2 (Upper)', status: 'OCCUPIED', studentId: 'WU/2024/011', studentName: 'Chala Demissie', studentDepartment: 'Software Engineering', studentBatch: '2024', assignedDate: '2024-10-05' },
      { id: 'b-101-3', roomId: 'room-101', bedNumber: 'Bed 3 (Lower)', status: 'OCCUPIED', studentId: 'WU/2024/012', studentName: 'Kidus Yohannes', studentDepartment: 'Computer Science', studentBatch: '2024', assignedDate: '2024-10-05' },
      { id: 'b-101-4', roomId: 'room-101', bedNumber: 'Bed 4 (Upper)', status: 'OCCUPIED', studentId: 'WU/2024/013', studentName: 'Henok Tilahun', studentDepartment: 'Software Engineering', studentBatch: '2024', assignedDate: '2024-10-05' }
    ]
  },
  {
    id: 'room-102',
    dormitoryId: 'dorm-1',
    dormitoryName: 'Block 45 - Tewodros Hall (Men)',
    roomNumber: 'B45-102',
    floorNumber: 1,
    capacity: 4,
    occupiedCount: 2,
    roomType: 'ACCESSIBLE',
    status: 'AVAILABLE',
    beds: [
      { id: 'b-102-1', roomId: 'room-102', bedNumber: 'Bed 1 (Lower)', status: 'OCCUPIED', studentId: 'WU/2024/020', studentName: 'Samuel Alemu', studentDepartment: 'Civil Engineering', studentBatch: '2024', assignedDate: '2024-10-06' },
      { id: 'b-102-2', roomId: 'room-102', bedNumber: 'Bed 2 (Upper)', status: 'AVAILABLE' },
      { id: 'b-102-3', roomId: 'room-102', bedNumber: 'Bed 3 (Lower)', status: 'OCCUPIED', studentId: 'WU/2024/021', studentName: 'Mulugeta Kassa', studentDepartment: 'Mechanical Engineering', studentBatch: '2024', assignedDate: '2024-10-06' },
      { id: 'b-102-4', roomId: 'room-102', bedNumber: 'Bed 4 (Upper)', status: 'AVAILABLE' }
    ]
  },
  {
    id: 'room-103',
    dormitoryId: 'dorm-1',
    dormitoryName: 'Block 45 - Tewodros Hall (Men)',
    roomNumber: 'B45-103',
    floorNumber: 1,
    capacity: 4,
    occupiedCount: 1,
    roomType: 'STANDARD',
    status: 'AVAILABLE',
    beds: [
      { id: 'b-103-1', roomId: 'room-103', bedNumber: 'Bed 1 (Lower)', status: 'OCCUPIED', studentId: 'WU/2024/030', studentName: 'Binyam Fikre', studentDepartment: 'Electrical & Computer Engineering', studentBatch: '2024' },
      { id: 'b-103-2', roomId: 'room-103', bedNumber: 'Bed 2 (Upper)', status: 'AVAILABLE' },
      { id: 'b-103-3', roomId: 'room-103', bedNumber: 'Bed 3 (Lower)', status: 'AVAILABLE' },
      { id: 'b-103-4', roomId: 'room-103', bedNumber: 'Bed 4 (Upper)', status: 'MAINTENANCE' }
    ]
  },
  {
    id: 'room-201',
    dormitoryId: 'dorm-1',
    dormitoryName: 'Block 45 - Tewodros Hall (Men)',
    roomNumber: 'B45-201',
    floorNumber: 2,
    capacity: 4,
    occupiedCount: 3,
    roomType: 'STANDARD',
    status: 'AVAILABLE',
    beds: [
      { id: 'b-201-1', roomId: 'room-201', bedNumber: 'Bed 1 (Lower)', status: 'OCCUPIED', studentId: 'WU/2023/110', studentName: 'Nigus Haile', studentDepartment: 'Economics', studentBatch: '2023' },
      { id: 'b-201-2', roomId: 'room-201', bedNumber: 'Bed 2 (Upper)', status: 'OCCUPIED', studentId: 'WU/2023/111', studentName: 'Eyob Solomon', studentDepartment: 'Management', studentBatch: '2023' },
      { id: 'b-201-3', roomId: 'room-201', bedNumber: 'Bed 3 (Lower)', status: 'OCCUPIED', studentId: 'WU/2023/112', studentName: 'Natnael Girma', studentDepartment: 'Economics', studentBatch: '2023' },
      { id: 'b-201-4', roomId: 'room-201', bedNumber: 'Bed 4 (Upper)', status: 'AVAILABLE' }
    ]
  }
];

export const INITIAL_APPLICATIONS: AccommodationApplication[] = [
  {
    id: 'app-1',
    studentId: 'WU/2024/001',
    studentName: 'Abebe Kebede Tadesse',
    studentIdNumber: 'WU/2024/001',
    gender: 'MALE',
    college: 'College of Engineering and Technology',
    department: 'Software Engineering',
    batch: 'Batch 2024',
    semester: 'Semester 1',
    specialNeeds: false,
    preferredFloor: '1st Floor',
    emergencyContact: '+251 911 223344 (Kebede Tadesse - Father)',
    appliedDate: '2024-10-02',
    status: 'ALLOCATED',
    aiRecommendation: {
      dormitoryId: 'dorm-1',
      dormitoryName: 'Block 45 - Tewodros Hall (Men)',
      roomNumber: 'B45-101',
      bedNumber: 'Bed 1 (Lower)',
      score: 98,
      reason: 'Perfect batch harmony, department peer cohort (Software Eng), ground floor suitability.'
    },
    allocatedDorm: 'Block 45 - Tewodros Hall (Men)',
    allocatedRoom: 'B45-101',
    allocatedBed: 'Bed 1 (Lower)'
  },
  {
    id: 'app-2',
    studentId: 'WU/2024/003',
    studentName: 'Daniel Getachew Bekele',
    studentIdNumber: 'WU/2024/003',
    gender: 'MALE',
    college: 'College of Business and Economics',
    department: 'Accounting and Finance',
    batch: 'Batch 2023',
    semester: 'Semester 2',
    specialNeeds: false,
    preferredFloor: '2nd Floor',
    emergencyContact: '+251 922 889900 (Getachew Bekele)',
    appliedDate: '2024-10-04',
    status: 'AI_RECOMMENDED',
    aiRecommendation: {
      dormitoryId: 'dorm-1',
      dormitoryName: 'Block 45 - Tewodros Hall (Men)',
      roomNumber: 'B45-201',
      bedNumber: 'Bed 4 (Upper)',
      score: 95,
      reason: 'Room 201 has 3 Business & Economics batch 2023 students. Optimal peer study environment.'
    }
  },
  {
    id: 'app-3',
    studentId: 'WU/2024/005',
    studentName: 'Yonas Berhanu Tefera',
    studentIdNumber: 'WU/2024/005',
    gender: 'MALE',
    college: 'College of Engineering and Technology',
    department: 'Electrical & Computer Engineering',
    batch: 'Batch 2022',
    semester: 'Semester 1',
    specialNeeds: true,
    specialNeedsDescription: 'Physical mobility assistance (requires ground floor lower bunk).',
    preferredFloor: 'Ground/1st Floor',
    emergencyContact: '+251 933 112233 (Sister)',
    appliedDate: '2024-10-05',
    status: 'PENDING',
    aiRecommendation: {
      dormitoryId: 'dorm-1',
      dormitoryName: 'Block 45 - Tewodros Hall (Men)',
      roomNumber: 'B45-102',
      bedNumber: 'Bed 2 (Lower)',
      score: 99,
      reason: 'Critical medical priority: Accessible Room B45-102 on ground floor with wide ramp access.'
    }
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    propertyCode: 'WU-PROP-2024-001',
    name: 'Heavy Duty Steel Double Bunk Bed Frame',
    category: 'DORM_BED',
    buildingType: 'DORMITORY',
    buildingName: 'Block 45 - Tewodros Hall',
    roomNumber: 'Room 101',
    purchaseDate: '2023-08-15',
    condition: 'EXCELLENT',
    serialNumber: 'SN-BBF-001',
    assignedTo: 'Block 45 Proctor',
    remarks: '4 bunk beds verified in Room 101'
  },
  {
    id: 'prop-2',
    propertyCode: 'WU-PROP-2024-002',
    name: 'High-Density Orthopedic Dorm Mattress (4-inch)',
    category: 'FURNITURE',
    buildingType: 'DORMITORY',
    buildingName: 'Block 45 - Tewodros Hall',
    roomNumber: 'Room 101 Bed 1',
    purchaseDate: '2023-08-15',
    condition: 'GOOD',
    serialNumber: 'SN-MAT-1011',
    assignedTo: 'Abebe Kebede (WU/2024/001)'
  },
  {
    id: 'prop-3',
    propertyCode: 'WU-PROP-2024-003',
    name: 'Dell OptiPlex 7090 Desktop Computer',
    category: 'ELECTRONICS',
    buildingType: 'ACADEMIC_BLOCK',
    buildingName: 'Engineering Complex A',
    roomNumber: 'Lab 204 (Software Lab)',
    purchaseDate: '2022-11-20',
    condition: 'EXCELLENT',
    serialNumber: 'DL-7090-WU-0442',
    assignedTo: 'Software Eng Dept Lab Coordinator'
  },
  {
    id: 'prop-4',
    propertyCode: 'WU-PROP-2024-004',
    name: 'Binocular Compound Laboratory Microscope',
    category: 'LABORATORY',
    buildingType: 'LABORATORY',
    buildingName: 'Health Sciences Hall',
    roomNumber: 'Medical Lab 1',
    purchaseDate: '2023-02-10',
    condition: 'GOOD',
    serialNumber: 'MIC-OLYMP-88',
    assignedTo: 'Head of Medical Laboratory Sciences'
  },
  {
    id: 'prop-5',
    propertyCode: 'WU-PROP-2024-005',
    name: 'Heavy-Duty Dormitory Wooden Study Desk & Chair',
    category: 'FURNITURE',
    buildingType: 'DORMITORY',
    buildingName: 'Block 45 - Tewodros Hall',
    roomNumber: 'Room 103',
    purchaseDate: '2021-09-01',
    condition: 'NEEDS_REPAIR',
    serialNumber: 'SN-DSK-45103',
    remarks: 'Table drawer handle broken, reported for maintenance'
  },
  {
    id: 'prop-6',
    propertyCode: 'WU-PROP-2024-006',
    name: 'Industrial Water Booster Pump 5.5 HP',
    category: 'OTHER',
    buildingType: 'DORMITORY',
    buildingName: 'Block 45 / Block 46 Pump Station',
    roomNumber: 'Sub-level Plant Room',
    purchaseDate: '2022-04-12',
    condition: 'GOOD',
    serialNumber: 'PUMP-GRUNDFOS-55',
    remarks: 'Main supply pump for student dorm washrooms'
  }
];

export const INITIAL_MAINTENANCE_COMPLAINTS: MaintenanceComplaint[] = [
  {
    id: 'maint-1',
    ticketNumber: 'WU-MNT-2024-001',
    studentId: 'WU/2024/001',
    studentName: 'Abebe Kebede Tadesse',
    studentPhone: '+251 922 123456',
    dormitoryName: 'Block 45 - Tewodros Hall (Men)',
    roomNumber: 'B45-101',
    category: 'WATER_PLUMBING',
    description: 'Shower tap valve is leaking continuously and water pressure in the 1st floor corridor washroom is fluctuating.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedStaffId: 'user-maint-staff',
    assignedStaffName: 'Engineer Dawit Girma',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    repairNotes: 'Replaced rubber washer gasket and tightened flange. Conducting final leak check.',
    createdAt: '2024-10-10 09:30 AM'
  },
  {
    id: 'maint-2',
    ticketNumber: 'WU-MNT-2024-002',
    studentId: 'WU/2024/030',
    studentName: 'Binyam Fikre',
    studentPhone: '+251 911 556677',
    dormitoryName: 'Block 45 - Tewodros Hall (Men)',
    roomNumber: 'B45-103',
    category: 'ELECTRICITY',
    description: 'Fluorescent ceiling light tube and wall switch sparking when turned on. Urgent safety hazard.',
    priority: 'URGENT',
    status: 'ASSIGNED',
    assignedStaffId: 'user-maint-staff',
    assignedStaffName: 'Engineer Dawit Girma',
    createdAt: '2024-10-12 04:15 PM'
  },
  {
    id: 'maint-3',
    ticketNumber: 'WU-MNT-2024-003',
    studentId: 'WU/2024/020',
    studentName: 'Samuel Alemu',
    studentPhone: '+251 944 332211',
    dormitoryName: 'Block 45 - Tewodros Hall (Men)',
    roomNumber: 'B45-102',
    category: 'DOORS_WINDOWS',
    description: 'Window latch latch-bolt is stuck and cannot close securely against wind/rain.',
    priority: 'MEDIUM',
    status: 'COMPLETED',
    assignedStaffId: 'user-maint-staff',
    assignedStaffName: 'Engineer Dawit Girma',
    repairNotes: 'Installed new steel sliding latch and lubricated hinges. Tested with student present.',
    createdAt: '2024-10-08 11:00 AM',
    completedAt: '2024-10-09 02:40 PM'
  }
];

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2024-10-14 14:22:10',
    userId: 'user-admin',
    userName: 'Dr. Habtamu Belay',
    userRole: 'SUPER_ADMIN',
    action: 'OFFICIAL_ROSTER_UPLOAD',
    details: 'Uploaded official registrar student roster file (wu_batch2024_admissions.xlsx) with 1,450 verified student entries.',
    ipAddress: '10.240.12.5'
  },
  {
    id: 'log-2',
    timestamp: '2024-10-14 15:05:40',
    userId: 'user-accom-off',
    userName: 'W/ro Genet Assefa',
    userRole: 'ACCOMMODATION_OFFICER',
    action: 'AI_SMART_ALLOCATION_EXECUTE',
    details: 'Approved AI allocation recommendations for 120 Software Engineering Batch 2024 students into Block 45.',
    ipAddress: '10.240.14.18'
  },
  {
    id: 'log-3',
    timestamp: '2024-10-14 16:30:12',
    userId: 'user-dorm-mgr',
    userName: 'Proctor Tariku Mengistu',
    userRole: 'DORMITORY_MANAGER',
    action: 'STUDENT_CHECK_IN',
    details: 'Completed physical key issuance and bed check-in verification for student WU/2024/001.',
    ipAddress: '10.240.16.89'
  }
];
