import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  getBilingual,
  getStudentName,
  getCollegeName,
  getDeptName,
  getDormName,
  formatBatch,
  formatSemester,
  formatStatus,
  formatCategory,
  formatPriority
} from '../../utils/translationUtils';
import { 
  User, 
  Home, 
  FileText, 
  Wrench, 
  Bot, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  RefreshCw, 
  Sparkles, 
  Users, 
  MapPin, 
  Phone, 
  Upload, 
  QrCode,
  ShieldCheck,
  ChevronRight,
  BedDouble
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    officialStudents,
    colleges,
    departments,
    dormitories,
    applications, 
    complaints, 
    rooms, 
    applyForAccommodation, 
    submitComplaint 
  } = useAuth();
  const { language, t } = useLanguage();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'profile_dorm' | 'apply' | 'transfer' | 'complaints' | 'ai_chat'>('profile_dorm');

  // Application Form State
  const [specialNeeds, setSpecialNeeds] = useState(false);
  const [specialNeedsDesc, setSpecialNeedsDesc] = useState('');
  const [preferredFloor, setPreferredFloor] = useState('Ground / 1st Floor');
  const [emergencyContact, setEmergencyContact] = useState('+251 911 223344');
  const [applicationSubmittedMsg, setApplicationSubmittedMsg] = useState('');

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState<any>('WATER_PLUMBING');
  const [complaintRoom, setComplaintRoom] = useState('B45-101');
  const [complaintPriority, setComplaintPriority] = useState<any>('HIGH');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintPhotoPreview, setComplaintPhotoPreview] = useState('');
  const [complaintSuccessMsg, setComplaintSuccessMsg] = useState('');

  // Transfer Request Form State
  const [transferReason, setTransferReason] = useState('');
  const [transferMsg, setTransferMsg] = useState('');

  // AI Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: language === 'am' 
        ? 'ሰላም! እኔ የዋቸሞ ዩኒቨርሲቲ የተማሪዎች ማደሪያና መኖሪያ አይ-ረዳት ነኝ:: ስለ ዶርም ደንቦች፣ አልጋ ምደባ፣ የጥገና አገልግሎቶች እና የምግብ ሰዓት ማንኛውንም ጥያቄ መጠየቅ ይችላሉ::' 
        : 'Hello! I am Wachemo University AI Accommodation Assistant. How can I assist you today regarding dorm allocation, room maintenance, curfew hours, or university property policies?',
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Current student accommodation application
  const myApplication = applications.find(
    a => a.studentIdNumber === currentUser?.studentId || a.studentName === currentUser?.name
  );

  // Student's room and roommates
  const myRoom = rooms.find(r => 
    r.beds.some(b => b.studentId === currentUser?.studentId || b.studentName === currentUser?.name)
  );
  const myBed = myRoom?.beds.find(
    b => b.studentId === currentUser?.studentId || b.studentName === currentUser?.name
  );
  const myRoommates = myRoom?.beds.filter(
    b => b.studentId && b.studentId !== currentUser?.studentId && b.studentName !== currentUser?.name
  ) || [];

  // Student's complaints
  const myComplaints = complaints.filter(
    c => c.studentId === currentUser?.studentId || c.studentName === currentUser?.name
  );

  // Handle Application Submit
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    applyForAccommodation({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentIdNumber: currentUser.studentId || 'WU/2024/001',
      gender: 'MALE',
      college: currentUser.collegeId || 'College of Engineering and Technology',
      department: currentUser.departmentName || 'Software Engineering',
      batch: currentUser.batch || 'Batch 2024',
      semester: currentUser.semester || 'Semester 1',
      specialNeeds,
      specialNeedsDescription: specialNeedsDesc,
      preferredFloor,
      emergencyContact
    });

    setApplicationSubmittedMsg(
      language === 'am' 
        ? 'የመኖሪያ ማመልከቻዎ በተሳካ ሁኔታ ቀርቧል! በአይ (AI) የተመከረ ዶርም ተመርጧል::' 
        : 'Accommodation application successfully submitted! AI recommendation generated.'
    );
  };

  // Handle Complaint Submit
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !complaintDesc.trim()) return;

    submitComplaint({
      studentId: currentUser.studentId || 'WU/2024/001',
      studentName: currentUser.name,
      studentPhone: currentUser.phone || '+251 922 123456',
      dormitoryName: myApplication?.allocatedDorm || 'Block 45 - Tewodros Hall (Men)',
      roomNumber: complaintRoom,
      category: complaintCategory,
      description: complaintDesc,
      priority: complaintPriority,
      imageUrl: complaintPhotoPreview || undefined
    });

    setComplaintSuccessMsg(
      language === 'am'
        ? 'የጥገና ጥያቄዎ በተሳካ ሁኔታ ተመዝግቧል! ለቴክኒሻን ተልኳል::'
        : 'Maintenance request logged successfully! Dispatched to campus technician.'
    );
    setComplaintDesc('');
    setComplaintPhotoPreview('');
    setTimeout(() => setComplaintSuccessMsg(''), 4000);
  };

  // Handle Transfer Submit
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferReason.trim()) return;

    setTransferMsg(
      language === 'am' 
        ? 'የዶርም ቅያሬ ጥያቄዎ ለመኖሪያ ኦፊሰሩ (Accommodation Officer) ተልኳል::' 
        : 'Room transfer request forwarded to the Accommodation Office.'
    );
    setTransferReason('');
  };

  // Handle AI Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('bed') || lower.includes('room') || lower.includes('አልጋ') || lower.includes('ዶርም')) {
        reply = language === 'am'
          ? `የእርስዎ የተመደበው ዶርም ${getDormName(language, myApplication?.allocatedDorm || 'Block 45 - Tewodros Hall (Men)', dormitories)} ክፍል ${myRoom?.roomNumber || 'B45-101'}፣ ${myBed?.bedNumber || 'Bed 1 (ታች)'} ነው:: የዶርም ቅያሬ የሚፈቀደው በህክምና ወይም በልዩ ምክንያት በኦፊሰሩ ሲጸድቅ ብቻ ነው::`
          : `Your assigned accommodation is in ${myApplication?.allocatedDorm || 'Block 45 (Tewodros Hall)'}, Room ${myRoom?.roomNumber || 'B45-101'}, Bed: ${myBed?.bedNumber || 'Bed 1 (Lower)'}. Room change requests can be submitted via the Transfer tab.`;
      } else if (lower.includes('maintenance') || lower.includes('repair') || lower.includes('ውሃ') || lower.includes('መብራት') || lower.includes('ጥገና')) {
        reply = language === 'am'
          ? 'የውሃ፣ የመብራት ወይም የበር/መስኮት ብልሽት ሲያጋጥምዎ በ "ጥገና ሪፖርት" ትር በኩል ፎቶ በማያያዝ ማሳወቅ ይችላሉ:: አስቸኳይ ችግሮች በ 24 ሰዓት ውስጥ በኢንጂነሪንግ ቡድኑ ይታያሉ::'
          : 'For any plumbing, electrical, or furniture problems, submit a ticket under the Maintenance tab with an attached photo. Urgent hazards are attended to within 24 hours by campus engineers.';
      } else if (lower.includes('curfew') || lower.includes('gate') || lower.includes('ሰዓት') || lower.includes('በር')) {
        reply = language === 'am'
          ? 'የዋቸሞ ዩኒቨርሲቲ ዶርሞች ዋና በር በየቀኑ ምሽት 3:30 (9:30 PM) ይዘጋል:: ልዩ ፈቃድ የሚያስፈልጋቸው ተማሪዎች ከፕሮክተር ቢሮ ፈቃድ ማግኘት አለባቸው::'
          : 'Official Wachemo University dormitory gates close at 9:30 PM (3:30 local time) nightly. Late entry requires a verified gate pass issued by your Block Proctor.';
      } else {
        reply = language === 'am'
          ? 'ስለ ዋቸሞ ዩኒቨርሲቲ የተማሪዎች ማደሪያ ደንብ ማንኛውንም ተጨማሪ ጥያቄ መመለስ እችላለሁ:: ስለ አልጋ ምደባ፣ ምግብ አዳራሽ ወይም የጥገና ጥያቄዎች ይጠይቁኝ::'
          : 'I can assist you with all Wachemo University residential policies, room transfer eligibility, proctor contacts, and maintenance tracking. Feel free to ask!';
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  // Bilingual Bed Text helper
  const formatBedName = (bedStr?: string) => {
    if (!bedStr) return '';
    if (language === 'am') {
      return bedStr
        .replace('Bed', 'አልጋ')
        .replace('Lower', 'ታች')
        .replace('Upper', 'ላይ');
    }
    return bedStr;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Student Profile Card Header */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-cyan-500/30 p-6 bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-[#0A1329] dark:to-slate-900 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'} 
                alt="Student Avatar" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500 dark:border-cyan-400 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white" title="Officially Verified">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {getStudentName(language, currentUser?.name || '', officialStudents)}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/40">
                  {currentUser?.studentId || 'WU/2024/001'}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>{getDeptName(language, currentUser?.departmentName || 'Software Engineering', departments)}</span>
                <span>•</span>
                <span>{formatBatch(language, currentUser?.batch || 'Batch 2024')}</span>
                <span>•</span>
                <span>{formatSemester(language, currentUser?.semester || 'Semester 1')}</span>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'am' ? 'በሬጅስትራር ይፋዊ መዝገብ የተረጋገጠ ማንነት' : 'Officially Verified Identity Against Registrar List'}</span>
              </div>
            </div>
          </div>

          {/* Accommodation Status Badge */}
          <div className="p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 text-right shadow-sm">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">
              {language === 'am' ? 'የመኖሪያ ማደሪያ ምደባ' : 'Housing Allocation'}
            </div>
            <div className="text-sm font-bold text-cyan-700 dark:text-cyan-300 flex items-center justify-end space-x-1 mt-0.5">
              <BedDouble className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>
                {myApplication?.allocatedRoom 
                  ? `${myApplication.allocatedRoom} • ${formatBedName(myApplication.allocatedBed)}` 
                  : (language === 'am' ? 'ማመልከቻ በመጠባበቅ ላይ' : 'Pending Application')}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {getDormName(language, myApplication?.allocatedDorm || 'Block 45 - Tewodros Hall (Men)', dormitories)}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 sm:space-x-4 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('profile_dorm')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'profile_dorm'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{language === 'am' ? 'የተመደበው ዶርም' : 'Assigned Dormitory & Room'}</span>
        </button>

        <button
          onClick={() => setActiveTab('apply')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'apply'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'am' ? 'የዶርም ማመልከቻ' : 'Apply for Dormitory'}</span>
        </button>

        <button
          onClick={() => setActiveTab('transfer')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'transfer'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'am' ? 'ክፍል ቅያሬ' : 'Room Transfer Request'}</span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'complaints'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>{language === 'am' ? 'የጥገና ሪፖርት' : 'Maintenance Complaints'}</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400 font-mono font-bold">
            {myComplaints.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ai_chat')}
          className={`py-2 px-3 border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'ai_chat'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>{language === 'am' ? 'አይ-ረዳት (AI Chatbot)' : 'AI Housing Assistant'}</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ASSIGNED DORMITORY & ROOMMATES */}
      {/* ==================================================== */}
      {activeTab === 'profile_dorm' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Main Dorm Card with authentic uploaded image */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md">
              <div className="relative h-60 w-full overflow-hidden">
                <img 
                  src="/assets/images/dormitory_blocks.jpg" 
                  alt="Wachemo University Dormitory Blocks" 
                  className="w-full h-full object-cover hover:scale-105 transition duration-500 brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-cyan-600 text-white font-extrabold text-xs shadow-sm">
                      {language === 'am' ? 'ይፋዊ ምደባ' : 'OFFICIAL ASSIGNMENT'}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {getDormName(language, myApplication?.allocatedDorm || 'Block 45 - Tewodros Hall (Men)', dormitories)}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {language === 'am' ? 'ሆሳዕና ዋና ግቢ • የተማሪዎች አገልግሎት ዳይሬክቶሬት' : 'Hosanna Main Campus • Directorate of Student Services'}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-300">{language === 'am' ? 'የክፍል ቁጥር' : 'Room Number'}</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono">
                      {myRoom?.roomNumber || 'B45-101'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Details Grid */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{language === 'am' ? 'ፎቅ' : 'Floor Level'}</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {language === 'am' ? 'ፎቅ 1 (ምድር ፎቅ)' : 'Floor 1 (Ground)'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{language === 'am' ? 'የተመደበው አልጋ' : 'Assigned Bed'}</div>
                  <div className="font-bold text-cyan-700 dark:text-cyan-300 text-sm mt-0.5">
                    {formatBedName(myBed?.bedNumber || 'Bed 1 (Lower)')}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{language === 'am' ? 'የክፍል አቅም' : 'Room Capacity'}</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {language === 'am' ? '4 ተማሪዎች' : '4 Students'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400">{language === 'am' ? 'የፕሮክተር ስልክ' : 'Proctor Contact'}</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 font-mono">+251 912 345678</div>
                </div>
              </div>

              {/* Roommates List */}
              <div className="p-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 mb-3">
                  <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{language === 'am' ? 'የዶርም ጓደኞች (Roommates)' : 'My Assigned Roommates'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {myRoommates.map((rm) => (
                    <div key={rm.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/30 flex items-center justify-center font-bold text-cyan-800 dark:text-cyan-400 text-xs shrink-0">
                        {getStudentName(language, rm.studentName || '', officialStudents).charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                          {getStudentName(language, rm.studentName || '', officialStudents)}
                        </div>
                        <div className="text-[10px] text-cyan-700 dark:text-cyan-400/80 truncate">
                          {getDeptName(language, rm.studentDepartment || '', departments)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {formatBedName(rm.bedNumber)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Student Gate QR Pass */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-cyan-500/30 shadow-md space-y-4 text-center">
              <div className="inline-block p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <QrCode className="w-32 h-32 text-cyan-600 dark:text-cyan-400 mx-auto" />
              </div>

              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {language === 'am' ? 'ዲጂታል የዶርም መግቢያ ፈቃድ' : 'Digital Dorm Gate Pass'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  ID: {currentUser?.studentId || 'WU/2024/001'}
                </div>
              </div>

              <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-800/40 text-[11px] text-cyan-800 dark:text-cyan-300">
                {language === 'am'
                  ? 'ይህን የQR ኮድ በብሎክ 45 ጥበቃ በር ላይ በማሳየት ቁልፍ እና የመግቢያ ፍቃድ ያግኙ::'
                  : 'Show this digital QR pass at Block 45 security checkpoint for physical key and gate entry.'}
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white mb-2">
                {language === 'am' ? 'የግቢ መኖሪያ መመሪያዎች፡' : 'Campus Residential Guidelines:'}
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300 space-x-2">
                <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{language === 'am' ? 'የዶርም መግቢያ ሰዓት፡ ምሽት 3:30 (9:30 PM)' : 'Dorm Curfew: 9:30 PM (3:30 local)'}</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-300 space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'am' ? 'ያልተፈቀደለት እንግዳ ማስገባት በጥብቅ የተከለከለ ነው' : 'Strictly no unauthorized visitors'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: APPLY FOR ACCOMMODATION */}
      {/* ==================================================== */}
      {activeTab === 'apply' && (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>{language === 'am' ? 'የዶርም መኖሪያ ማመልከቻ' : 'Student Accommodation Application'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'am'
                ? 'የመኖሪያ ማመልከቻዎን ያስገቡ:: ሲስተሙ በአይ (AI) አማካኝነት ከተመሳሳይ ባችና ዲፓርትመንት ተማሪዎች ጋር ይመድብዎታል::'
                : 'Submit your accommodation request. The system will leverage AI to match you with compatible batchmates and appropriate room floors.'}
            </p>
          </div>

          {applicationSubmittedMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{applicationSubmittedMsg}</span>
            </div>
          )}

          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'የተማሪ መታወቂያ' : 'Student ID'}
                </label>
                <input
                  type="text"
                  value={currentUser?.studentId || 'WU/2024/001'}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={getStudentName(language, currentUser?.name || '', officialStudents)}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                {language === 'am' ? 'ተመራጭ ፎቅ' : 'Preferred Floor Level'}
              </label>
              <select
                value={preferredFloor}
                onChange={(e) => setPreferredFloor(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
              >
                <option value="Ground / 1st Floor">{language === 'am' ? 'ምድር / 1ኛ ፎቅ' : 'Ground / 1st Floor'}</option>
                <option value="2nd Floor">{language === 'am' ? '2ኛ ፎቅ' : '2nd Floor'}</option>
                <option value="3rd Floor">{language === 'am' ? '3ኛ ፎቅ' : '3rd Floor'}</option>
                <option value="4th Floor">{language === 'am' ? '4ኛ ፎቅ' : '4th Floor'}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                {language === 'am' ? 'የአስቸኳይ ጊዜ ተጠሪ (ስም እና ስልክ)' : 'Emergency Contact (Name & Phone)'} *
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. Ato Kebede Tadesse - +251 911 223344"
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Special Needs */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded"
                />
                <span className="text-slate-800 dark:text-white font-semibold">
                  {language === 'am' 
                    ? 'ልዩ ድጋፍ ወይም የህክምና ሁኔታ አለብኝ (ምቹ ክፍል የሚያስፈልገው)'
                    : 'I have special accommodation needs / medical conditions (requires accessible room)'}
                </span>
              </label>

              {specialNeeds && (
                <textarea
                  rows={2}
                  value={specialNeedsDesc}
                  onChange={(e) => setSpecialNeedsDesc(e.target.value)}
                  placeholder={language === 'am' ? 'የጤና ወይም የአካል ጉዳት ሁኔታዎን ይግለጹ (ምሳሌ፡ ዊልቼር፣ የታች አልጋ ፍላጎት)...' : 'Describe your medical or physical mobility requirement (e.g. Wheelchair access, lower bunk requirement).'}
                  className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white text-xs mt-2"
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              {language === 'am' ? 'ማመልከቻውን ላክና በአይ (AI) ምከር' : 'Submit Application & Generate AI Recommendation'}
            </button>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: ROOM TRANSFER REQUEST */}
      {/* ==================================================== */}
      {activeTab === 'transfer' && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{language === 'am' ? 'የዶርም ክፍል ቅያሬ ማመልከቻ' : 'Request Accommodation Transfer'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'am'
                ? 'ክፍል ወይም ህንጻ ለመቀየር ጥያቄ ያቅርቡ:: ጥያቄዎች በመኖሪያ ኦፊሰሩ ተገምግመው ይወሰናሉ::'
                : 'Apply to change rooms or switch buildings. Requests are reviewed by the Accommodation Officer.'}
            </p>
          </div>

          {transferMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs rounded">
              {transferMsg}
            </div>
          )}

          <form onSubmit={handleTransferSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                {language === 'am' ? 'የአሁን ምደባ' : 'Current Assignment'}
              </label>
              <input
                type="text"
                value={`${getDormName(language, myApplication?.allocatedDorm || 'Block 45', dormitories)} - ${language === 'am' ? 'ክፍል' : 'Room'} ${myRoom?.roomNumber || 'B45-101'}`}
                disabled
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                {language === 'am' ? 'የቅያሬው ምክንያት *' : 'Reason for Transfer Request *'}
              </label>
              <textarea
                rows={4}
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder={language === 'am' ? 'ምክንያትዎን በዝርዝር ይግለጹ (ምሳሌ፡ የጤና እክል፣ የጥናት ቡድን፣ የአካል ተደራሽነት)...' : 'State your justification (e.g. Health condition, department study group alignment, physical floor accessibility).'}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition cursor-pointer"
            >
              {language === 'am' ? 'የቅያሬ ጥያቄውን ላክ' : 'Submit Transfer Request'}
            </button>
          </form>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: MAINTENANCE COMPLAINTS DESK */}
      {/* ==================================================== */}
      {activeTab === 'complaints' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          {/* Submit Complaint Form */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>{language === 'am' ? 'የዶርም ጥገና ችግር ሪፖርት ማድረጊያ' : 'Report Dormitory Maintenance Issue'}</span>
            </h3>

            {complaintSuccessMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs rounded flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{complaintSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleComplaintSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {language === 'am' ? 'የብልሽት ዓይነት *' : 'Problem Category *'}
                  </label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white font-medium"
                  >
                    <option value="WATER_PLUMBING">{formatCategory(language, 'WATER_PLUMBING')}</option>
                    <option value="ELECTRICITY">{formatCategory(language, 'ELECTRICITY')}</option>
                    <option value="BED_FURNITURE">{formatCategory(language, 'BED_FURNITURE')}</option>
                    <option value="INTERNET_WIFI">{formatCategory(language, 'INTERNET_WIFI')}</option>
                    <option value="DOORS_WINDOWS">{formatCategory(language, 'DOORS_WINDOWS')}</option>
                    <option value="SANITATION_TOILET">{formatCategory(language, 'SANITATION_TOILET')}</option>
                    <option value="OTHER">{formatCategory(language, 'OTHER')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                    {language === 'am' ? 'ክፍል / ቦታ *' : 'Room / Location *'}
                  </label>
                  <input
                    type="text"
                    value={complaintRoom}
                    onChange={(e) => setComplaintRoom(e.target.value)}
                    placeholder="e.g. B45-101"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'የአስቸኳይነት ደረጃ' : 'Urgency Priority'}
                </label>
                <select
                  value={complaintPriority}
                  onChange={(e) => setComplaintPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white font-semibold"
                >
                  <option value="URGENT">{formatPriority(language, 'URGENT')}</option>
                  <option value="HIGH">{formatPriority(language, 'HIGH')}</option>
                  <option value="MEDIUM">{formatPriority(language, 'MEDIUM')}</option>
                  <option value="LOW">{formatPriority(language, 'LOW')}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'የብልሽቱ ማብራሪያ *' : 'Description of Issue *'}
                </label>
                <textarea
                  rows={3}
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder={language === 'am' ? 'ቴክኒሻኑ ተገቢውን መለዋወጫ ይዞ እንዲመጣ ብልሽቱን በዝርዝር ይግለጹ...' : 'Describe the defect in detail so our technicians bring proper spare parts.'}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                {language === 'am' ? 'የጥገና ጥያቄውን መዝግብ' : 'Log Maintenance Ticket'}
              </button>
            </form>
          </div>

          {/* My Tickets List */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>{language === 'am' ? 'የቀደምት ጥገና ጥያቄዎቼ' : 'My Maintenance Tickets'}</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {myComplaints.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  {language === 'am' ? 'እስካሁን ያቀረቡት የጥገና ጥያቄ የለም::' : 'You have not submitted any maintenance complaints yet.'}
                </div>
              ) : (
                myComplaints.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">{c.ticketNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300' :
                        c.status === 'IN_PROGRESS' ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 border border-blue-300' :
                        'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300'
                      }`}>
                        {formatStatus(language, c.status)}
                      </span>
                    </div>

                    <div className="text-slate-800 dark:text-slate-300 font-medium">{c.description}</div>
                    
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-900">
                      <span>{language === 'am' ? 'ክፍል' : 'Room'}: {c.roomNumber} • {formatCategory(language, c.category)}</span>
                      <span>{c.createdAt}</span>
                    </div>

                    {c.repairNotes && (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                        {language === 'am' ? 'የቴክኒሻን ማስታወሻ፡ ' : 'Technician Note: '}{c.repairNotes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: AI HOUSING ASSISTANT CHATBOT */}
      {/* ==================================================== */}
      {activeTab === 'ai_chat' && (
        <div className="max-w-2xl mx-auto rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-cyan-500/30 shadow-xl flex flex-col h-[520px] overflow-hidden animate-in fade-in">
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
                  <span>{language === 'am' ? 'የዋቸሞ ዩኒቨርሲቲ አይ-ረዳት' : 'Wachemo Housing AI'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{language === 'am' ? 'ዝግጁ • በእንግሊዝኛና በአማርኛ' : 'Online • English & Amharic'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white font-medium rounded-br-none shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700/80 shadow-sm'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none text-slate-500 text-xs flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={language === 'am' ? 'ጥያቄዎን እዚህ ይጻፉ (ለምሳሌ፡ የዶርም ሰዓት ስንት ነው?)...' : 'Ask about dorm rules, room change, curfew, maintenance...'}
              className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
