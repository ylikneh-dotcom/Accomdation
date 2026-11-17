import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { OfficialStudentRecord, College, Department, User, UserRole } from '../../types';
import { 
  Users, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Building, 
  BookOpen, 
  Settings, 
  Search, 
  Database, 
  Activity, 
  UserPlus, 
  ShieldCheck, 
  BarChart3,
  Layers,
  Edit,
  X,
  Phone,
  Mail,
  Check,
  Building2,
  Wrench,
  Package,
  UserCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const SuperAdminDashboard: React.FC = () => {
  const { 
    officialStudents, 
    colleges, 
    departments, 
    batches, 
    semesters, 
    dormitories, 
    properties, 
    complaints, 
    applications,
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
    updateStaffUser
  } = useAuth();
  const { language, t } = useLanguage();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'roster' | 'academics' | 'staff' | 'audit' | 'settings'>('analytics');

  // Search & Filter for Official Student Roster
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCollege, setFilterCollege] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Manual Add Student Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentNameEn, setNewStudentNameEn] = useState('');
  const [newStudentNameAm, setNewStudentNameAm] = useState('');
  const [newStudentCollege, setNewStudentCollege] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('');
  const [newStudentBatch, setNewStudentBatch] = useState('Batch 2024');
  const [newStudentSemester, setNewStudentSemester] = useState('Semester 1');
  const [newStudentGender, setNewStudentGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [manualAddError, setManualAddError] = useState('');

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<OfficialStudentRecord | null>(null);

  // Bulk Upload File State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadText, setUploadText] = useState('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Academic Structure State: Add College
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeAmharic, setNewCollegeAmharic] = useState('');
  const [newCollegeCode, setNewCollegeCode] = useState('');
  const [newCollegeDesc, setNewCollegeDesc] = useState('');
  const [collegeMsg, setCollegeMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Edit College Modal
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  // Academic Structure State: Add Dept
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptAmharic, setNewDeptAmharic] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptCollegeId, setNewDeptCollegeId] = useState(colleges[0]?.id || '');
  const [deptMsg, setDeptMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Edit Department Modal
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  // Staff Management State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffNameAm, setStaffNameAm] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('DORMITORY_MANAGER');
  const [staffAssignedDorm, setStaffAssignedDorm] = useState('');
  const [staffAssignedArea, setStaffAssignedArea] = useState('');
  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  // Edit Staff Modal State
  const [editingStaff, setEditingStaff] = useState<User | null>(null);

  // Quick Notification Toast
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  // Helper for bilingual display
  const getBilingualText = (enText?: string, amText?: string) => {
    if (language === 'am') {
      return amText || enText || '';
    }
    return enText || amText || '';
  };

  // Helper for student full name display
  const getStudentDisplayName = (s: OfficialStudentRecord) => {
    if (language === 'am') {
      return s.amharicName || s.fullName;
    }
    return s.fullName;
  };

  // Helper for college name display
  const getCollegeDisplayName = (colName: string) => {
    const col = colleges.find(c => c.name === colName);
    if (!col) return colName;
    return language === 'am' ? col.amharicName : col.name;
  };

  // Helper for department name display
  const getDeptDisplayName = (deptName: string) => {
    const dept = departments.find(d => d.name === deptName);
    if (!dept) return deptName;
    return language === 'am' ? dept.amharicName : dept.name;
  };

  // Filtered Students
  const filteredStudents = officialStudents.filter(s => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      s.fullName.toLowerCase().includes(query) ||
      (s.amharicName && s.amharicName.includes(query)) ||
      s.studentId.toLowerCase().includes(query) ||
      s.departmentName.toLowerCase().includes(query);
    const matchesCollege = filterCollege === 'ALL' || s.collegeName === filterCollege;
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchesSearch && matchesCollege && matchesStatus;
  });

  // Calculate high-level stats
  const totalOfficial = officialStudents.length;
  const verifiedCount = officialStudents.filter(s => s.status === 'VERIFIED').length;
  const flaggedCount = officialStudents.filter(s => s.status === 'FLAGGED').length;
  const registeredCount = officialStudents.filter(s => s.isRegistered).length;

  const totalBeds = dormitories.reduce((acc, d) => acc + d.totalBeds, 0);
  const occupiedBeds = dormitories.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const availableBeds = totalBeds - occupiedBeds;

  // Chart data: Students by College
  const studentsByCollegeData = colleges.map(col => {
    const count = officialStudents.filter(s => s.collegeName === col.name).length;
    return { 
      name: col.code, 
      fullName: language === 'am' ? col.amharicName : col.name, 
      count 
    };
  });

  // Chart data: Bed Occupancy
  const bedData = [
    { name: language === 'am' ? 'የተያዘ' : 'Occupied', value: occupiedBeds, color: '#0284c7' },
    { name: language === 'am' ? 'ክፍት' : 'Available', value: availableBeds, color: '#10b981' }
  ];

  // Handle Manual Student Add
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualAddError('');

    if (!newStudentId || !newStudentNameEn || !newStudentCollege || !newStudentDept) {
      setManualAddError(language === 'am' ? 'እባክዎ ሁሉንም አስፈላጊ መስኮች ይሙሉ::' : 'All required fields must be filled.');
      return;
    }

    if (officialStudents.some(s => s.studentId.toUpperCase() === newStudentId.trim().toUpperCase())) {
      setManualAddError(
        language === 'am' 
          ? `የተማሪ መታወቂያ ${newStudentId} ቀደም ሲል በመዝገቡ ውስጥ ይገኛል::`
          : `Duplicate Error: Student ID ${newStudentId} already exists in the official roster.`
      );
      return;
    }

    addOfficialStudentSingle({
      studentId: newStudentId.trim().toUpperCase(),
      fullName: newStudentNameEn.trim(),
      amharicName: newStudentNameAm.trim() || newStudentNameEn.trim(),
      collegeName: newStudentCollege,
      departmentName: newStudentDept,
      batch: newStudentBatch,
      semester: newStudentSemester,
      gender: newStudentGender,
      status: 'VERIFIED',
      notes: language === 'am' ? 'በዋና አስተዳዳሪ በእጅ የተመዘገበ' : 'Manually entered by Super Admin'
    });

    setShowAddStudentModal(false);
    setNewStudentId('');
    setNewStudentNameEn('');
    setNewStudentNameAm('');
    showToast(language === 'am' ? 'ተማሪው በተሳካ ሁኔታ ተመዝግቧል!' : 'Student added successfully to official roster!');
  };

  // Handle Student Edit Submit
  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateOfficialStudentRecord(editingStudent.id, {
      fullName: editingStudent.fullName,
      amharicName: editingStudent.amharicName,
      studentId: editingStudent.studentId,
      collegeName: editingStudent.collegeName,
      departmentName: editingStudent.departmentName,
      batch: editingStudent.batch,
      semester: editingStudent.semester,
      gender: editingStudent.gender,
      status: editingStudent.status,
      notes: editingStudent.notes
    });

    setEditingStudent(null);
    showToast(language === 'am' ? 'የተማሪው መረጃ ተሻሽሏል!' : 'Student record updated successfully!');
  };

  // Handle Bulk CSV upload
  const handleBulkUpload = () => {
    if (!uploadText.trim()) return;

    try {
      const lines = uploadText.trim().split('\n');
      const parsedRecords: OfficialStudentRecord[] = [];

      lines.forEach((line, index) => {
        if (index === 0 && line.toLowerCase().includes('student')) return;
        
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 4) {
          parsedRecords.push({
            id: `rec-imp-${Date.now()}-${index}`,
            studentId: parts[0] || `WU/2024/${100 + index}`,
            fullName: parts[1] || 'Student Name',
            amharicName: parts[2] || parts[1] || 'ተማሪ',
            collegeName: parts[3] || 'College of Engineering and Technology',
            departmentName: parts[4] || 'Software Engineering',
            batch: parts[5] || 'Batch 2024',
            semester: parts[6] || 'Semester 1',
            gender: (parts[7]?.toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE'),
            status: 'VERIFIED',
            isRegistered: false,
            uploadedAt: new Date().toISOString().split('T')[0],
            notes: 'Imported via CSV batch upload'
          });
        }
      });

      if (parsedRecords.length > 0) {
        addOfficialStudentsBulk(parsedRecords);
        setUploadSuccessMsg(
          language === 'am'
            ? `${parsedRecords.length} ይፋዊ የተማሪዎች መዝገብ በተሳካ ሁኔታ ተጭኗል!`
            : `Successfully imported ${parsedRecords.length} official student records!`
        );
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadText('');
          setUploadSuccessMsg('');
        }, 1200);
      }
    } catch (err) {
      alert(language === 'am' ? 'የፋይል ስህተት፡ እባክዎ በትክክለኛው የኮማ ቅርጸት ያስገቡ::' : 'Error parsing CSV format. Ensure comma-separated values.');
    }
  };

  // Export roster to CSV
  const exportToCSV = () => {
    const headers = 'Student ID,Full Name (EN),Full Name (AM),College,Department,Batch,Semester,Gender,Status,Is Registered\n';
    const rows = officialStudents.map(s => 
      `"${s.studentId}","${s.fullName}","${s.amharicName || s.fullName}","${s.collegeName}","${s.departmentName}","${s.batch}","${s.semester}","${s.gender}","${s.status}","${s.isRegistered}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wachemo_university_official_students_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Add College (EN and AM)
  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName || !newCollegeCode) return;
    addCollege({
      name: newCollegeName.trim(),
      amharicName: newCollegeAmharic.trim() || newCollegeName.trim(),
      code: newCollegeCode.trim().toUpperCase(),
      description: newCollegeDesc.trim(),
      isActive: true
    });
    setCollegeMsg({ 
      text: language === 'am' ? `${newCollegeName} ኮሌጅ በተሳካ ሁኔታ ተፈጥሯል!` : `College ${newCollegeName} created successfully!`, 
      error: false 
    });
    setNewCollegeName('');
    setNewCollegeCode('');
    setNewCollegeAmharic('');
    setNewCollegeDesc('');
  };

  // Edit College Submit
  const handleEditCollegeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollege) return;

    const res = updateCollege(editingCollege.id, {
      name: editingCollege.name.trim(),
      amharicName: editingCollege.amharicName.trim() || editingCollege.name.trim(),
      code: editingCollege.code.trim().toUpperCase(),
      description: editingCollege.description,
      isActive: editingCollege.isActive
    });

    setEditingCollege(null);
    showToast(res.message);
  };

  // Delete College with Rule 11 check
  const handleDeleteCollege = (id: string) => {
    const res = deleteCollege(id);
    setCollegeMsg({ text: res.message, error: !res.success });
    if (res.success) {
      showToast(res.message);
    }
  };

  // Add Department (EN and AM)
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCode || !newDeptCollegeId) return;
    const parentCol = colleges.find(c => c.id === newDeptCollegeId);
    if (!parentCol) return;

    addDepartment({
      collegeId: parentCol.id,
      collegeName: parentCol.name,
      name: newDeptName.trim(),
      amharicName: newDeptAmharic.trim() || newDeptName.trim(),
      code: newDeptCode.trim().toUpperCase(),
      isActive: true
    });
    setDeptMsg({ 
      text: language === 'am' ? `${newDeptName} ዲፓርትመንት በ${parentCol.amharicName} ስር ተፈጥሯል!` : `Department ${newDeptName} created under ${parentCol.name}!`, 
      error: false 
    });
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptAmharic('');
  };

  // Edit Department Submit
  const handleEditDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    const parentCol = colleges.find(c => c.id === editingDept.collegeId);
    const res = updateDepartment(editingDept.id, {
      name: editingDept.name.trim(),
      amharicName: editingDept.amharicName.trim() || editingDept.name.trim(),
      code: editingDept.code.trim().toUpperCase(),
      collegeId: editingDept.collegeId,
      collegeName: parentCol ? parentCol.name : editingDept.collegeName,
      isActive: editingDept.isActive
    });

    setEditingDept(null);
    showToast(res.message);
  };

  // Delete Department with Rule 11 check
  const handleDeleteDepartment = (id: string) => {
    const res = deleteDepartment(id);
    setDeptMsg({ text: res.message, error: !res.success });
    if (res.success) {
      showToast(res.message);
    }
  };

  // Add Staff User
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;

    addStaffUser({
      name: staffName.trim(),
      amharicName: staffNameAm.trim() || staffName.trim(),
      email: staffEmail.trim(),
      phone: staffPhone || '+251 911 000000',
      role: staffRole,
      assignedDormName: staffRole === 'DORMITORY_MANAGER' ? (staffAssignedDorm || 'Block 45 - Tewodros Hall (Men)') : undefined,
      assignedArea: staffAssignedArea || (staffRole === 'MAINTENANCE_STAFF' ? 'Electrical & Plumbing Section' : 'Central Office'),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });

    setStaffSuccessMsg(language === 'am' ? `ሰራተኛ ${staffName} ተመዝግቧል!` : `Staff member ${staffName} assigned to role!`);
    setTimeout(() => {
      setShowAddStaffModal(false);
      setStaffName('');
      setStaffNameAm('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffSuccessMsg('');
    }, 1200);
  };

  // Edit Staff Member Submit
  const handleEditStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    updateStaffUser(editingStaff.id, {
      name: editingStaff.name,
      amharicName: editingStaff.amharicName,
      email: editingStaff.email,
      phone: editingStaff.phone,
      role: editingStaff.role,
      assignedDormName: editingStaff.assignedDormName,
      assignedArea: editingStaff.assignedArea,
      status: editingStaff.status
    });

    setEditingStaff(null);
    showToast(language === 'am' ? 'የሰራተኛው መረጃ ተሻሽሏል!' : 'Staff details updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner with Campus Imagery */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-cyan-500/30 p-6 sm:p-8 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900/90 dark:to-[#0A1329] shadow-xl">
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: "url('/assets/images/campus_fountain.jpg')" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-500 dark:text-amber-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {t('admin.commandConsole')}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40">
                  {t('admin.fullPrivileges')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                {t('admin.commandSub')}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t('admin.uploadRoster')}</span>
            </button>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 font-semibold rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t('admin.addStudent')}</span>
            </button>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('admin.addStaff')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition cursor-pointer shrink-0 ${
            activeTab === 'analytics'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t('admin.analyticsTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition cursor-pointer shrink-0 ${
            activeTab === 'roster'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('admin.rosterTab')}</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
            {totalOfficial}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('academics')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition cursor-pointer shrink-0 ${
            activeTab === 'academics'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('admin.academicsTab')}</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            {colleges.length} / {departments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition cursor-pointer shrink-0 ${
            activeTab === 'staff'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{t('admin.staffTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition cursor-pointer shrink-0 ${
            activeTab === 'audit'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t('admin.auditTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition cursor-pointer shrink-0 ${
            activeTab === 'settings'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('admin.settingsTab')}</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ANALYTICS & HIGH LEVEL METRICS */}
      {/* ==================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{t('admin.totalOfficial')}</span>
                <Users className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalOfficial}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                {registeredCount} {t('admin.registeredActive')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{t('admin.flaggedDiscrepancies')}</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold text-amber-500 mt-2">{flaggedCount}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                {t('admin.reviewNeeded')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{t('admin.bedOccupancy')}</span>
                <Building className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                {Math.round((occupiedBeds / (totalBeds || 1)) * 100)}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-mono">
                {occupiedBeds} / {totalBeds} {language === 'am' ? 'አልጋዎች' : 'beds'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>{t('admin.registeredProperties')}</span>
                <Database className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{properties.length}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                {properties.filter(p => p.condition === 'EXCELLENT' || p.condition === 'GOOD').length} {t('admin.primeCondition')}
              </div>
            </div>
          </div>

          {/* Visual Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-cyan-500" />
                  <span>{language === 'am' ? 'የተማሪዎች ስርጭት በኮሌጆች' : 'Official Student Distribution by College'}</span>
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studentsByCollegeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name={language === 'am' ? 'የተማሪ ብዛት' : 'Students'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>{language === 'am' ? 'የዶርም አልጋዎች ምጣኔ' : 'Dormitory Bed Capacity & Availability'}</span>
                </h3>
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bedData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {bedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: OFFICIAL STUDENT ROSTER WITH EDIT & BILINGUAL */}
      {/* ==================================================== */}
      {activeTab === 'roster' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('table.searchPlaceholder')}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={filterCollege}
                onChange={(e) => setFilterCollege(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">{t('table.allColleges')}</option>
                {colleges.map(c => (
                  <option key={c.id} value={c.name}>
                    {language === 'am' ? c.amharicName : c.name} ({c.code})
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">{t('table.allStatuses')}</option>
                <option value="VERIFIED">{t('status.VERIFIED')}</option>
                <option value="FLAGGED">{t('status.FLAGGED')}</option>
                <option value="PENDING">{t('status.PENDING')}</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportToCSV}
                className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{t('btn.export')}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">{t('table.studentId')}</th>
                  <th className="py-3 px-4">{t('table.fullName')}</th>
                  <th className="py-3 px-4">{t('table.collegeDept')}</th>
                  <th className="py-3 px-4">{t('table.batchSem')}</th>
                  <th className="py-3 px-4">{t('table.status')}</th>
                  <th className="py-3 px-4">{t('table.account')}</th>
                  <th className="py-3 px-4 text-right">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      {language === 'am' ? 'ምንም የተማሪ መረጃ አልተገኘም::' : 'No student records matched the criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-700 dark:text-cyan-300">
                        {stu.studentId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {getStudentDisplayName(stu)}
                        </div>
                        {language === 'am' && stu.fullName !== stu.amharicName && (
                          <div className="text-[10px] text-slate-400 font-sans">{stu.fullName}</div>
                        )}
                        {language === 'en' && stu.amharicName && (
                          <div className="text-[10px] text-slate-400 font-sans">{stu.amharicName}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {getDeptDisplayName(stu.departmentName)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {getCollegeDisplayName(stu.collegeName)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{stu.batch}</div>
                        <div className="text-[10px] text-slate-500">{stu.semester}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stu.status === 'VERIFIED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                            : stu.status === 'FLAGGED'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {t(`status.${stu.status}`)}
                        </span>
                        {stu.notes && stu.status === 'FLAGGED' && (
                          <div className="text-[9px] text-amber-600 dark:text-amber-400/80 mt-0.5">{stu.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {stu.isRegistered ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t('table.activePortal')}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">{t('table.notRegistered')}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          {/* Edit Student Button */}
                          <button
                            onClick={() => setEditingStudent({ ...stu })}
                            className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 rounded transition cursor-pointer"
                            title={t('btn.edit')}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {stu.status === 'FLAGGED' && (
                            <button
                              onClick={() => {
                                updateOfficialStudentStatus(stu.id, 'VERIFIED');
                                showToast(language === 'am' ? 'የተማሪው መረጃ ጸድቋል!' : 'Student verified successfully!');
                              }}
                              className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 rounded text-[10px] hover:bg-emerald-200 transition cursor-pointer"
                              title="Approve Flagged Record"
                            >
                              {t('btn.approve')}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm(language === 'am' ? 'ይህ የተማሪ መዝገብ ይሰረዝ?' : `Delete official record for ${stu.fullName}?`)) {
                                deleteOfficialStudent(stu.id);
                                showToast(language === 'am' ? 'ተማሪው ተሰርዟል!' : 'Student record deleted!');
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition cursor-pointer"
                            title={t('btn.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ACADEMIC STRUCTURE — EDITABLE COLLEGES & DEPTS */}
      {/* ==================================================== */}
      {activeTab === 'academics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          
          {/* Colleges Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{t('acad.collegesTitle')}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono font-bold">{colleges.length} {t('acad.departments')}</span>
            </div>

            {collegeMsg && (
              <div className={`p-2.5 rounded-lg text-xs ${collegeMsg.error ? 'bg-red-50 dark:bg-red-950/80 border border-red-300 text-red-700 dark:text-red-300' : 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-700 dark:text-emerald-300'}`}>
                {collegeMsg.text}
              </div>
            )}

            {/* Add College Form */}
            <form onSubmit={handleAddCollege} className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>{t('acad.addCollege')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={t('acad.collegeNameEn')}
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder={t('acad.collegeCode')}
                  value={newCollegeCode}
                  onChange={(e) => setNewCollegeCode(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white uppercase font-mono"
                  required
                />
              </div>
              <input
                type="text"
                placeholder={t('acad.collegeNameAm')}
                value={newCollegeAmharic}
                onChange={(e) => setNewCollegeAmharic(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition shadow-sm cursor-pointer"
              >
                {t('acad.createCollegeBtn')}
              </button>
            </form>

            {/* Colleges List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {colleges.map((col) => {
                const deptsUnder = departments.filter(d => d.collegeId === col.id);
                const studentsUnder = officialStudents.filter(s => s.collegeName === col.name);
                return (
                  <div key={col.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between hover:border-cyan-400 transition">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center space-x-2">
                        <span className="truncate">{language === 'am' ? col.amharicName : col.name}</span>
                        <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-1.5 rounded border border-cyan-200 dark:border-cyan-800 shrink-0">
                          {col.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {language === 'am' ? col.name : col.amharicName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">
                        {deptsUnder.length} {t('acad.departments')} • {studentsUnder.length} {t('acad.activeStudents')}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {/* Edit College Button */}
                      <button
                        onClick={() => setEditingCollege({ ...col })}
                        className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 rounded transition cursor-pointer"
                        title={t('btn.edit')}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete College Button */}
                      <button
                        onClick={() => handleDeleteCollege(col.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition cursor-pointer"
                        title={t('btn.delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Departments Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('acad.departmentsTitle')}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono font-bold">{departments.length} {language === 'am' ? 'ዲፓርትመንቶች' : 'Departments'}</span>
            </div>

            {deptMsg && (
              <div className={`p-2.5 rounded-lg text-xs ${deptMsg.error ? 'bg-red-50 dark:bg-red-950/80 border border-red-300 text-red-700 dark:text-red-300' : 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-700 dark:text-emerald-300'}`}>
                {deptMsg.text}
              </div>
            )}

            {/* Add Department Form */}
            <form onSubmit={handleAddDepartment} className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>{t('acad.addDept')}</span>
              </div>
              <select
                value={newDeptCollegeId}
                onChange={(e) => setNewDeptCollegeId(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                required
              >
                {colleges.map(c => (
                  <option key={c.id} value={c.id}>
                    {language === 'am' ? c.amharicName : c.name} ({c.code})
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={t('acad.deptNameEn')}
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  placeholder={t('acad.deptCode')}
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white uppercase font-mono"
                  required
                />
              </div>
              <input
                type="text"
                placeholder={t('acad.deptNameAm')}
                value={newDeptAmharic}
                onChange={(e) => setNewDeptAmharic(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-sm cursor-pointer"
              >
                {t('acad.createDeptBtn')}
              </button>
            </form>

            {/* Departments List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {departments.map((dept) => {
                const studentsIn = officialStudents.filter(s => s.departmentName === dept.name);
                return (
                  <div key={dept.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between hover:border-emerald-400 transition">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center space-x-2">
                        <span className="truncate">{language === 'am' ? dept.amharicName : dept.name}</span>
                        <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                          {dept.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-600 dark:text-cyan-400/80 truncate">
                        {getCollegeDisplayName(dept.collegeName)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {studentsIn.length} {t('acad.activeStudents')}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {/* Edit Department Button */}
                      <button
                        onClick={() => setEditingDept({ ...dept })}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition cursor-pointer"
                        title={t('btn.edit')}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Department Button */}
                      <button
                        onClick={() => handleDeleteDepartment(dept.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition cursor-pointer"
                        title={t('btn.delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: STAFF MANAGEMENT — SUPER ADMIN CONTROL & VISIBILITY */}
      {/* ==================================================== */}
      {activeTab === 'staff' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('staff.title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('staff.subtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer w-fit"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('admin.addStaff')}</span>
            </button>
          </div>

          {/* ROLE CATEGORY SECTIONS WITH VISIBILITY OF RESPONSIBILITIES */}
          {([
            {
              role: 'DORMITORY_MANAGER' as UserRole,
              title: t('staff.dormManagers'),
              description: t('staff.dormManagersDesc'),
              icon: Building2,
              workloadTitle: language === 'am' ? 'የሚተዳደሩ ህንጻዎችና ዶርሞች' : 'Assigned Dormitory & Occupancy Overview',
              color: 'indigo',
              borderColor: 'border-indigo-200 dark:border-indigo-500/30',
              headerBg: 'bg-indigo-50 dark:bg-indigo-950/40',
              iconColor: 'text-indigo-600 dark:text-indigo-400',
              badgeBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/40'
            },
            {
              role: 'ACCOMMODATION_OFFICER' as UserRole,
              title: t('staff.accomOfficers'),
              description: t('staff.accomOfficersDesc'),
              icon: UserCheck,
              workloadTitle: language === 'am' ? 'የተማሪዎች ማመልከቻና የአልጋ ምደባ ቁጥጥር' : 'Application Reviews & AI Placement Governance',
              color: 'emerald',
              borderColor: 'border-emerald-200 dark:border-emerald-500/30',
              headerBg: 'bg-emerald-50 dark:bg-emerald-950/40',
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              badgeBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40'
            },
            {
              role: 'PROPERTY_MANAGER' as UserRole,
              title: t('staff.propManagers'),
              description: t('staff.propManagersDesc'),
              icon: Package,
              workloadTitle: language === 'am' ? 'የካምፓስ ቋሚ ንብረቶችና የኢንቬንቶሪ ኦዲት' : 'Campus Asset Portfolio & Audit Telemetry',
              color: 'purple',
              borderColor: 'border-purple-200 dark:border-purple-500/30',
              headerBg: 'bg-purple-50 dark:bg-purple-950/40',
              iconColor: 'text-purple-600 dark:text-purple-400',
              badgeBg: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-400 border-purple-300 dark:border-purple-500/40'
            },
            {
              role: 'MAINTENANCE_STAFF' as UserRole,
              title: t('staff.maintEngineers'),
              description: t('staff.maintEngineersDesc'),
              icon: Wrench,
              workloadTitle: language === 'am' ? 'የጥገና ጥያቄዎችና የስራ አፈጻጸም' : 'Assigned Repair Tickets & Active Work Orders',
              color: 'orange',
              borderColor: 'border-orange-200 dark:border-orange-500/30',
              headerBg: 'bg-orange-50 dark:bg-orange-950/40',
              iconColor: 'text-orange-600 dark:text-orange-400',
              badgeBg: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-400 border-orange-300 dark:border-orange-500/40'
            }
          ] as const).map((category) => {
            const staffInRole = allUsers.filter(u => u.role === category.role);
            const IconComponent = category.icon;

            return (
              <div key={category.role} className={`rounded-2xl border ${category.borderColor} bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden`}>
                
                {/* Header */}
                <div className={`${category.headerBg} px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b ${category.borderColor}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 ${category.iconColor} border ${category.borderColor} shadow-sm shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{category.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${category.badgeBg}`}>
                      {staffInRole.length} {language === 'am' ? 'ሰራተኞች' : 'Staff'}
                    </span>
                    <button
                      onClick={() => {
                        setStaffRole(category.role);
                        setShowAddStaffModal(true);
                      }}
                      className={`p-1.5 rounded-lg ${category.iconColor} hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition cursor-pointer`}
                      title="Add new staff member"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Staff List & Manager Responsibility Controls */}
                {staffInRole.length === 0 ? (
                  <div className="px-5 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    {language === 'am'
                      ? 'ለዚህ ሚና ምንም ሰራተኛ አልተመደበም::'
                      : 'No staff members assigned to this category yet.'}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {staffInRole.map((staff) => (
                      <div key={staff.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        
                        {/* Profile Info */}
                        <div className="flex items-start space-x-3.5">
                          <img 
                            src={staff.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                            alt={staff.name} 
                            className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {language === 'am' ? (staff.amharicName || staff.name) : staff.name}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                staff.status === 'ACTIVE'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                                  : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-500/40'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${staff.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {staff.status === 'ACTIVE' ? t('status.ACTIVE') : t('status.SUSPENDED')}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center space-x-1 font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                                <Mail className="w-3 h-3" />
                                <span>{staff.email}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{staff.phone || '+251 911 000000'}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Operational Responsibilities Visibility */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs flex-1 max-w-lg">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {category.workloadTitle}
                          </div>
                          
                          {category.role === 'DORMITORY_MANAGER' && (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-indigo-700 dark:text-indigo-400">
                                  {staff.assignedDormName || 'Block 45 - Tewodros Hall (Men)'}
                                </span>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  48 {language === 'am' ? 'ክፍሎች' : 'Rooms'} • 192 {language === 'am' ? 'አልጋዎች' : 'Beds'} (148 {language === 'am' ? 'የተያዙ' : 'Occupied'})
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                77% {language === 'am' ? 'የተያዘ' : 'Occupied'}
                              </span>
                            </div>
                          )}

                          {category.role === 'ACCOMMODATION_OFFICER' && (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                  {staff.assignedArea || 'Central Placement Directorate'}
                                </span>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {applications.length} {language === 'am' ? 'የመኖሪያ ማመልከቻዎች' : 'Applications Processed'} • 98% AI Match
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Active Quota
                              </span>
                            </div>
                          )}

                          {category.role === 'PROPERTY_MANAGER' && (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-purple-700 dark:text-purple-400">
                                  {staff.assignedArea || 'Campus Central Inventory Store'}
                                </span>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {properties.length} {language === 'am' ? 'ቋሚ ንብረቶች' : 'Campus Assets Tracked'} • 1 Needs Audit
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                Audited
                              </span>
                            </div>
                          )}

                          {category.role === 'MAINTENANCE_STAFF' && (
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-orange-700 dark:text-orange-400">
                                  {staff.assignedArea || 'Electrical & Plumbing Section'}
                                </span>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {complaints.length} {language === 'am' ? 'የጥገና ጥያቄዎች' : 'Active Work Orders'} ({complaints.filter(c => c.status === 'COMPLETED').length} {language === 'am' ? 'የተጠናቀቁ' : 'Completed'})
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                                On Duty
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Admin Action Controls */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {/* Edit Details Button */}
                          <button
                            onClick={() => setEditingStaff({ ...staff })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-xs flex items-center space-x-1 transition cursor-pointer"
                            title={t('staff.editStaff')}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>{t('btn.edit')}</span>
                          </button>

                          {/* Toggle Active / Suspended Button */}
                          <button
                            onClick={() => {
                              const newStatus = staff.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
                              updateStaffUser(staff.id, { status: newStatus as any });
                              showToast(
                                language === 'am' 
                                  ? `${staff.name} አሁን ${newStatus === 'ACTIVE' ? 'ገቢር' : 'የታገደ'} ሆኗል!` 
                                  : `${staff.name} is now ${newStatus}!`
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                              staff.status === 'ACTIVE'
                                ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                                : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40'
                            }`}
                          >
                            {staff.status === 'ACTIVE' ? t('staff.suspend') : t('staff.activate')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: AUDIT TRAIL */}
      {/* ==================================================== */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{language === 'am' ? 'የሲስተም እንቅስቃሴ መዝገብ' : 'Comprehensive System Audit Log'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">{auditLogs.length} Records</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 text-slate-500">{log.timestamp}</td>
                    <td className="py-2.5 px-4 font-bold text-cyan-700 dark:text-cyan-300">{log.userName} ({log.userRole})</td>
                    <td className="py-2.5 px-4 text-amber-600 dark:text-amber-300 font-bold">{log.action}</td>
                    <td className="py-2.5 px-4 text-slate-800 dark:text-slate-300 font-sans text-xs">{log.details}</td>
                    <td className="py-2.5 px-4 text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: SETTINGS & DATABASE BACKUP */}
      {/* ==================================================== */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in max-w-3xl shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Settings className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{language === 'am' ? 'የዋቸሞ ዩኒቨርሲቲ ሲስተም ቅንብሮች' : 'Wachemo University System & Database Settings'}</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{language === 'am' ? 'የተቋም ስም' : 'University Name'}</div>
                <div className="text-slate-500 dark:text-slate-400">Wachemo University (ዋቸሞ ዩኒቨርሲቲ)</div>
              </div>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">Hosanna, Ethiopia</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{language === 'am' ? 'የአካዳሚክ ዓመት' : 'Current Academic Year'}</div>
                <div className="text-slate-500 dark:text-slate-400">2024/2025 G.C. (2017 E.C.)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{language === 'am' ? 'የዳታቤዝ ጥበቃና ባክአፕ' : 'Database Backup & Security'}</div>
                <div className="text-slate-500 dark:text-slate-400">PostgreSQL 17 Central Instance • Encrypted Automated Snapshots</div>
              </div>
              <button
                onClick={() => alert(language === 'am' ? 'የዳታቤዝ ባክአፕ ተፈጥሯል: wachemo_backup_snapshot.sql (መጠን: 42.8 MB)' : 'Database Snapshot Generated: wachemo_backup_snapshot.sql (Size: 42.8 MB)')}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xs transition cursor-pointer"
              >
                {language === 'am' ? 'ባክአፕ ፍጠር' : 'Create Backup Snapshot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT COLLEGE (EN & AM) */}
      {/* ==================================================== */}
      {editingCollege && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{t('acad.editCollege')}</span>
              </h3>
              <button onClick={() => setEditingCollege(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditCollegeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {t('acad.collegeNameEn')} *
                </label>
                <input
                  type="text"
                  value={editingCollege.name}
                  onChange={(e) => setEditingCollege({ ...editingCollege, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {t('acad.collegeNameAm')} *
                </label>
                <input
                  type="text"
                  value={editingCollege.amharicName}
                  onChange={(e) => setEditingCollege({ ...editingCollege, amharicName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {t('acad.collegeCode')} *
                  </label>
                  <input
                    type="text"
                    value={editingCollege.code}
                    onChange={(e) => setEditingCollege({ ...editingCollege, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {t('table.status')}
                  </label>
                  <select
                    value={editingCollege.isActive ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) => setEditingCollege({ ...editingCollege, isActive: e.target.value === 'ACTIVE' })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                  >
                    <option value="ACTIVE">{t('status.ACTIVE')}</option>
                    <option value="INACTIVE">{t('status.SUSPENDED')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {t('acad.description')}
                </label>
                <textarea
                  rows={2}
                  value={editingCollege.description}
                  onChange={(e) => setEditingCollege({ ...editingCollege, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCollege(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold cursor-pointer"
                >
                  {t('btn.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-sm cursor-pointer"
                >
                  {t('acad.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT DEPARTMENT (EN & AM) */}
      {/* ==================================================== */}
      {editingDept && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('acad.editDept')}</span>
              </h3>
              <button onClick={() => setEditingDept(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditDepartmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {t('acad.parentCollege')} *
                </label>
                <select
                  value={editingDept.collegeId}
                  onChange={(e) => setEditingDept({ ...editingDept, collegeId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>
                      {language === 'am' ? c.amharicName : c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {t('acad.deptNameEn')} *
                </label>
                <input
                  type="text"
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {t('acad.deptNameAm')} *
                </label>
                <input
                  type="text"
                  value={editingDept.amharicName}
                  onChange={(e) => setEditingDept({ ...editingDept, amharicName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {t('acad.deptCode')} *
                  </label>
                  <input
                    type="text"
                    value={editingDept.code}
                    onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {t('table.status')}
                  </label>
                  <select
                    value={editingDept.isActive ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) => setEditingDept({ ...editingDept, isActive: e.target.value === 'ACTIVE' })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                  >
                    <option value="ACTIVE">{t('status.ACTIVE')}</option>
                    <option value="INACTIVE">{t('status.SUSPENDED')}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold cursor-pointer"
                >
                  {t('btn.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-sm cursor-pointer"
                >
                  {t('acad.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT STUDENT (EN & AM) */}
      {/* ==================================================== */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{language === 'am' ? 'የተማሪ መረጃ ማሻሻያ' : 'Edit Official Student Record'}</span>
              </h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditStudentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('table.studentId')} *</label>
                  <input
                    type="text"
                    value={editingStudent.studentId}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('table.gender')}</label>
                  <select
                    value={editingStudent.gender}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="MALE">{t('gender.MALE')}</option>
                    <option value="FEMALE">{t('gender.FEMALE')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በእንግሊዝኛ)' : 'Full Name (English)'} *</label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በአማርኛ)' : 'Full Name (Amharic)'} *</label>
                <input
                  type="text"
                  value={editingStudent.amharicName || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, amharicName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('auth.college')} *</label>
                <select
                  value={editingStudent.collegeName}
                  onChange={(e) => {
                    const col = e.target.value;
                    const validDepts = departments.filter(d => d.collegeName === col);
                    setEditingStudent({ 
                      ...editingStudent, 
                      collegeName: col,
                      departmentName: validDepts[0]?.name || editingStudent.departmentName 
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.name}>
                      {language === 'am' ? c.amharicName : c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('auth.department')} *</label>
                <select
                  value={editingStudent.departmentName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, departmentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  required
                >
                  {departments
                    .filter(d => d.collegeName === editingStudent.collegeName)
                    .map(d => (
                      <option key={d.id} value={d.name}>
                        {language === 'am' ? d.amharicName : d.name} ({d.code})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('auth.batch')}</label>
                  <select
                    value={editingStudent.batch}
                    onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('table.status')}</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                  >
                    <option value="VERIFIED">{t('status.VERIFIED')}</option>
                    <option value="FLAGGED">{t('status.FLAGGED')}</option>
                    <option value="PENDING">{t('status.PENDING')}</option>
                    <option value="REJECTED">{t('status.REJECTED')}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold cursor-pointer"
                >
                  {t('btn.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-sm cursor-pointer"
                >
                  {t('btn.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDIT STAFF USER (ASSIGN BUILDING & RESPONSIBILITIES) */}
      {/* ==================================================== */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Edit className="w-4 h-4 text-amber-500" />
                <span>{t('staff.editStaff')}</span>
              </h3>
              <button onClick={() => setEditingStaff(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditStaffSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በእንግሊዝኛ)' : 'Full Name (English)'} *</label>
                  <input
                    type="text"
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በአማርኛ)' : 'Full Name (Amharic)'}</label>
                  <input
                    type="text"
                    value={editingStaff.amharicName || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, amharicName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Email *</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Phone</label>
                  <input
                    type="text"
                    value={editingStaff.phone || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Assigned Building (For Dormitory Managers) */}
              {editingStaff.role === 'DORMITORY_MANAGER' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {t('staff.assignedDorm')} *
                  </label>
                  <select
                    value={editingStaff.assignedDormName || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, assignedDormName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                  >
                    {dormitories.map(d => (
                      <option key={d.id} value={d.name}>
                        {language === 'am' ? d.amharicName : d.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Assigned Area / Directorate */}
              {editingStaff.role !== 'DORMITORY_MANAGER' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {t('staff.assignedArea')} *
                  </label>
                  <input
                    type="text"
                    value={editingStaff.assignedArea || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, assignedArea: e.target.value })}
                    placeholder="e.g. Campus Central Inventory Store"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('table.status')}</label>
                <select
                  value={editingStaff.status || 'ACTIVE'}
                  onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold"
                >
                  <option value="ACTIVE">{t('status.ACTIVE')}</option>
                  <option value="SUSPENDED">{t('status.SUSPENDED')}</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold cursor-pointer"
                >
                  {t('btn.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow-sm cursor-pointer"
                >
                  {t('btn.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD STUDENT MANUALLY (EN & AM) */}
      {/* ==================================================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{t('admin.addStudent')}</span>
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {manualAddError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/80 border border-red-300 text-red-700 dark:text-red-300 rounded text-xs">
                {manualAddError}
              </div>
            )}

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('table.studentId')} *</label>
                  <input
                    type="text"
                    placeholder="e.g. WU/2024/099"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('table.gender')}</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as any)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  >
                    <option value="MALE">{t('gender.MALE')}</option>
                    <option value="FEMALE">{t('gender.FEMALE')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በእንግሊዝኛ)' : 'Full Name (English)'} *</label>
                <input
                  type="text"
                  placeholder="e.g. Kasahun Worku Tola"
                  value={newStudentNameEn}
                  onChange={(e) => setNewStudentNameEn(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በአማርኛ)' : 'Full Name (Amharic)'} *</label>
                <input
                  type="text"
                  placeholder="e.g. ካሳሁን ወርቁ ቶላ"
                  value={newStudentNameAm}
                  onChange={(e) => setNewStudentNameAm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('auth.college')} *</label>
                <select
                  value={newStudentCollege}
                  onChange={(e) => {
                    setNewStudentCollege(e.target.value);
                    const validDepts = departments.filter(d => d.collegeName === e.target.value);
                    setNewStudentDept(validDepts[0]?.name || '');
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                >
                  <option value="">-- {t('auth.college')} --</option>
                  {colleges.map(c => (
                    <option key={c.id} value={c.name}>
                      {language === 'am' ? c.amharicName : c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('auth.department')} *</label>
                <select
                  value={newStudentDept}
                  onChange={(e) => setNewStudentDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                >
                  <option value="">-- {t('auth.department')} --</option>
                  {departments
                    .filter(d => !newStudentCollege || d.collegeName === newStudentCollege)
                    .map(d => (
                      <option key={d.id} value={d.name}>
                        {language === 'am' ? d.amharicName : d.name} ({d.code})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('auth.batch')}</label>
                  <select
                    value={newStudentBatch}
                    onChange={(e) => setNewStudentBatch(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  >
                    {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('auth.semester')}</label>
                  <select
                    value={newStudentSemester}
                    onChange={(e) => setNewStudentSemester(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  >
                    {semesters.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded font-semibold cursor-pointer"
                >
                  {t('btn.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-sm cursor-pointer"
                >
                  {t('btn.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: BULK CSV UPLOAD */}
      {/* ==================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{t('admin.uploadRoster')}</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 rounded text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Format: <span className="font-mono text-cyan-700 dark:text-cyan-300">StudentID, FullName(EN), FullName(AM), College, Department, Batch, Semester, Gender</span>
            </div>

            <textarea
              rows={6}
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
              placeholder={`WU/2024/050, Ermias Alemu Desta, ኤርሚያስ አለሙ ደስታ, College of Engineering and Technology, Software Engineering, Batch 2024, Semester 1, Male\nWU/2024/051, Hanna Girma Tsegaye, ሃና ግርማ ፀጋዬ, College of Natural and Computational Sciences, Computer Science, Batch 2024, Semester 1, Female`}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-cyan-500"
            />

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setUploadText(`WU/2024/060, Betelhem Tefera, ቤተልሔም ተፈራ, College of Engineering and Technology, Software Engineering, Batch 2024, Semester 1, Female\nWU/2024/061, Kalkidan Bekele, ቃልኪዳን በቀለ, College of Business and Economics, Accounting and Finance, Batch 2024, Semester 1, Female\nWU/2024/062, Natnael Getnet, ናትናኤል ጌትነት, College of Medicine and Health Sciences, Public Health, Batch 2024, Semester 1, Male`)}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Insert Sample Batch Data
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold cursor-pointer"
                >
                  {t('btn.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleBulkUpload}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded text-xs shadow-sm cursor-pointer"
                >
                  Parse & Import Records
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD STAFF USER */}
      {/* ==================================================== */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-amber-500" />
                <span>{t('admin.addStaff')}</span>
              </h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {staffSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs rounded">
                {staffSuccessMsg}
              </div>
            )}

            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በእንግሊዝኛ)' : 'Staff Full Name (English)'} *</label>
                <input
                  type="text"
                  placeholder="e.g. Proctor Almaz Negash"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{language === 'am' ? 'ሙሉ ስም (በአማርኛ)' : 'Staff Full Name (Amharic)'} *</label>
                <input
                  type="text"
                  placeholder="e.g. ፕሮክተር አልማዝ ነጋሽ"
                  value={staffNameAm}
                  onChange={(e) => setStaffNameAm(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Official Email *</label>
                <input
                  type="email"
                  placeholder="e.g. almaz.n@wachemo.edu.et"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">Phone Number</label>
                <input
                  type="text"
                  placeholder="+251 911 000000"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('nav.role')} *</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white font-semibold"
                >
                  <option value="DORMITORY_MANAGER">{t('role.DORMITORY_MANAGER')}</option>
                  <option value="ACCOMMODATION_OFFICER">{t('role.ACCOMMODATION_OFFICER')}</option>
                  <option value="PROPERTY_MANAGER">{t('role.PROPERTY_MANAGER')}</option>
                  <option value="MAINTENANCE_STAFF">{t('role.MAINTENANCE_STAFF')}</option>
                </select>
              </div>

              {staffRole === 'DORMITORY_MANAGER' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('staff.assignedDorm')} *</label>
                  <select
                    value={staffAssignedDorm}
                    onChange={(e) => setStaffAssignedDorm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white font-bold"
                  >
                    {dormitories.map(d => (
                      <option key={d.id} value={d.name}>
                        {language === 'am' ? d.amharicName : d.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {staffRole !== 'DORMITORY_MANAGER' && (
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">{t('staff.assignedArea')} *</label>
                  <input
                    type="text"
                    value={staffAssignedArea}
                    onChange={(e) => setStaffAssignedArea(e.target.value)}
                    placeholder="e.g. Central Accommodation Unit"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-semibold cursor-pointer"
                >
                  {t('btn.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded shadow-sm cursor-pointer"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
