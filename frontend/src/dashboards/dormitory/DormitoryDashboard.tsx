import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Room, Bed } from '../../types';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
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

      {/* Main Grid: Interactive Room Bed Matrix + Check-In Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Floor and Bed Visual Map */}
        <div className="lg:col-span-2 space-y-4">
          {/* Floor Tabs */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
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
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedFloor === f
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {language === 'am' ? `ፎቅ ${f}` : `Floor ${f}`}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="hidden sm:flex items-center space-x-3 text-[10px] font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-500 dark:text-slate-400">{language === 'am' ? 'ክፍት' : 'Available'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                <span className="text-slate-500 dark:text-slate-400">{language === 'am' ? 'የተያዘ' : 'Occupied'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-500 dark:text-slate-400">{language === 'am' ? 'ጥገና' : 'Maintenance'}</span>
              </span>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {floorRooms.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                {language === 'am' ? `በፎቅ ${selectedFloor} ላይ የተዋቀረ ክፍል የለም::` : `No rooms currently configured on Floor ${selectedFloor}.`}
              </div>
            ) : (
              floorRooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRoom?.id === room.id
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-cyan-500 shadow-md'
                      : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{room.roomNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                        className={`p-1.5 rounded-lg text-center text-[10px] font-mono border ${
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

                  <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                    <span>{room.roomType}</span>
                    <span>{language === 'am' ? `ፎቅ ${room.floorNumber}` : `Floor ${room.floorNumber}`}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Inspect Selected Room Detail */}
          {selectedRoom && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 space-y-3 shadow-md animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <BedDouble className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{language === 'am' ? `የክፍል ዝርዝር፡ ${selectedRoom.roomNumber}` : `Room Detail: ${selectedRoom.roomNumber}`}</span>
                </h4>
                <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer">✕</button>
              </div>

              <div className="space-y-2">
                {selectedRoom.beds.map(bed => (
                  <div key={bed.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>{formatBedName(bed.bedNumber)}</span>
                        <span className={`text-[9px] font-mono px-1.5 rounded ${
                          bed.status === 'OCCUPIED' ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400'
                        }`}>
                          {formatStatus(language, bed.status)}
                        </span>
                      </div>
                      {bed.studentName && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                          {getStudentName(language, bed.studentName, officialStudents)} ({bed.studentId}) • {getDeptName(language, bed.studentDepartment || '', departments)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Check In / Check Out Station */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-500" />
              <span>{language === 'am' ? 'የተማሪዎች መግቢያና መውጫ ጣቢያ' : 'Student Check-In / Check-Out Station'}</span>
            </h3>

            {checkActionMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 rounded text-emerald-800 dark:text-emerald-300 text-xs">
                {checkActionMsg}
              </div>
            )}

            <div className="space-y-2 text-xs">
              <label className="block text-slate-700 dark:text-slate-300 font-bold">
                {language === 'am' ? 'የተማሪ መታወቂያ አስገባ / ቃኝ' : 'Scan or Enter Student ID'}
              </label>
              <input
                type="text"
                placeholder="e.g. WU/2024/001"
                value={searchStudentId}
                onChange={(e) => setSearchStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckIn}
                  className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-1 transition shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'መግቢያ (Check In)' : 'Check In'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheckOut}
                  className="py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-xs flex items-center justify-center space-x-1 transition cursor-pointer"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'መውጫ (Check Out)' : 'Check Out'}</span>
                </button>
              </div>
            </div>

            {/* Daily Gate Log */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">
                {language === 'am' ? 'የዛሬው የበር እንቅስቃሴ መዝገብ' : "Today's Gate Log"}
              </div>
              <div className="space-y-1.5 text-xs">
                {checkInLog.map(log => (
                  <div key={log.id} className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-slate-900 dark:text-white font-medium text-[11px]">{log.student}</div>
                      <div className="text-[9px] text-slate-500">{log.time}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      log.action === 'CHECK_IN' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {log.action === 'CHECK_IN' ? (language === 'am' ? 'ገባ' : 'IN') : (language === 'am' ? 'ወጣ' : 'OUT')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Facility Damage Reporter */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{language === 'am' ? 'የህንጻ ብልሽት ሪፖርት ማድረጊያ' : 'Report Building Damage'}</span>
            </h3>

            {damageSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs rounded">
                {damageSuccess}
              </div>
            )}

            <form onSubmit={handleDamageSubmit} className="space-y-2 text-xs">
              <input
                type="text"
                placeholder={language === 'am' ? 'ክፍል / ኮሪደር (ለምሳሌ፡ B45-201)...' : 'Room / Area (e.g. B45-201 or 2nd Floor Corridor)'}
                value={damageRoom}
                onChange={(e) => setDamageRoom(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                required
              />
              <textarea
                rows={2}
                placeholder={language === 'am' ? 'የተበላሸውን እቃ ወይም የመሰረተ ልማት ችግር ይግለጹ...' : 'Describe broken property or structural issue...'}
                value={damageDesc}
                onChange={(e) => setDamageDesc(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                required
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded transition cursor-pointer"
              >
                {language === 'am' ? 'የብልሽት ትዕዛዝ መዝግብ' : 'Log Damage Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
