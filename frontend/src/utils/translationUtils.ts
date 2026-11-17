import { College, Department, Dormitory, OfficialStudentRecord, UserRole } from '../types';

export type SupportedLanguage = 'en' | 'am';

/**
 * Returns either English or Amharic text based on current language
 */
export const getBilingual = (
  language: SupportedLanguage,
  enText?: string,
  amText?: string
): string => {
  if (language === 'am') {
    return amText || enText || '';
  }
  return enText || amText || '';
};

/**
 * Known student name translations mapping
 */
const STUDENT_AMHARIC_MAP: Record<string, string> = {
  'Abebe Kebede Tadesse': 'አበበ ከበደ ታደሰ',
  'Abebe Kebede': 'አበበ ከበደ ታደሰ',
  'Tigist Haile Mengistu': 'ትዕግስት ኃይሌ መንግስቱ',
  'Tigist Haile': 'ትዕግስት ኃይሌ መንግስቱ',
  'Daniel Getachew Bekele': 'ዳንኤል ጌታቸው በቀለ',
  'Daniel Getachew': 'ዳንኤል ጌታቸው በቀለ',
  'Meron Alemayehu Zewde': 'ሜሮን አለማየሁ ዘውዴ',
  'Meron Alemayehu': 'ሜሮን አለማየሁ ዘውዴ',
  'Yonas Berhanu Tefera': 'ዮናስ ብርሃኑ ተፈራ',
  'Yonas Berhanu': 'ዮናስ ብርሃኑ ተፈራ',
  'Selamawit Desta Kassa': 'ሰላማዊት ደስታ ካሳ',
  'Selamawit Desta': 'ሰላማዊት ደስታ ካሳ',
  'Biruk Wolde Gidey': 'ብሩክ ወልዴ ጊደይ',
  'Biruk Wolde': 'ብሩክ ወልዴ ጊደይ',
  'Chala Demissie': 'ጫላ ደሚሴ',
  'Kidus Yohannes': 'ቅዱስ ዮሐንስ',
  'Henok Tilahun': 'ሄኖክ ጥላሁን',
  'Samuel Alemu': 'ሳሙኤል አለሙ',
  'Mulugeta Kassa': 'ሙሉጌታ ካሳ',
  'Nigus Haile': 'ንጉስ ኃይሌ',
  'Eyob Solomon': 'እዮብ ሰለሞን',
  'Natnael Girma': 'ናትናኤል ግርማ',
  'Binyam Fikre': 'ቢንያም ፍቅሬ',
  'Proctor Tariku': 'ፕሮክተር ታሪኩ',
  'Tariku Mengistu': 'ታሪኩ መንግስቱ',
  'Genet Assefa': 'ገነት አሰፋ',
  'Solomon Tadesse': 'ሰለሞን ታደሰ',
  'Engineer Dawit Girma': 'ኢንጂነር ዳዊት ግርማ',
  'Dawit Girma': 'ዳዊት ግርማ',
  'Dr. Habtamu Belay': 'ዶ/ር ሀብታሙ በላይ',
};

/**
 * Returns translated student full name
 */
export const getStudentName = (
  language: SupportedLanguage,
  nameOrId: string,
  officialStudents: OfficialStudentRecord[] = []
): string => {
  if (!nameOrId) return '';
  if (language !== 'am') {
    // If English, return matched fullName if available or the string
    const match = officialStudents.find(
      s => s.studentId.toUpperCase() === nameOrId.toUpperCase() || s.fullName.toLowerCase() === nameOrId.toLowerCase()
    );
    return match ? match.fullName : nameOrId;
  }

  // Look up in official student roster first
  const match = officialStudents.find(
    s => s.studentId.toUpperCase() === nameOrId.toUpperCase() ||
      s.fullName.toLowerCase() === nameOrId.toLowerCase() ||
      (s.amharicName && s.amharicName.includes(nameOrId))
  );

  if (match && match.amharicName) {
    return match.amharicName;
  }

  // Look up in static map
  if (STUDENT_AMHARIC_MAP[nameOrId]) {
    return STUDENT_AMHARIC_MAP[nameOrId];
  }

  // Partial match in static map
  for (const [en, am] of Object.entries(STUDENT_AMHARIC_MAP)) {
    if (nameOrId.includes(en) || en.includes(nameOrId)) {
      return am;
    }
  }

  return nameOrId;
};

/**
 * Known college Amharic mappings
 */
