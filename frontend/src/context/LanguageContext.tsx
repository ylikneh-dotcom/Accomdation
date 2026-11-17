import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header & Institutional
    'app.title': 'Wachemo University',
    'app.subTitle': 'AI-Powered University Accommodation and Property Management System',
    'app.amharicTitle': 'ዋቸሞ ዩኒቨርሲቲ',
    'app.tagline': 'Federal Democratic Republic of Ethiopia • Ministry of Education',
    'app.securityBadge': 'Official University System v2.4',
    
    // Auth & Navigation
    'nav.login': 'Sign In',
    'nav.register': 'Student Registration',
    'nav.logout': 'Sign Out',
    'nav.role': 'Current Role',
    'nav.home': 'Back to Home',
    'nav.portal': 'Official Portal',
    
    // Roles
    'role.SUPER_ADMIN': 'Super Admin',
    'role.STUDENT': 'Student Portal',
    'role.DORMITORY_MANAGER': 'Dormitory Manager',
    'role.ACCOMMODATION_OFFICER': 'Accommodation Officer',
    'role.PROPERTY_MANAGER': 'Property Manager',
    'role.MAINTENANCE_STAFF': 'Maintenance Staff',
    
    // Home & Auth
    'auth.welcome': 'Institutional Access Portal',
    'auth.portalDescription': 'Access Wachemo University accommodation, student dormitories, bed allocation, and property asset infrastructure.',
    'auth.usernameOrId': 'Student ID / Official Staff Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.signInBtn': 'Sign In to Portal',
    'auth.registerTitle': 'Official Student Registration',
    'auth.registerNotice': 'Verification Rule: Registration requires your official Student ID and academic information matching the university registrar database uploaded by the Super Admin.',
    'auth.studentId': 'Student ID Number',
    'auth.fullName': 'Official Full Name',
    'auth.college': 'Select College',
    'auth.department': 'Select Department',
    'auth.batch': 'Select Admission Batch',
    'auth.semester': 'Select Semester',
    'auth.verifyAndRegister': 'Verify & Complete Registration',
    'auth.verifying': 'Verifying Against Official University Records...',
    'auth.alreadyHaveAccount': 'Already have an account? Sign In',
    'auth.dontHaveAccount': "Don't have an account yet? Register Here",
    'auth.verificationSuccess': 'Verification Confirmed! Record matched official university registry.',
    'auth.verificationFailed': 'Verification Failed! Student details not found or do not match registrar records.',
    
    // Dashboards Common
    'dash.overview': 'Overview',
    'dash.students': 'Official Student Roster',
    'dash.academics': 'Colleges & Departments',
    'dash.staff': 'Staff Management',
    'dash.dormitories': 'Dormitories & Beds',
    'dash.applications': 'Accommodation Requests',
    'dash.properties': 'Properties & Assets',
    'dash.maintenance': 'Maintenance Desk',
    'dash.aiAssistant': 'AI Assistant',
    'dash.settings': 'System Settings',
    'dash.auditLogs': 'Audit Trail',

    // Super Admin Dashboard
    'admin.commandConsole': 'Super Admin Command Console',
    'admin.commandSub': 'Official Roster Management, Academic Structure, Staff Provisioning, Dormitories & Asset Governance',
    'admin.fullPrivileges': 'FULL PRIVILEGES',
    'admin.uploadRoster': 'Upload Student Roster (Excel/CSV)',
    'admin.addStudent': 'Add Student Manually',
    'admin.addStaff': 'Add Staff User',
    'admin.analyticsTab': 'Dashboard Analytics',
    'admin.rosterTab': 'Official Student Roster',
    'admin.academicsTab': 'Colleges & Departments',
    'admin.staffTab': 'Staff Management',
    'admin.auditTab': 'Audit Trail',
    'admin.settingsTab': 'System Settings',

    'admin.totalOfficial': 'Total Official Students',
    'admin.registeredActive': 'Registered & Active',
    'admin.flaggedDiscrepancies': 'Flagged Discrepancies',
    'admin.reviewNeeded': 'Requires admin review',
    'admin.bedOccupancy': 'Campus Bed Occupancy',
    'admin.registeredProperties': 'Registered Properties',
    'admin.primeCondition': 'in prime condition',
    
    // Student Table & Details
    'table.studentId': 'Student ID',
    'table.fullName': 'Official Full Name',
    'table.collegeDept': 'College & Department',
    'table.batchSem': 'Batch / Semester',
    'table.status': 'Verification Status',
    'table.account': 'Online Account',
    'table.actions': 'Actions',
    'table.activePortal': 'Active Portal',
    'table.notRegistered': 'Not registered yet',
    'table.searchPlaceholder': 'Search by ID, name, department...',
    'table.allColleges': 'All Colleges',
    'table.allStatuses': 'All Statuses',
    'table.gender': 'Gender',
    'table.notes': 'Notes / Remarks',

    // Academic Structure
    'acad.collegesTitle': 'Colleges Management',
    'acad.departmentsTitle': 'Departments Management',
    'acad.addCollege': 'Add New College',
    'acad.editCollege': 'Edit College Details',
    'acad.addDept': 'Add New Department',
    'acad.editDept': 'Edit Department Details',
    'acad.collegeNameEn': 'College Name (English)',
    'acad.collegeNameAm': 'College Name (Amharic - አማርኛ)',
    'acad.collegeCode': 'College Code (e.g. ENGTECH)',
    'acad.deptNameEn': 'Department Name (English)',
    'acad.deptNameAm': 'Department Name (Amharic - አማርኛ)',
    'acad.deptCode': 'Department Code (e.g. SE)',
    'acad.parentCollege': 'Belongs to College',
    'acad.createCollegeBtn': 'Create College',
    'acad.createDeptBtn': 'Create Department',
    'acad.saveChanges': 'Save Changes',
    'acad.description': 'Description',
    'acad.activeStudents': 'Active Students',
    'acad.departments': 'Departments',

    // Staff Management
    'staff.title': 'Staff Management — Individual Role Control',
    'staff.subtitle': 'Manage each staff member individually: assign buildings, activate/suspend, edit details, or remove per role category.',
    'staff.dormManagers': 'Dormitory Managers (Proctors)',
    'staff.dormManagersDesc': 'Manage assigned dormitory buildings, rooms, and student check-in/out',
    'staff.accomOfficers': 'Accommodation Officers',
    'staff.accomOfficersDesc': 'Review applications, evaluate AI recommendations, approve/reject allocations',
    'staff.propManagers': 'Property Managers',
    'staff.propManagersDesc': 'Register assets, track locations & conditions, manage inventory transfers',
    'staff.maintEngineers': 'Maintenance Engineers',
    'staff.maintEngineersDesc': 'Receive & complete repair tasks, update status, submit proof of work',
    'staff.superAdmins': 'Super Administrators',
    'staff.superAdminsDesc': 'Full system privileges and governance authority',
    'staff.assignedDorm': 'Assigned Building',
    'staff.assignedArea': 'Assigned Area',
    'staff.editStaff': 'Edit Staff Member',
    'staff.assignBuilding': 'Assign Building / Area',
    'staff.suspend': 'Suspend',
    'staff.activate': 'Activate',
    'staff.remove': 'Remove',

    // Statuses
    'status.VERIFIED': 'Verified',
    'status.FLAGGED': 'Flagged',
    'status.PENDING': 'Pending',
    'status.REJECTED': 'Rejected',
    'status.ACTIVE': 'Active',
    'status.SUSPENDED': 'Suspended',
    'gender.MALE': 'Male',
    'gender.FEMALE': 'Female',

    // Common Actions
    'btn.save': 'Save Changes',
    'btn.cancel': 'Cancel',
    'btn.delete': 'Delete',
    'btn.edit': 'Edit',
    'btn.export': 'Export CSV',
    'btn.print': 'Generate PDF Report',
    'btn.approve': 'Approve',
    'btn.reject': 'Reject',
    'btn.allocate': 'Smart Allocate',
    'btn.search': 'Search...',
    'btn.filter': 'Filter',
    'btn.close': 'Close',
    'btn.continue': 'Continue',
  },
  am: {
    // Header & Institutional
    'app.title': 'ዋቸሞ ዩኒቨርሲቲ',
    'app.subTitle': 'በአይ-የተደገፈ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም',
    'app.amharicTitle': 'ዋቸሞ ዩኒቨርሲቲ',
    'app.tagline': 'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ • የትምህርት ሚኒስቴር',
    'app.securityBadge': 'የዋቸሞ ዩኒቨርሲቲ ይፋዊ ፖርታል v2.4',
    
    // Auth & Navigation
    'nav.login': 'ወደ ሲስተሙ ግባ',
    'nav.register': 'የተማሪ ምዝገባ',
    'nav.logout': 'ውጣ',
    'nav.role': 'የአሁን ሚና',
    'nav.home': 'ወደ ዋናው ገጽ',
    'nav.portal': 'ይፋዊ ፖርታል',
    
    // Roles
    'role.SUPER_ADMIN': 'ዋና አስተዳዳሪ',
    'role.STUDENT': 'የተማሪ ፖርታል',
    'role.DORMITORY_MANAGER': 'የዶርም ኃላፊ (ፕሮክተር)',
    'role.ACCOMMODATION_OFFICER': 'የመኖሪያ ምደባ ኦፊሰር',
    'role.PROPERTY_MANAGER': 'የንብረት አስተዳዳሪ',
    'role.MAINTENANCE_STAFF': 'የጥገና ባለሙያ (ኢንጂነር)',
    
    // Home & Auth
    'auth.welcome': 'የተቋሙ ይፋዊ የመግቢያ ፖርታል',
    'auth.portalDescription': 'የዋቸሞ ዩኒቨርሲቲ የተማሪዎች መኖሪያ፣ የዶርም እና አልጋ ምደባ እንዲሁም የዩኒቨርሲቲ ቋሚ ንብረቶች አስተዳደር ሲስተም::',
    'auth.usernameOrId': 'የተማሪ መታወቂያ / ይፋዊ ሰራተኛ ኢሜይል',
    'auth.password': 'የይለፍ ቃል',
    'auth.confirmPassword': 'የይለፍ ቃል ያረጋግጡ',
    'auth.signInBtn': 'ወደ ሲስተሙ ግባ',
    'auth.registerTitle': 'ይፋዊ የተማሪዎች ምዝገባ',
    'auth.registerNotice': 'የማረጋገጫ ደንብ፡ ምዝገባው የሚከናወነው በዋና አስተዳዳሪው ከተጫነው ይፋዊ የተማሪዎች ዝርዝር ፋይል ጋር በማነጻጸር ሲሆን መታወቂያ፣ ኮሌጅ፣ ዲፓርትመንት፣ ባች እና ሴሚስተር ትክክል መሆን አለበት::',
    'auth.studentId': 'የተማሪ መታወቂያ ቁጥር (ID)',
    'auth.fullName': 'ሙሉ ስም (የአባትና የአያት ጨምሮ)',
    'auth.college': 'ኮሌጅ ይምረጡ',
    'auth.department': 'ዲፓርትመንት ይምረጡ',
    'auth.batch': 'ባች ይምረጡ',
    'auth.semester': 'ሴሚስተር ይምረጡ',
    'auth.verifyAndRegister': 'አረጋግጥና ተመዝገብ',
    'auth.verifying': 'ከዩኒቨርሲቲው ይፋዊ ሰነድ ጋር በማነጻጸር እየተረጋገጠ ነው...',
    'auth.alreadyHaveAccount': 'ቀደም ሲል ተመዝግበዋል? ወደ መግቢያ ይሂዱ',
    'auth.dontHaveAccount': 'አዲስ ተማሪ ነዎት? እዚህ ይመዝገቡ',
    'auth.verificationSuccess': 'ማረጋገጫው ተሳክቷል! መረጃው ከዩኒቨርሲቲው ይፋዊ ሰነድ ጋር ተመሳክሯል::',
    'auth.verificationFailed': 'ማረጋገጫው አልተሳካም! የተማሪው መረጃ በዩኒቨርሲቲው ሰነድ ውስጥ አልተገኘም ወይም አይዛመድም::',
    
    // Dashboards Common
    'dash.overview': 'ጠቅላላ እይታ',
    'dash.students': 'የተማሪዎች ዝርዝር',
    'dash.academics': 'ኮሌጆችና ዲፓርትመንቶች',
    'dash.staff': 'የሰራተኞች አስተዳደር',
    'dash.dormitories': 'ዶርሞችና አልጋዎች',
    'dash.applications': 'የመኖሪያ ማመልከቻዎች',
    'dash.properties': 'ንብረቶችና እቃዎች',
    'dash.maintenance': 'የጥገና ማዕከል',
    'dash.aiAssistant': 'አይ-ረዳት (AI Chat)',
    'dash.settings': 'የሲስተም ቅንብሮች',
    'dash.auditLogs': 'የእንቅስቃሴ መዝገብ',

    // Super Admin Dashboard
    'admin.commandConsole': 'የዋና አስተዳዳሪ ኮንትሮል ማዕከል',
    'admin.commandSub': 'የተማሪዎች ይፋዊ መረጃ፣ የአካዳሚክ መዋቅር፣ የሰራተኞች ምደባ፣ ዶርሞችና ንብረት ቁጥጥር',
    'admin.fullPrivileges': 'ሙሉ ስልጣን',
    'admin.uploadRoster': 'ይፋዊ የተማሪዎች ዝርዝር ጫን (Excel/CSV)',
    'admin.addStudent': 'አዲስ ተማሪ በእጅ አስገባ',
    'admin.addStaff': 'ሰራተኛ መዝግብ',
    'admin.analyticsTab': 'ዳሽቦርድና ስታቲስቲክስ',
    'admin.rosterTab': 'ይፋዊ የተማሪዎች ዝርዝር',
    'admin.academicsTab': 'ኮሌጆችና ዲፓርትመንቶች',
    'admin.staffTab': 'የሰራተኞች አስተዳደር',
    'admin.auditTab': 'የእንቅስቃሴ መዝገብ',
    'admin.settingsTab': 'የሲስተም ቅንብሮች',

    'admin.totalOfficial': 'ጠቅላላ ይፋዊ ተማሪዎች',
    'admin.registeredActive': 'የተመዘገቡና ገቢር የሆኑ',
    'admin.flaggedDiscrepancies': 'ያልተጣጣሙ (Flagged)',
    'admin.reviewNeeded': 'የአስተዳዳሪ ግምገማ የሚሹ',
    'admin.bedOccupancy': 'የዶርሞች የመያዝ ምጣኔ',
    'admin.registeredProperties': 'የተመዘገቡ ንብረቶች',
    'admin.primeCondition': 'በጥሩ ሁኔታ ላይ ያሉ',
    
    // Student Table & Details
    'table.studentId': 'የተማሪ መታወቂያ',
    'table.fullName': 'ሙሉ ስም',
    'table.collegeDept': 'ኮሌጅና ዲፓርትመንት',
    'table.batchSem': 'ባች / ሴሚስተር',
    'table.status': 'የማረጋገጫ ሁኔታ',
    'table.account': 'የፖርታል አካውንት',
    'table.actions': 'እርምጃዎች',
    'table.activePortal': 'ገቢር አካውንት',
    'table.notRegistered': 'እስካሁን አልተመዘገበም',
    'table.searchPlaceholder': 'በመታወቂያ፣ በስም ወይም በዲፓርትመንት ፈልግ...',
    'table.allColleges': 'ሁሉም ኮሌጆች',
    'table.allStatuses': 'ሁሉም ሁኔታዎች',
    'table.gender': 'ጾታ',
    'table.notes': 'ማስታወሻ',

    // Academic Structure
    'acad.collegesTitle': 'የኮሌጆች አስተዳደር',
    'acad.departmentsTitle': 'የዲፓርትመንቶች አስተዳደር',
    'acad.addCollege': 'አዲስ ኮሌጅ ፍጠር',
    'acad.editCollege': 'ኮሌጅ አስተካክል',
    'acad.addDept': 'አዲስ ዲፓርትመንት ፍጠር',
    'acad.editDept': 'ዲፓርትመንት አስተካክል',
    'acad.collegeNameEn': 'የኮሌጅ ስም (በእንግሊዝኛ)',
    'acad.collegeNameAm': 'የኮሌጅ ስም (በአማርኛ)',
    'acad.collegeCode': 'የኮሌጅ ኮድ (ምሳሌ: ENGTECH)',
    'acad.deptNameEn': 'የዲፓርትመንት ስም (በእንግሊዝኛ)',
    'acad.deptNameAm': 'የዲፓርትመንት ስም (በአማርኛ)',
    'acad.deptCode': 'የዲፓርትመንት ኮድ (ምሳሌ: SE)',
    'acad.parentCollege': 'የሚገኝበት ኮሌጅ',
    'acad.createCollegeBtn': 'ኮሌጅ መዝግብ',
    'acad.createDeptBtn': 'ዲፓርትመንት መዝግብ',
    'acad.saveChanges': 'ለውጦችን መዝግብ',
    'acad.description': 'መግለጫ',
    'acad.activeStudents': 'ተማሪዎች',
    'acad.departments': 'ዲፓርትመንቶች',

    // Staff Management
    'staff.title': 'የሰራተኞች አስተዳደር — በሚና ቁጥጥር',
    'staff.subtitle': 'እያንዳንዱን ሰራተኛ በተናጠል ያስተዳድሩ፡ ህንጻ መድቡ፣ ያግዱ/ያግብሩ፣ መረጃ ያርትዑ ወይም ያስወግዱ::',
    'staff.dormManagers': 'የዶርም ኃላፊዎች (ፕሮክተሮች)',
    'staff.dormManagersDesc': 'የተመደቡላቸውን ማደሪያ ህንጻዎች፣ ክፍሎችና አልጋዎች ያስተዳድራሉ',
    'staff.accomOfficers': 'የመኖሪያ ምደባ ኦፊሰሮች',
    'staff.accomOfficersDesc': 'የተማሪዎችን ማመልከቻ ይገመግማሉ፣ በአይ የተመከረውን ያረጋግጣሉ',
    'staff.propManagers': 'የንብረት አስተዳዳሪዎች',
    'staff.propManagersDesc': 'ቋሚ ንብረቶችን ያስመዘግባሉ፣ ሁኔታቸውንና ዝውውራቸውን ይከታተላሉ',
    'staff.maintEngineers': 'የጥገና ባለሙያዎች (ኢንጂነሮች)',
    'staff.maintEngineersDesc': 'የጥገና ስራዎችን ያከናውናሉ፣ የስራቸውን ማረጋገጫ ያቀርባሉ',
    'staff.superAdmins': 'ዋና አስተዳዳሪዎች',
    'staff.superAdminsDesc': 'ሙሉ የሲስተም አስተዳደርና ቁጥጥር ስልጣን ያላቸው',
    'staff.assignedDorm': 'የተመደበበት ህንጻ',
    'staff.assignedArea': 'የስራ ክፍል / አካባቢ',
    'staff.editStaff': 'የሰራተኛ መረጃ አስተካክል',
    'staff.assignBuilding': 'ህንጻ / ክፍል መድብ',
    'staff.suspend': 'አግድ',
    'staff.activate': 'አግብር',
    'staff.remove': 'አስወግድ',

    // Statuses
    'status.VERIFIED': 'የተረጋገጠ',
    'status.FLAGGED': 'የተጣቀሰ',
    'status.PENDING': 'በመጠባበቅ ላይ',
    'status.REJECTED': 'ውድቅ የተደረገ',
    'status.ACTIVE': 'ገቢር',
    'status.SUSPENDED': 'የታገደ',
    'gender.MALE': 'ወንድ',
    'gender.FEMALE': 'ሴት',

    // Common Actions
    'btn.save': 'ለውጦችን መዝግብ',
    'btn.cancel': 'ሰርዝ',
    'btn.delete': 'አጥፋ',
    'btn.edit': 'አስተካክል',
    'btn.export': 'ወደ CSV ላክ',
    'btn.print': 'የ PDF ሪፖርት አውጣ',
    'btn.approve': 'አጽድቅ',
    'btn.reject': 'ውድቅ አድርግ',
    'btn.allocate': 'በአይ (AI) መድብ',
    'btn.search': 'ፈልግ...',
    'btn.filter': 'አጣራ',
    'btn.close': 'ዝጋ',
    'btn.continue': 'ቀጥል',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('wu_language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('wu_language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
