import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Room, Bed } from '../../types';
import { DashboardLayout, TaskListItem } from '../../components/layout/DashboardLayout';
import {
  getBilingual,
  getStudentName,
  getCollegeName,
  getDeptName,
  getDormName,
  formatStatus,
  formatCategory
} from '../../utils/translationUtils';
import { 
  Building2, 
  Layers, 
  BedDouble, 
  UserCheck, 
  UserMinus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Calendar,
  ShieldAlert
} from 'lucide-react';

export const DormitoryDashboard: React.FC = () => {
  const { dormitories, rooms, officialStudents, departments, submitComplaint } = useAuth();
  const { language, t } = useLanguage();

  // Selected Dormitory
  const [selectedDormId, setSelectedDormId] = useState(dormitories[0]?.id || 'dorm-1');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Check-In / Check-Out Station
  const [searchStudentId, setSearchStudentId] = useState('');
  const [checkInLog, setCheckInLog] = useState<Array<{ id: string; student: string; action: 'CHECK_IN' | 'CHECK_OUT'; time: string }>>([
    { id: '1', student: 'Abebe Kebede (WU/2024/001)', action: 'CHECK_IN', time: 'Today 08:30 AM' },
    { id: '2', student: 'Samuel Alemu (WU/2024/020)', action: 'CHECK_IN', time: 'Today 09:15 AM' }
  ]);
  const [checkActionMsg, setCheckActionMsg] = useState('');

  // Facility damage report modal
  const [damageRoom, setDamageRoom] = useState('B45-103');
  const [damageDesc, setDamageDesc] = useState('');
  const [damageSuccess, setDamageSuccess] = useState('');

  const currentDorm = dormitories.find(d => d.id === selectedDormId) || dormitories[0];
  const dormRooms = rooms.filter(r => r.dormitoryId === selectedDormId || r.dormitoryName.includes(currentDorm?.blockNumber || ''));
  const floorRooms = dormRooms.filter(r => r.floorNumber === selectedFloor);

  // Handle Check In
  const handleCheckIn = () => {
    if (!searchStudentId.trim()) return;
    const item = {
      id: String(Date.now()),
      student: searchStudentId,
      action: 'CHECK_IN' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCheckInLog(prev => [item, ...prev]);
    setCheckActionMsg(
      language === 'am' 
        ? `የተማሪ መግቢያ ተመዝግቧል፡ ${searchStudentId}` 
        : `Checked in student: ${searchStudentId}`
    );
    setSearchStudentId('');
  };

  // Handle Check Out
  const handleCheckOut = () => {
    if (!searchStudentId.trim()) return;
    const item = {
      id: String(Date.now()),
      student: searchStudentId,
      action: 'CHECK_OUT' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCheckInLog(prev => [item, ...prev]);
    setCheckActionMsg(
      language === 'am' 
        ? `የተማሪ መውጫ ተመዝግቧል፡ ${searchStudentId}` 
        : `Checked out student: ${searchStudentId}`
    );
    setSearchStudentId('');
  };

  // Handle Damage Report
  const handleDamageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!damageDesc.trim()) return;

    submitComplaint({
      studentId: 'PROCTOR-01',
      studentName: 'Proctor Tariku (Dorm Manager)',
      studentPhone: '+251 912 345678',
      dormitoryName: currentDorm?.name || 'Block 45',
      roomNumber: damageRoom,
      category: 'DOORS_WINDOWS',
      description: damageDesc,
      priority: 'HIGH'
    });

    setDamageSuccess(
      language === 'am' 
        ? 'የብልሽት መረጃው ለዩኒቨርሲቲው ጥገና ቡድን በተሳካ ሁኔታ ተልኳል::' 
        : 'Damage issue logged to university maintenance work order queue.'
    );
    setDamageDesc('');
    setTimeout(() => setDamageSuccess(''), 3500);
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

  const dormTaskLists: TaskListItem[] = [
    {
      id: 'matrix',
      label: 'Room & Bed Matrix',
      amharicLabel: 'የክፍሎችና አልጋዎች ማትሪክስ',
      icon: Building2,
      badge: `${currentDorm?.totalRooms || 48} Rooms`,
      hasChevron: true
    },
    {
      id: 'checkin',
      label: 'Check-In Station',
      amharicLabel: 'የተማሪዎች መግቢያ ጣቢያ',
      icon: UserCheck,
      hasChevron: true
    },
    {
      id: 'damage',
      label: 'Damage Reports',
      amharicLabel: 'የህንፃ ብልሽት ሪፖርት',
      icon: AlertTriangle,
      badge: 'Report',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
    }
  ];

  const [activeTab, setActiveTab] = useState<'matrix' | 'checkin' | 'damage'>('matrix');

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab as any)}
      taskLists={dormTaskLists}
      bannerImage="/assets/images/dormitory_blocks.jpg"
    >
      <div className="space-y-6 animate-in fade-in">
      {/* Dorm Header */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-500/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {getDormName(language, currentDorm?.name || '', dormitories)}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                {currentDorm?.blockNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'am' ? 'የተመደበው ፕሮክተር፡' : 'Proctor Assigned:'}{' '}
              <span className="font-medium text-slate-800 dark:text-white">
                {language === 'am' ? 'ፕሮክተር ታሪኩ መንግስቱ' : currentDorm?.managerName}
              </span>{' '}
              • {language === 'am' ? 'ፎቆች፡' : 'Floors:'} {currentDorm?.totalFloors} •{' '}
              {language === 'am' ? 'ጠቅላላ አልጋዎች፡' : 'Capacity:'} {currentDorm?.totalBeds} {language === 'am' ? 'አልጋዎች' : 'Beds'}
            </p>
          </div>
        </div>

        {/* Dorm Selector */}
        <div className="flex items-center space-x-2">
          {dormitories.map(d => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDormId(d.id);
                setSelectedFloor(1);
                setSelectedRoom(null);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                selectedDormId === d.id
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {language === 'am' ? d.blockNumber.replace('Block', 'ብሎክ') : d.blockNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Room & Bed Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Floor Selector & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'am' ? 'ፎቅ ምረጥ፡' : 'Select Floor:'}
              </span>
              {[1, 2, 3, 4].slice(0, currentDorm?.totalFloors || 4).map(f => (
                <button
                  key={f}
                  onClick={() => {
                    setSelectedFloor(f);
                    setSelectedRoom(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedFloor === f
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {language === 'am' ? `ፎቅ ${f}` : `Floor ${f}`}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{language === 'am' ? 'ክፍት' : 'Available'}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm"></span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{language === 'am' ? 'የተያዘ' : 'Occupied'}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{language === 'am' ? 'ጥገና' : 'Maintenance'}</span>
              </span>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {floorRooms.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                {language === 'am' ? `በፎቅ ${selectedFloor} ላይ የተዋቀረ ክፍል የለም::` : `No rooms currently configured on Floor ${selectedFloor}.`}
              </div>
            ) : (
              floorRooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    selectedRoom?.id === room.id
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-slate-700 shadow-sm hover:shadow'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{room.roomNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      room.status === 'FULL' 
                        ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {room.occupiedCount} / {room.capacity} {language === 'am' ? 'አልጋዎች' : 'Beds'}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mt-3">
                    {room.beds.map((b, idx) => (
                      <div
                        key={b.id}
                        className={`p-1.5 rounded-lg text-center text-[10px] font-mono border font-bold ${
                          b.status === 'OCCUPIED'
                            ? 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300'
                            : b.status === 'MAINTENANCE'
                            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                        }`}
                        title={b.studentName ? `${formatBedName(b.bedNumber)}: ${getStudentName(language, b.studentName, officialStudents)}` : `${formatBedName(b.bedNumber)}: ${language === 'am' ? 'ክፍት' : 'Available'}`}
                      >
                        B{idx + 1}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-medium">
                    <span>{room.roomType}</span>
                    <span>{language === 'am' ? `ፎቅ ${room.floorNumber}` : `Floor ${room.floorNumber}`}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Inspect Selected Room Detail */}
          {selectedRoom && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 space-y-4 shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <BedDouble className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <span>{language === 'am' ? `የክፍል ዝርዝር ምርመራ፡ ${selectedRoom.roomNumber}` : `Room Detailed Inspection: ${selectedRoom.roomNumber}`}</span>
                </h4>
                <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm cursor-pointer p-1">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {selectedRoom.beds.map(bed => (
                  <div key={bed.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBedName(bed.bedNumber)}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        bed.status === 'OCCUPIED' ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400'
                      }`}>
                        {formatStatus(language, bed.status)}
                      </span>
                    </div>
                    {bed.studentName ? (
                      <div className="text-[11px] text-slate-700 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-white">{getStudentName(language, bed.studentName, officialStudents)}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{bed.studentId}</div>
                        <div className="text-[10px] text-blue-600 dark:text-cyan-400 mt-0.5">{getDeptName(language, bed.studentDepartment || '', departments)}</div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold italic">
                        {language === 'am' ? 'ለአዲስ ምደባ ክፍት ነው' : 'Available for placement'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Check-In / Out Station */}
      {activeTab === 'checkin' && (
        <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
              <UserCheck className="w-5 h-5 text-emerald-500" />
              <span>{language === 'am' ? 'የተማሪዎች መግቢያና መውጫ ጣቢያ' : 'Student Gate Check-In / Check-Out Station'}</span>
            </h3>

            {checkActionMsg && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{checkActionMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-slate-800 dark:text-slate-200 font-bold text-xs">
                {language === 'am' ? 'የተማሪ መታወቂያ አስገባ ወይም ቃኝ (Scan)' : 'Scan or Enter Official Student ID'}
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. WU/2024/001"
                  value={searchStudentId}
                  onChange={(e) => setSearchStudentId(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{language === 'am' ? 'መግቢያ (Check In)' : 'Check In'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCheckOut}
                  className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>{language === 'am' ? 'መውጫ (Check Out)' : 'Check Out'}</span>
                </button>
              </div>
            </div>

            {/* Daily Gate Log Table */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3">
                {language === 'am' ? 'የዛሬው የበር እንቅስቃሴ መዝገብ' : "Today's Verified Gate Log"}
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {checkInLog.map(log => (
                  <div key={log.id} className="p-3 bg-white dark:bg-slate-950 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm">{log.student}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{log.time}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                      log.action === 'CHECK_IN' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {log.action === 'CHECK_IN' ? (language === 'am' ? 'ገባ (Checked In)' : 'CHECKED IN') : (language === 'am' ? 'ወጣ (Checked Out)' : 'CHECKED OUT')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Damage Reports */}
      {activeTab === 'damage' && (
        <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>{language === 'am' ? 'የህንጻ ብልሽት ሪፖርት ማድረጊያ' : 'Report Building Damage & Facility Work Order'}</span>
            </h3>

            {damageSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl flex items-center space-x-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{damageSuccess}</span>
              </div>
            )}

            <form onSubmit={handleDamageSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {language === 'am' ? 'የክፍል ወይም የአካባቢ ቦታ (Room/Area) *' : 'Specific Room or Building Area *'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'am' ? 'ለምሳሌ፡ B45-201 ወይም 2ኛ ፎቅ ኮሪደር...' : 'e.g. B45-201 or 2nd Floor Corridor'}
                  value={damageRoom}
                  onChange={(e) => setDamageRoom(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  {language === 'am' ? 'የብልሽቱ ዝርዝር መግለጫ *' : 'Damage Description & Maintenance Need *'}
                </label>
                <textarea
                  rows={3}
                  placeholder={language === 'am' ? 'የተበላሸውን እቃ ወይም የመሰረተ ልማት ችግር በዝርዝር ይግለጹ...' : 'Describe broken furniture, plumbing leak, electrical socket failure, or lock malfunction...'}
                  value={damageDesc}
                  onChange={(e) => setDamageDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition cursor-pointer shadow-md text-xs"
              >
                {language === 'am' ? 'የብልሽት የስራ ትዕዛዝ አስገባ' : 'Submit Facility Work Order'}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};
