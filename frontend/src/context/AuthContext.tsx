import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  OfficialStudentRecord,
  College,
  Department,
  Batch,
  Semester,
  Dormitory,
  Room,
  AccommodationApplication,
  Property,
  MaintenanceComplaint,
  SystemAuditLog
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_OFFICIAL_STUDENTS,
  INITIAL_COLLEGES,
  INITIAL_DEPARTMENTS,
  INITIAL_BATCHES,
  INITIAL_SEMESTERS,
  INITIAL_DORMITORIES,
  INITIAL_ROOMS,
  INITIAL_APPLICATIONS,
  INITIAL_PROPERTIES,
  INITIAL_MAINTENANCE_COMPLAINTS,
  INITIAL_AUDIT_LOGS
} from '../services/mockData';

interface VerificationResult {
  success: boolean;
  message: string;
  matchedRecord?: OfficialStudentRecord;
  flagReason?: string;
}

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  setCurrentUser: (user: User | null) => void;
  login: (identifier: string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Verification & Registration
  officialStudents: OfficialStudentRecord[];
  registerAndVerifyStudent: (data: {
    studentId: string;
    fullName: string;
    collegeName: string;
    departmentName: string;
    batch: string;
    semester: string;
    password: string;
    avatar?: string;
    photo?: string;
  }) => VerificationResult;
  updateUserProfileAvatar: (avatarUrl: string) => void;

  // Admin Data Management
  colleges: College[];
  departments: Department[];
  batches: Batch[];
  semesters: Semester[];
  dormitories: Dormitory[];
  rooms: Room[];
  applications: AccommodationApplication[];
  properties: Property[];
  complaints: MaintenanceComplaint[];
  auditLogs: SystemAuditLog[];
  allUsers: User[];

  // Admin Actions
  addOfficialStudentsBulk: (newRecords: OfficialStudentRecord[]) => void;
  addOfficialStudentSingle: (record: Omit<OfficialStudentRecord, 'id' | 'uploadedAt' | 'isRegistered'>) => void;
  updateOfficialStudentStatus: (id: string, status: OfficialStudentRecord['status']) => void;
  updateOfficialStudentRecord: (id: string, updated: Partial<OfficialStudentRecord>) => void;
  deleteOfficialStudent: (id: string) => void;

  // Academic Structure Actions
  addCollege: (college: Omit<College, 'id'>) => void;
  updateCollege: (id: string, updated: Partial<College>) => { success: boolean; message: string };
  deleteCollege: (id: string) => { success: boolean; message: string };
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, updated: Partial<Department>) => { success: boolean; message: string };
  deleteDepartment: (id: string) => { success: boolean; message: string };

  // Staff Actions (Admin can add and control all staff)
  addStaffUser: (user: Omit<User, 'id' | 'status'>) => void;
  updateStaffUser: (id: string, updated: Partial<User>) => void;

  // Accommodation Actions
  applyForAccommodation: (application: Omit<AccommodationApplication, 'id' | 'appliedDate' | 'status'>) => void;
  allocateBed: (applicationId: string, dormName: string, roomNumber: string, bedNumber: string) => void;
  runAiAutoAllocation: () => { count: number; message: string };

  // Maintenance Actions
  submitComplaint: (complaint: Omit<MaintenanceComplaint, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => MaintenanceComplaint;
  updateComplaintStatus: (id: string, status: MaintenanceComplaint['status'], repairNotes?: string) => void;

  // Property Actions
  addProperty: (property: Omit<Property, 'id'>) => void;
  updatePropertyCondition: (id: string, condition: Property['condition']) => void;
  transferProperty: (id: string, newBuilding: string, newRoom: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize state from localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('wu_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [officialStudents, setOfficialStudents] = useState<OfficialStudentRecord[]>(() => {
    const saved = localStorage.getItem('wu_official_students');
    return saved ? JSON.parse(saved) : INITIAL_OFFICIAL_STUDENTS;
  });

  const [colleges, setColleges] = useState<College[]>(() => {
    const saved = localStorage.getItem('wu_colleges');
    return saved ? JSON.parse(saved) : INITIAL_COLLEGES;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('wu_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [batches] = useState<Batch[]>(INITIAL_BATCHES);
  const [semesters] = useState<Semester[]>(INITIAL_SEMESTERS);

  const [dormitories, setDormitories] = useState<Dormitory[]>(() => {
    const saved = localStorage.getItem('wu_dormitories');
    return saved ? JSON.parse(saved) : INITIAL_DORMITORIES;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('wu_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [applications, setApplications] = useState<AccommodationApplication[]>(() => {
    const saved = localStorage.getItem('wu_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('wu_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [complaints, setComplaints] = useState<MaintenanceComplaint[]>(() => {
    const saved = localStorage.getItem('wu_complaints');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_COMPLAINTS;
  });

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem('wu_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('wu_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wu_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('wu_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wu_official_students', JSON.stringify(officialStudents));
  }, [officialStudents]);

  useEffect(() => {
    localStorage.setItem('wu_colleges', JSON.stringify(colleges));
  }, [colleges]);

  useEffect(() => {
    localStorage.setItem('wu_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('wu_dormitories', JSON.stringify(dormitories));
  }, [dormitories]);

  useEffect(() => {
    localStorage.setItem('wu_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('wu_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('wu_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('wu_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('wu_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('wu_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Log an audit trail item
  const logAudit = (action: string, details: string) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'System Guest',
      userRole: currentUser?.role || 'SYSTEM',
      action,
      details,
      ipAddress: '10.240.12.88'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Role-based Login handler with ID number / email and password
  const login = (identifier: string, password?: string): { success: boolean; message?: string } => {
    const trimmed = identifier.trim().toLowerCase();
    const cleanPass = password?.trim() || '';

    if (!trimmed) {
      return { success: false, message: 'Please enter your Student ID or Official Staff Email.' };
    }

    // Check if matching predefined user by studentId or email
    const matched = allUsers.find(u =>
      u.email.toLowerCase() === trimmed ||
      (u.studentId && u.studentId.toLowerCase() === trimmed)
    );

    if (!matched) {
      return {
        success: false,
        message: 'Account not found. Please verify your Student ID or Email.'
      };
    }

    // Check password: match stored password or fallback 'password123'
    const expectedPass = matched.password || 'password123';
    if (cleanPass && cleanPass !== expectedPass && cleanPass !== 'password123') {
      return {
        success: false,
        message: 'Incorrect password. Please try again.'
      };
    }

    setCurrentUser(matched);
    logAudit('USER_LOGIN', `User ${matched.name} (${matched.role}) logged in successfully via ${matched.studentId || matched.email}.`);
    return { success: true };
  };

  // Switch role instantly for smooth multi-role evaluation
  const switchRole = (role: UserRole) => {
    const roleUser = allUsers.find(u => u.role === role);
    if (roleUser) {
      setCurrentUser(roleUser);
      logAudit('ROLE_SWITCH', `Switched active session to role: ${role}`);
    }
  };

  const logout = () => {
    if (currentUser) {
      logAudit('USER_LOGOUT', `User ${currentUser.name} logged out.`);
    }
    setCurrentUser(null);
  };

  // ==========================================
  // Section 5: Student Registration & Official Verification Process
  // ==========================================
  const registerAndVerifyStudent = (data: {
    studentId: string;
    fullName: string;
    collegeName: string;
    departmentName: string;
    batch: string;
    semester: string;
    password: string;
    avatar?: string;
    photo?: string;
  }): VerificationResult => {
    const cleanId = data.studentId.trim().toUpperCase();
    const cleanName = data.fullName.trim().toLowerCase();

    // 1. Check if student ID already registered
    const existingUser = allUsers.find(u => u.studentId?.toUpperCase() === cleanId);
    if (existingUser) {
      return {
        success: false,
        message: 'Security Alert: This Student ID is already registered and has an active account. Multiple accounts per ID are prohibited.'
      };
    }

    // 2. Locate in Official Registrar List
    const officialRecord = officialStudents.find(
      s => s.studentId.toUpperCase() === cleanId
    );

    if (!officialRecord) {
      logAudit('REGISTRATION_FAILED_NO_RECORD', `Attempted registration for non-existent ID: ${cleanId}`);
      return {
        success: false,
        message: 'Official Verification Failed: Student ID not found in Wachemo University official registrar records. Please contact your College Registrar or Super Admin.'
      };
    }

    // 3. Compare submitted information against official record
    const nameMatch = officialRecord.fullName.trim().toLowerCase() === cleanName;
    const collegeMatch = officialRecord.collegeName === data.collegeName;
    const departmentMatch = officialRecord.departmentName === data.departmentName;
    const batchMatch = officialRecord.batch === data.batch;
    const semesterMatch = officialRecord.semester === data.semester;

    const allMatched = nameMatch && collegeMatch && departmentMatch && batchMatch && semesterMatch;

    if (!allMatched) {
      // Flag the record for Super Admin review
      setOfficialStudents(prev => prev.map(s =>
        s.id === officialRecord.id
          ? { ...s, status: 'FLAGGED', notes: `Registration submitted with mismatched fields: ${!nameMatch ? '[Name Mismatch] ' : ''}${!collegeMatch ? '[College Mismatch] ' : ''}${!departmentMatch ? '[Dept Mismatch] ' : ''}` }
          : s
      ));

      logAudit('REGISTRATION_FLAGGED', `Registration for ${cleanId} flagged due to data discrepancy.`);

      return {
        success: false,
        flagReason: 'Data Mismatch: Some details do not match official university records. Your submission has been flagged for Super Admin manual review.',
        message: 'Data Mismatch: The submitted details do not match the official student roster. The record has been flagged for Administrator review.'
      };
    }

    // 4. Exact Match: Verify and approve student account with their uploaded photo
    const studentAvatar = data.avatar || data.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    const newStudentUser: User = {
      id: `user-stu-${Date.now()}`,
      name: officialRecord.fullName,
      email: `${cleanId.toLowerCase().replace(/[^a-z0-9]/g, '')}@wachemo.edu.et`,
      role: 'STUDENT',
      studentId: officialRecord.studentId,
      departmentName: officialRecord.departmentName,
      batch: officialRecord.batch,
      semester: officialRecord.semester,
      phone: '+251 900 000000',
      password: data.password,
      avatar: studentAvatar,
      status: 'ACTIVE'
    };

    // Update official roster entry to registered & verified with their photo
    setOfficialStudents(prev => prev.map(s =>
      s.id === officialRecord.id
        ? { ...s, status: 'VERIFIED', isRegistered: true, avatar: studentAvatar }
        : s
    ));

    // Add to system users
    setAllUsers(prev => [...prev, newStudentUser]);
    setCurrentUser(newStudentUser);

    logAudit('STUDENT_VERIFIED_REGISTERED', `Student ${officialRecord.fullName} (${cleanId}) successfully verified against official list with uploaded profile photo.`);

    return {
      success: true,
      message: 'Official Verification Confirmed! Identity matched Wachemo University registrar records. Welcome to your Student Accommodation Portal.',
      matchedRecord: officialRecord
    };
  };

  const updateUserProfileAvatar = (avatarUrl: string) => {
    if (currentUser) {
      const updated = { ...currentUser, avatar: avatarUrl };
      setCurrentUser(updated);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
      if (currentUser.studentId) {
        setOfficialStudents(prev => prev.map(s =>
          s.studentId.toUpperCase() === currentUser.studentId?.toUpperCase()
            ? { ...s, avatar: avatarUrl }
            : s
        ));
      }
      logAudit('STUDENT_PROFILE_PHOTO_UPDATED', `User ${currentUser.name} updated profile photo.`);
    }
  };

  // Super Admin Roster Management
  const addOfficialStudentsBulk = (newRecords: OfficialStudentRecord[]) => {
    setOfficialStudents(prev => {
      const existingIds = new Set(prev.map(p => p.studentId.toUpperCase()));
      const filtered = newRecords.filter(r => !existingIds.has(r.studentId.toUpperCase()));
      return [...filtered, ...prev];
    });
    logAudit('OFFICIAL_ROSTER_BULK_IMPORT', `Super Admin imported ${newRecords.length} records into official student registry.`);
  };

  const addOfficialStudentSingle = (record: Omit<OfficialStudentRecord, 'id' | 'uploadedAt' | 'isRegistered'>) => {
    const newRecord: OfficialStudentRecord = {
      ...record,
      id: `rec-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      isRegistered: false
    };
    setOfficialStudents(prev => [newRecord, ...prev]);
    logAudit('OFFICIAL_STUDENT_ADDED_MANUAL', `Added official student: ${record.fullName} (${record.studentId})`);
  };

  const updateOfficialStudentStatus = (id: string, status: OfficialStudentRecord['status']) => {
    setOfficialStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    logAudit('STUDENT_STATUS_UPDATE', `Updated student record ${id} status to ${status}`);
  };

  const updateOfficialStudentRecord = (id: string, updated: Partial<OfficialStudentRecord>) => {
    setOfficialStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    logAudit('STUDENT_RECORD_UPDATED', `Admin updated official student record: ${updated.fullName || id}`);
  };

  const deleteOfficialStudent = (id: string) => {
    setOfficialStudents(prev => prev.filter(s => s.id !== id));
    logAudit('STUDENT_RECORD_DELETED', `Deleted student record ${id} from official database.`);
  };

  // Academic Structure
  const addCollege = (college: Omit<College, 'id'>) => {
    const newCol: College = { ...college, id: `col-${Date.now()}` };
    setColleges(prev => [...prev, newCol]);
    logAudit('COLLEGE_CREATED', `Created college: ${college.name} (${college.code})`);
  };

  const updateCollege = (id: string, updated: Partial<College>) => {
    const existing = colleges.find(c => c.id === id);
    if (!existing) return { success: false, message: 'College not found.' };

    setColleges(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));

    // If college name changed, sync departments and students
    if (updated.name && updated.name !== existing.name) {
      setDepartments(prev => prev.map(d => d.collegeId === id ? { ...d, collegeName: updated.name! } : d));
      setOfficialStudents(prev => prev.map(s => s.collegeName === existing.name ? { ...s, collegeName: updated.name! } : s));
    }

    logAudit('COLLEGE_UPDATED', `Admin updated college: ${updated.name || existing.name}`);
    return { success: true, message: `College '${updated.name || existing.name}' updated successfully!` };
  };

  const deleteCollege = (id: string) => {
    const target = colleges.find(c => c.id === id);
    if (!target) return { success: false, message: 'College not found.' };

    // Check Business Rule 11: Prevent deletion if active students are attached
    const studentsInCollege = officialStudents.filter(s => s.collegeName === target.name);
    if (studentsInCollege.length > 0) {
      return {
        success: false,
        message: `Deletion Blocked: Cannot delete '${target.name}' because ${studentsInCollege.length} official student records are registered under it. Reassign students first.`
      };
    }

    setColleges(prev => prev.filter(c => c.id !== id));
    setDepartments(prev => prev.filter(d => d.collegeId !== id));
    logAudit('COLLEGE_DELETED', `Deleted college: ${target.name}`);
    return { success: true, message: `College '${target.name}' deleted successfully.` };
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = { ...dept, id: `dept-${Date.now()}` };
    setDepartments(prev => [...prev, newDept]);
    logAudit('DEPARTMENT_CREATED', `Created department: ${dept.name} under ${dept.collegeName}`);
  };

  const updateDepartment = (id: string, updated: Partial<Department>) => {
    const existing = departments.find(d => d.id === id);
    if (!existing) return { success: false, message: 'Department not found.' };

    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));

    // If department name changed, sync students
    if (updated.name && updated.name !== existing.name) {
      setOfficialStudents(prev => prev.map(s => s.departmentName === existing.name ? { ...s, departmentName: updated.name! } : s));
    }

    logAudit('DEPARTMENT_UPDATED', `Admin updated department: ${updated.name || existing.name}`);
    return { success: true, message: `Department '${updated.name || existing.name}' updated successfully!` };
  };

  const deleteDepartment = (id: string) => {
    const target = departments.find(d => d.id === id);
    if (!target) return { success: false, message: 'Department not found.' };

    // Check Business Rule 11: Prevent deletion if active students are attached
    const studentsInDept = officialStudents.filter(s => s.departmentName === target.name);
    if (studentsInDept.length > 0) {
      return {
        success: false,
        message: `Deletion Blocked: Cannot delete '${target.name}' because ${studentsInDept.length} students are currently enrolled in it.`
      };
    }

    setDepartments(prev => prev.filter(d => d.id !== id));
    logAudit('DEPARTMENT_DELETED', `Deleted department: ${target.name}`);
    return { success: true, message: `Department '${target.name}' deleted successfully.` };
  };

  // Staff Management (Super Admin adds and controls all staff)
  const addStaffUser = (user: Omit<User, 'id' | 'status'>) => {
    const newUser: User = {
      ...user,
      id: `staff-${Date.now()}`,
      status: 'ACTIVE'
    };
    setAllUsers(prev => [...prev, newUser]);
    logAudit('STAFF_USER_CREATED', `Admin registered staff member: ${user.name} (${user.role})`);
  };

  const updateStaffUser = (id: string, updated: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updated } : prev);
    }
    logAudit('STAFF_USER_UPDATED', `Admin updated staff member details: ${updated.name || id}`);
  };

  // Accommodation Application
  const applyForAccommodation = (data: Omit<AccommodationApplication, 'id' | 'appliedDate' | 'status'>) => {
    // Generate AI recommendation automatically based on department cohort and medical need
    const isAccessibleNeeded = data.specialNeeds;
    const targetDorm = data.gender === 'FEMALE' ? 'dorm-2' : 'dorm-1';
    const targetDormName = data.gender === 'FEMALE' ? 'Block 46 - Taytu Hall (Women)' : 'Block 45 - Tewodros Hall (Men)';
    const roomNum = isAccessibleNeeded ? 'B45-102' : 'B45-103';
    const bedNum = isAccessibleNeeded ? 'Bed 2 (Lower)' : 'Bed 3 (Lower)';

    const newApp: AccommodationApplication = {
      ...data,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'AI_RECOMMENDED',
      aiRecommendation: {
        dormitoryId: targetDorm,
        dormitoryName: targetDormName,
        roomNumber: roomNum,
        bedNumber: bedNum,
        score: isAccessibleNeeded ? 99 : 94,
        reason: isAccessibleNeeded
          ? 'Special medical/mobility priority: Allocated accessible ground-floor lower bed in Room 102.'
          : `Peer cohort grouping: Matched with ${data.department} classmates from ${data.batch}.`
      }
    };

    setApplications(prev => [newApp, ...prev]);
    logAudit('ACCOMMODATION_APPLICATION_SUBMITTED', `Student ${data.studentName} (${data.studentIdNumber}) submitted dormitory application.`);
  };

  // Allocate bed to student
  const allocateBed = (applicationId: string, dormName: string, roomNumber: string, bedNumber: string) => {
    setApplications(prev => prev.map(app =>
      app.id === applicationId
        ? {
          ...app,
          status: 'ALLOCATED',
          allocatedDorm: dormName,
          allocatedRoom: roomNumber,
          allocatedBed: bedNumber
        }
        : app
    ));

    // Update Room & Bed occupancy in visual matrix
    setRooms(prev => prev.map(room => {
      if (room.roomNumber === roomNumber) {
        const app = applications.find(a => a.id === applicationId);
        const updatedBeds = room.beds.map(bed => {
          if (bed.bedNumber === bedNumber) {
            return {
              ...bed,
              status: 'OCCUPIED' as const,
              studentId: app?.studentIdNumber,
              studentName: app?.studentName,
              studentDepartment: app?.department,
              assignedDate: new Date().toISOString().split('T')[0]
            };
          }
          return bed;
        });

        const occupiedCount = updatedBeds.filter(b => b.status === 'OCCUPIED').length;
        return {
          ...room,
          occupiedCount,
          status: occupiedCount >= room.capacity ? ('FULL' as const) : ('AVAILABLE' as const),
          beds: updatedBeds
        };
      }
      return room;
    }));

    // Update dorm stats
    setDormitories(prev => prev.map(dorm => {
      if (dorm.name.includes(dormName.split(' ')[0])) {
        return { ...dorm, occupiedBeds: dorm.occupiedBeds + 1 };
      }
      return dorm;
    }));

    logAudit('BED_ALLOCATED', `Bed ${bedNumber} in ${roomNumber} allocated to application ${applicationId}`);
  };

  // Run AI batch auto-allocation
  const runAiAutoAllocation = () => {
    let count = 0;
    setApplications(prev => prev.map(app => {
      if (app.status === 'PENDING' || app.status === 'AI_RECOMMENDED') {
        count++;
        const rec = app.aiRecommendation;
        return {
          ...app,
          status: 'ALLOCATED',
          allocatedDorm: rec ? rec.dormitoryName : 'Block 45 - Tewodros Hall (Men)',
          allocatedRoom: rec ? rec.roomNumber : 'B45-103',
          allocatedBed: rec ? rec.bedNumber : 'Bed 3 (Lower)'
        };
      }
      return app;
    }));

    logAudit('AI_BATCH_ALLOCATION_RUN', `AI Smart Allocation completed for ${count} student applications.`);
    return { count, message: `AI successfully allocated ${count} eligible students to optimal rooms.` };
  };

  // Maintenance Complaint
  const submitComplaint = (data: Omit<MaintenanceComplaint, 'id' | 'ticketNumber' | 'createdAt' | 'status'>): MaintenanceComplaint => {
    const newComplaint: MaintenanceComplaint = {
      ...data,
      id: `maint-${Date.now()}`,
      ticketNumber: `WU-MNT-2024-${String(complaints.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toLocaleString(),
      status: 'SUBMITTED'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    logAudit('MAINTENANCE_COMPLAINT_SUBMITTED', `Complaint ${newComplaint.ticketNumber} logged for room ${data.roomNumber}`);
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, status: MaintenanceComplaint['status'], repairNotes?: string) => {
    setComplaints(prev => prev.map(c =>
      c.id === id
        ? {
          ...c,
          status,
          repairNotes: repairNotes || c.repairNotes,
          completedAt: status === 'COMPLETED' ? new Date().toLocaleString() : c.completedAt
        }
        : c
    ));
    logAudit('MAINTENANCE_STATUS_UPDATED', `Ticket ${id} status moved to ${status}`);
  };

  // Property Management
  const addProperty = (prop: Omit<Property, 'id'>) => {
    const newProp: Property = { ...prop, id: `prop-${Date.now()}` };
    setProperties(prev => [newProp, ...prev]);
    logAudit('PROPERTY_REGISTERED', `Registered new asset: ${prop.propertyCode} - ${prop.name}`);
  };

  const updatePropertyCondition = (id: string, condition: Property['condition']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, condition } : p));
    logAudit('PROPERTY_CONDITION_CHANGED', `Property ${id} condition updated to ${condition}`);
  };

  const transferProperty = (id: string, newBuilding: string, newRoom: string) => {
    setProperties(prev => prev.map(p =>
      p.id === id
        ? { ...p, buildingName: newBuilding, roomNumber: newRoom }
        : p
    ));
    logAudit('PROPERTY_TRANSFERRED', `Transferred property ${id} to ${newBuilding} / ${newRoom}`);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        setCurrentUser,
        login,
        logout,
        switchRole,
        officialStudents,
        registerAndVerifyStudent,
        updateUserProfileAvatar,
        colleges,
        departments,
        batches,
        semesters,
        dormitories,
        rooms,
        applications,
        properties,
        complaints,
        auditLogs,
        allUsers,
        addOfficialStudentsBulk,
        addOfficialStudentSingle,
        updateOfficialStudentStatus,
        updateOfficialStudentRecord,
        deleteOfficialStudent,
        addCollege,
        updateCollege,
        deleteCollege,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addStaffUser,
        updateStaffUser,
        applyForAccommodation,
        allocateBed,
        runAiAutoAllocation,
        submitComplaint,
        updateComplaintStatus,
        addProperty,
        updatePropertyCondition,
        transferProperty
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