const COLLEGE_AMHARIC_MAP: Record<string, string> = {
  'College of Engineering and Technology': 'ኢንጂነሪንግና ቴክኖሎጂ ኮሌጅ',
  'ENGTECH': 'ኢንጂነሪንግና ቴክኖሎጂ ኮሌጅ',
  'College of Natural and Computational Sciences': 'የተፈጥሮና ኮምፒውቴሽናል ሳይንስ ኮሌጅ',
  'CNCS': 'የተፈጥሮና ኮምፒውቴሽናል ሳይንስ ኮሌጅ',
  'College of Medicine and Health Sciences': 'የሕክምናና ጤና ሳይንስ ኮሌጅ',
  'CMHS': 'የሕክምናና ጤና ሳይንስ ኮሌጅ',
  'College of Business and Economics': 'ቢዝነስና ኢኮኖሚክስ ኮሌጅ',
  'CBE': 'ቢዝነስና ኢኮኖሚክስ ኮሌጅ',
  'College of Agricultural Sciences': 'የግብርና ሳይንስ ኮሌጅ',
  'AGRI': 'የግብርና ሳይንስ ኮሌጅ'
};

/**
 * Returns translated college name
 */
export const getCollegeName = (
  language: SupportedLanguage,
  collegeNameOrCode: string,
  colleges: College[] = []
): string => {
  if (!collegeNameOrCode) return '';
  if (language !== 'am') {
    const col = colleges.find(c => c.name === collegeNameOrCode || c.code === collegeNameOrCode);
    return col ? col.name : collegeNameOrCode;
  }

  const col = colleges.find(c => c.name === collegeNameOrCode || c.code === collegeNameOrCode);
  if (col && col.amharicName) {
    return col.amharicName;
  }

  return COLLEGE_AMHARIC_MAP[collegeNameOrCode] || collegeNameOrCode;
};

/**
 * Known department Amharic mappings
 */
const DEPT_AMHARIC_MAP: Record<string, string> = {
  'Software Engineering': 'ሶፍትዌር ኢንጂነሪንግ',
  'SE': 'ሶፍትዌር ኢንጂነሪንግ',
  'Electrical & Computer Engineering': 'ኤሌክትሪካልና ኮምፒውተር ኢንጂነሪንግ',
  'ECE': 'ኤሌክትሪካልና ኮምፒውተር ኢንጂነሪንግ',
  'Mechanical Engineering': 'ሜካኒካል ኢንጂነሪንግ',
  'ME': 'ሜካኒካል ኢንጂነሪንግ',
  'Civil Engineering': 'ሲቪል ኢንጂነሪንግ',
  'CE': 'ሲቪል ኢንጂነሪንግ',
  'Computer Science': 'ኮምፒውተር ሳይንስ',
  'CS': 'ኮምፒውተር ሳይንስ',
  'Mathematics': 'ሒሳብ',
  'MATH': 'ሒሳብ',
  'Statistics': 'ስታቲስቲክስ',
  'STAT': 'ስታቲስቲክስ',
  'Medicine (MD)': 'ሕክምና',
  'Medicine': 'ሕክምና',
  'MED': 'ሕክምና',
  'Public Health': 'የሕዝብ ጤና',
  'PH': 'የሕዝብ ጤና',
  'Nursing': 'ነርሲንግ',
  'NURS': 'ነርሲንግ',
  'Accounting and Finance': 'አካውንቲንግና ፋይናንስ',
  'ACC': 'አካውንቲንግና ፋይናንስ',
  'Management': 'ማኔጅመንት',
  'MGMT': 'ማኔጅመንት',
  'Economics': 'ኢኮኖሚክስ',
  'ECON': 'ኢኮኖሚክስ',
  'Plant Science': 'ዕፅዋት ሳይንስ',
  'PLNT': 'ዕፅዋት ሳይንስ',
  'Animal Science': 'እንስሳት ሳይንስ',
  'ANML': 'እንስሳት ሳይንስ'
};

/**
 * Returns translated department name
 */
export const getDeptName = (
  language: SupportedLanguage,
  deptNameOrCode: string,
  departments: Department[] = []
): string => {
  if (!deptNameOrCode) return '';
  if (language !== 'am') {
    const dept = departments.find(d => d.name === deptNameOrCode || d.code === deptNameOrCode);
    return dept ? dept.name : deptNameOrCode;
  }

  const dept = departments.find(d => d.name === deptNameOrCode || d.code === deptNameOrCode);
  if (dept && dept.amharicName) {
    return dept.amharicName;
  }

  return DEPT_AMHARIC_MAP[deptNameOrCode] || deptNameOrCode;
};

