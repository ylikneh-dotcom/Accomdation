import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AccommodationApplication } from '../../types';
import {
  getBilingual,
  getStudentName,
  getCollegeName,
  getDeptName,
  getDormName,
  formatBatch,
  formatSemester,
  formatStatus
} from '../../utils/translationUtils';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  BedDouble, 
  Play, 
  Download, 
  Search, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';

export const AccommodationDashboard: React.FC = () => {
  const { 
    applications, 
    allocateBed, 
    runAiAutoAllocation, 
    dormitories,
    officialStudents,
    colleges,
    departments
  } = useAuth();
  const { language, t } = useLanguage();

  // Search & Status Filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [allocationMsg, setAllocationMsg] = useState('');

  const filteredApps = applications.filter(a => {
    const sName = getStudentName(language, a.studentName, officialStudents).toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = 
      a.studentName.toLowerCase().includes(q) ||
      sName.includes(q) ||
      a.studentIdNumber.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Execute single allocation
  const handleApproveAndAllocate = (app: AccommodationApplication) => {
    const dorm = app.aiRecommendation?.dormitoryName || 'Block 45 - Tewodros Hall (Men)';
    const room = app.aiRecommendation?.roomNumber || 'B45-103';
    const bed = app.aiRecommendation?.bedNumber || 'Bed 2 (Upper)';

    allocateBed(app.id, dorm, room, bed);
    setAllocationMsg(
      language === 'am'
        ? `ለተማሪ ${getStudentName(language, app.studentName, officialStudents)} በ ${getDormName(language, dorm, dormitories)} ክፍል ${room} ላይ አልጋ በተሳካ ሁኔታ ተመደበ!`
        : `Allocated student ${app.studentName} to ${dorm} • Room ${room} • ${bed}!`
    );
    setTimeout(() => setAllocationMsg(''), 4000);
  };

  // Run AI Batch Allocation
  const handleBatchAI = () => {
    const res = runAiAutoAllocation();
    setAllocationMsg(
      language === 'am' 
        ? 'የአይ (AI) አውቶማቲክ ምደባ ለሁሉም ተማሪዎች በተሳካ ሁኔታ ተጠናቋል!' 
        : res.message
    );
    setTimeout(() => setAllocationMsg(''), 4000);
  };

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
      {/* Top Banner */}
      <div className="rounded-2xl border border-emerald-300 dark:border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-slate-900 dark:via-[#0A1A24] dark:to-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl text-emerald-700 dark:text-emerald-400">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {language === 'am' ? 'የመኖሪያ ምደባና አይ-አልጎሪዝም ማዕከል' : 'Accommodation Allocation & AI Placement Hub'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                {language === 'am' ? 'ዘመናዊ ምደባ' : 'SMART PLACEMENT'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {language === 'am'
                ? 'በአይ (AI) የታገዘ የክፍል ምደባ፡ የባች አንድነት፣ የዲፓርትመንት ቅርበት እና የአካል ተደራሽነትን ያገናዘበ::'
                : 'AI-assisted room matching optimizing batch cohesion, department proximity, and mobility accessibility.'}
            </p>
          </div>
        </div>

        {/* Action Button: Batch AI Run */}
        <button
          onClick={handleBatchAI}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center space-x-2 transition shadow-md cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'am' ? 'ሁሉንም በመጠባበቅ ላይ ያሉትን በአይ (AI) መድብ' : 'Execute AI Auto-Allocation for All Pending'}</span>
        </button>
      </div>

      {allocationMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{allocationMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center space-x-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'am' ? 'በተማሪ ስም፣ መታወቂያ ወይም ዲፓርትመንት ፈልግ...' : 'Search by student name, ID, or department...'}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">{language === 'am' ? 'ሁሉም ሁኔታዎች' : 'All Application Statuses'}</option>
            <option value="PENDING">{language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending Review'}</option>
            <option value="AI_RECOMMENDED">{language === 'am' ? 'በአይ የተመከረ' : 'AI Recommended'}</option>
            <option value="ALLOCATED">{language === 'am' ? 'የተመደበ' : 'Allocated'}</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {language === 'am' ? `ጠቅላላ ${filteredApps.length} ማመልከቻዎች` : `Showing ${filteredApps.length} Applications`}
        </div>
      </div>

      {/* Applications List with AI Recommendation Cards */}
      <div className="space-y-4">
        {filteredApps.map((app) => (
          <div 
            key={app.id}
            className={`p-5 rounded-2xl border transition-all ${
              app.status === 'ALLOCATED'
                ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-cyan-500/30 shadow-sm'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Student Academic Info */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {getStudentName(language, app.studentName, officialStudents)}
                  </h3>
                  <span className="font-mono text-xs text-cyan-700 dark:text-cyan-300 font-bold bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-800">
                    {app.studentIdNumber}
                  </span>
                  {app.specialNeeds && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800">
                      {language === 'am' ? 'ልዩ የጤና / ተደራሽነት ቅድሚያ' : 'MEDICAL / ACCESSIBLE PRIORITY'}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-2">
                  <span>{getCollegeName(language, app.college, colleges)}</span>
                  <span>•</span>
                  <span>{getDeptName(language, app.department, departments)}</span>
                  <span>•</span>
                  <span>{formatBatch(language, app.batch)} ({formatSemester(language, app.semester)})</span>
                </div>

                {app.specialNeedsDescription && (
                  <div className="text-[11px] text-amber-700 dark:text-amber-300/90 mt-1">
                    {language === 'am' ? 'የልዩ ፍላጎት ማስታወሻ፡ ' : 'Special Need Note: '}{app.specialNeedsDescription}
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  app.status === 'ALLOCATED'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                    : app.status === 'AI_RECOMMENDED'
                    ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
                }`}>
                  {formatStatus(language, app.status)}
                </span>
              </div>
            </div>

            {/* AI Recommendation Box */}
            {app.aiRecommendation && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-cyan-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {language === 'am' ? 'በአይ የተመከረ ምደባ፡' : 'AI Recommended Placement:'}
                    </span>
                    <span className="font-mono text-cyan-700 dark:text-cyan-300 font-semibold">
                      {getDormName(language, app.aiRecommendation.dormitoryName, dormitories)} • {language === 'am' ? 'ክፍል' : 'Room'} {app.aiRecommendation.roomNumber} ({formatBedName(app.aiRecommendation.bedNumber)})
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {language === 'am' ? 'ተኳኋኝነት' : 'Match'}: {app.aiRecommendation.score}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {language === 'am' ? 'ምክንያት፡ ' : 'Reason: '}{app.aiRecommendation.reason}
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  {app.status !== 'ALLOCATED' ? (
                    <button
                      onClick={() => handleApproveAndAllocate(app)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'am' ? 'አጽድቅና አልጋ መድብ' : 'Approve & Allocate Bed'}</span>
                    </button>
                  ) : (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'am' ? `በክፍል ${app.allocatedRoom} ተመድቧል` : `Assigned to ${app.allocatedRoom}`}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
