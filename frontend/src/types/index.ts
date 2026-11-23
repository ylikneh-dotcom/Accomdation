export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'STUDENT' 
  | 'DORMITORY_MANAGER' 
  | 'ACCOMMODATION_OFFICER' 
  | 'PROPERTY_MANAGER' 
  | 'MAINTENANCE_STAFF';

export interface User {
  id: string;
  name: string;
  amharicName?: string;
  email: string;
  password?: string;
  role: UserRole;
  studentId?: string;
  collegeId?: string;
  departmentId?: string;
  departmentName?: string;
  batch?: string;
  semester?: string;
  phone?: string;
  avatar?: string;
  status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  assignedDormId?: string;
  assignedDormName?: string;
  assignedArea?: string;
}

export interface OfficialStudentRecord {
  id: string;
  studentId: string;
  fullName: string;
  amharicName?: string;
  collegeName: string;
  departmentName: string;
  batch: string;
  semester: string;
  gender: 'MALE' | 'FEMALE';
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED' | 'REJECTED';
  isRegistered: boolean;
  uploadedAt: string;
  notes?: string;
  avatar?: string;
}

export interface College {
  id: string;
  name: string;
  amharicName: string;
  code: string;
  description: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  collegeId: string;
  collegeName: string;
  name: string;
  amharicName: string;
  code: string;
  isActive: boolean;
}

export interface Batch {
  id: string;
  name: string;
  yearEC: string;
  yearGC: string;
  isActive: boolean;
}

export interface Semester {
  id: string;
  name: string;
  academicYear: string;
  isActive: boolean;
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  studentId?: string;
  studentName?: string;
  studentDepartment?: string;
  studentBatch?: string;
  assignedDate?: string;
}

export interface Room {
  id: string;
  dormitoryId: string;
  dormitoryName: string;
  roomNumber: string;
  floorNumber: number;
  capacity: number;
  occupiedCount: number;
  roomType: 'STANDARD' | 'ACCESSIBLE' | 'PROCTOR' | 'ISOLATION';
  status: 'AVAILABLE' | 'FULL' | 'MAINTENANCE';
  beds: Bed[];
}

export interface Dormitory {
  id: string;
  name: string;
  amharicName: string;
  blockNumber: string;
  genderType: 'MALE' | 'FEMALE' | 'MIXED';
  totalFloors: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  managerId: string;
  managerName: string;
  image: string;
  isActive: boolean;
}

export interface AccommodationApplication {
  id: string;
  studentId: string;
  studentName: string;
  studentIdNumber: string;
  gender: 'MALE' | 'FEMALE';
  college: string;
  department: string;
  batch: string;
  semester: string;
  specialNeeds: boolean;
  specialNeedsDescription?: string;
  preferredFloor?: string;
  emergencyContact: string;
  appliedDate: string;
  status: 'PENDING' | 'AI_RECOMMENDED' | 'APPROVED' | 'ALLOCATED' | 'REJECTED';
  aiRecommendation?: {
    dormitoryId: string;
    dormitoryName: string;
    roomNumber: string;
    bedNumber: string;
    score: number;
    reason: string;
  };
  allocatedDorm?: string;
  allocatedRoom?: string;
  allocatedBed?: string;
}

export interface RoomChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  currentDorm: string;
  currentRoom: string;
  currentBed: string;
  requestedReason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestDate: string;
  approvalNotes?: string;
}

export interface Property {
  id: string;
  propertyCode: string;
  name: string;
  category: 'FURNITURE' | 'ELECTRONICS' | 'LABORATORY' | 'OFFICE' | 'DORM_BED' | 'OTHER';
  buildingType: 'DORMITORY' | 'ACADEMIC_BLOCK' | 'LABORATORY' | 'ADMINISTRATION';
  buildingName: string;
  roomNumber: string;
  purchaseDate: string;
  condition: 'EXCELLENT' | 'GOOD' | 'NEEDS_REPAIR' | 'DAMAGED' | 'MISSING';
  serialNumber?: string;
  assignedTo?: string;
  remarks?: string;
}

export interface MaintenanceComplaint {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  dormitoryName: string;
  roomNumber: string;
  category: 
    | 'WATER_PLUMBING' 
    | 'ELECTRICITY' 
    | 'BED_FURNITURE' 
    | 'INTERNET_WIFI' 
    | 'DOORS_WINDOWS' 
    | 'SANITATION_TOILET' 
    | 'OTHER';
  description: string;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 
    | 'SUBMITTED' 
    | 'UNDER_REVIEW' 
    | 'ASSIGNED' 
    | 'IN_PROGRESS' 
    | 'COMPLETED' 
    | 'VERIFIED' 
    | 'REJECTED';
  assignedStaffId?: string;
  assignedStaffName?: string;
  imageUrl?: string;
  repairNotes?: string;
  repairProofUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  ipAddress: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  amharicText?: string;
  timestamp: string;
}