/**
 * Known dormitory Amharic mappings
 */
const DORM_AMHARIC_MAP: Record<string, string> = {
  'Block 45 - Tewodros Hall (Men)': 'ብሎክ 45 - ቴዎድሮስ አዳራሽ (ወንድ)',
  'Block 45 - Tewodros Hall': 'ብሎክ 45 - ቴዎድሮስ አዳራሽ',
  'Block 45': 'ብሎክ 45',
  'Block 46 - Taytu Hall (Women)': 'ብሎክ 46 - ጣይቱ አዳራሽ (ሴት)',
  'Block 46 - Taytu Hall': 'ብሎክ 46 - ጣይቱ አዳራሽ',
  'Block 46': 'ብሎክ 46',
  'Block 47 - Postgraduate & Special Needs Block': 'ብሎክ 47 - ድኅረ ምረቃና ልዩ ፍላጎት ብሎክ',
  'Block 47': 'ብሎክ 47',
  'Wachemo Main Campus Dorms': 'የዋቸሞ ዋና ግቢ ማደሪያ ዶርሞች'
};

/**
 * Returns translated dormitory name
 */
export const getDormName = (
  language: SupportedLanguage,
  dormNameOrId: string,
  dormitories: Dormitory[] = []
): string => {
  if (!dormNameOrId) return '';
  if (language !== 'am') {
    const dorm = dormitories.find(d => d.name === dormNameOrId || d.id === dormNameOrId);
    return dorm ? dorm.name : dormNameOrId;
  }

  const dorm = dormitories.find(d => d.name === dormNameOrId || d.id === dormNameOrId);
  if (dorm && dorm.amharicName) {
    return dorm.amharicName;
  }

  return DORM_AMHARIC_MAP[dormNameOrId] || dormNameOrId;
};

/**
 * Batch translation
 */
export const formatBatch = (language: SupportedLanguage, batch: string): string => {
  if (!batch) return '';
  if (language === 'am') {
    return batch.replace('Batch', 'ባች');
  }
  return batch;
};

/**
 * Semester translation
 */
export const formatSemester = (language: SupportedLanguage, semester: string): string => {
  if (!semester) return '';
  if (language === 'am') {
    return semester.replace('Semester', 'ሴሚስተር');
  }
  return semester;
};

/**
 * Status translation
 */
const STATUS_MAP: Record<string, { en: string; am: string }> = {
  VERIFIED: { en: 'Verified', am: 'የተረጋገጠ' },
  FLAGGED: { en: 'Flagged', am: 'የተጣቀሰ' },
  PENDING: { en: 'Pending', am: 'በመጠባበቅ ላይ' },
  REJECTED: { en: 'Rejected', am: 'ውድቅ የተደረገ' },
  APPROVED: { en: 'Approved', am: 'የጸደቀ' },
  ALLOCATED: { en: 'Allocated', am: 'የተመደበ' },
  AI_RECOMMENDED: { en: 'AI Recommended', am: 'በአይ የተመከረ' },
  ACTIVE: { en: 'Active', am: 'ገቢር' },
  SUSPENDED: { en: 'Suspended', am: 'የታገደ' },
  AVAILABLE: { en: 'Available', am: 'ክፍት' },
  OCCUPIED: { en: 'Occupied', am: 'የተያዘ' },
  FULL: { en: 'Full', am: 'ሙሉ' },
  MAINTENANCE: { en: 'Maintenance', am: 'ጥገና ላይ' },
  RESERVED: { en: 'Reserved', am: 'የተያዘ (Reserved)' },
  SUBMITTED: { en: 'Submitted', am: 'የቀረበ' },
  UNDER_REVIEW: { en: 'Under Review', am: 'በግምገማ ላይ' },
  ASSIGNED: { en: 'Assigned', am: 'የተመደበ' },
  IN_PROGRESS: { en: 'In Progress', am: 'በሂደት ላይ' },
  COMPLETED: { en: 'Completed', am: 'የተጠናቀቀ' },
  EXCELLENT: { en: 'Excellent', am: 'እጅግ በጣም ጥሩ' },
  GOOD: { en: 'Good', am: 'ጥሩ' },
  NEEDS_REPAIR: { en: 'Needs Repair', am: 'ጥገና የሚያስፈልገው' },
  DAMAGED: { en: 'Damaged', am: 'የተበላሸ' },
  MISSING: { en: 'Missing', am: 'የጠፋ' },
};

export const formatStatus = (language: SupportedLanguage, status: string): string => {
  if (!status) return '';
  const upper = status.toUpperCase();
  if (STATUS_MAP[upper]) {
    return language === 'am' ? STATUS_MAP[upper].am : STATUS_MAP[upper].en;
  }
  return status;
};

/**
 * Category translation
 */
const CATEGORY_MAP: Record<string, { en: string; am: string }> = {
  WATER_PLUMBING: { en: 'Water & Plumbing', am: 'የውሃና ቧንቧ ብልሽት' },
  ELECTRICITY: { en: 'Electricity & Lighting', am: 'የኤሌክትሪክና መብራት' },
  BED_FURNITURE: { en: 'Bed & Furniture', am: 'አልጋና ፈርኒቸር' },
  INTERNET_WIFI: { en: 'Internet & WiFi', am: 'ኢንተርኔትና ዋይፋይ' },
  DOORS_WINDOWS: { en: 'Doors & Windows', am: 'በሮችና መስኮቶች' },
  SANITATION_TOILET: { en: 'Sanitation & Washroom', am: 'ፅዳትና መጸዳጃ ቤት' },
  FURNITURE: { en: 'Furniture', am: 'ፈርኒቸር' },
  ELECTRONICS: { en: 'Electronics', am: 'ኤሌክትሮኒክስ' },
  LABORATORY: { en: 'Laboratory Equipment', am: 'የላቦራቶሪ እቃ' },
  OFFICE: { en: 'Office Equipment', am: 'የቢሮ እቃ' },
  DORM_BED: { en: 'Dormitory Bed', am: 'የዶርም አልጋ' },
  OTHER: { en: 'Other Facility', am: 'ሌላ አገልግሎት' },
};

export const formatCategory = (language: SupportedLanguage, category: string): string => {
  if (!category) return '';
  const upper = category.toUpperCase();
  if (CATEGORY_MAP[upper]) {
    return language === 'am' ? CATEGORY_MAP[upper].am : CATEGORY_MAP[upper].en;
  }
  return category;
};

/**
 * Priority translation
 */
const PRIORITY_MAP: Record<string, { en: string; am: string }> = {
  URGENT: { en: 'Urgent Hazard', am: 'አስቸኳይ አደጋ' },
  HIGH: { en: 'High Priority', am: 'ከፍተኛ ቅድሚያ' },
  MEDIUM: { en: 'Medium Priority', am: 'መካከለኛ' },
  LOW: { en: 'Low Priority', am: 'ዝቅተኛ' }
};

export const formatPriority = (language: SupportedLanguage, priority: string): string => {
  if (!priority) return '';
  const upper = priority.toUpperCase();
  if (PRIORITY_MAP[upper]) {
    return language === 'am' ? PRIORITY_MAP[upper].am : PRIORITY_MAP[upper].en;
  }
  return priority;
};

/**
 * Gender translation
 */
export const formatGender = (language: SupportedLanguage, gender: string): string => {
  if (!gender) return '';
  const upper = gender.toUpperCase();
  if (upper === 'MALE') return language === 'am' ? 'ወንድ' : 'Male';
  if (upper === 'FEMALE') return language === 'am' ? 'ሴት' : 'Female';
  if (upper === 'MIXED') return language === 'am' ? 'ቅይጥ' : 'Mixed';
  return gender;
};

/**
 * Role translation
 */
const ROLE_MAP: Record<UserRole, { en: string; am: string }> = {
  SUPER_ADMIN: { en: 'Super Admin', am: 'ዋና አስተዳዳሪ' },
  STUDENT: { en: 'Student Portal', am: 'የተማሪ ፖርታል' },
  DORMITORY_MANAGER: { en: 'Dormitory Manager', am: 'የዶርም ኃላፊ (ፕሮክተር)' },
  ACCOMMODATION_OFFICER: { en: 'Accommodation Officer', am: 'የመኖሪያ ምደባ ኦፊሰር' },
  PROPERTY_MANAGER: { en: 'Property Manager', am: 'የንብረት አስተዳዳሪ' },
  MAINTENANCE_STAFF: { en: 'Maintenance Staff', am: 'የጥገና ባለሙያ (ኢንጂነር)' }
};

export const formatRole = (language: SupportedLanguage, role: UserRole): string => {
  if (!role) return '';
  if (ROLE_MAP[role]) {
    return language === 'am' ? ROLE_MAP[role].am : ROLE_MAP[role].en;
  }
  return role;
};
