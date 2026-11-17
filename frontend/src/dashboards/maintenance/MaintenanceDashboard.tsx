import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MaintenanceComplaint } from '../../types';
import {
  getBilingual,
  getStudentName,
  getDormName,
  formatCategory,
  formatPriority,
  formatStatus
} from '../../utils/translationUtils';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Flame, 
  Droplet, 
  Zap, 
  DoorOpen, 
  Image as ImageIcon, 
  FileCheck, 
  Search,
  Check
} from 'lucide-react';

export const MaintenanceDashboard: React.FC = () => {
  const { complaints, officialStudents, dormitories, updateComplaintStatus } = useAuth();
  const { language, t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceComplaint | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const filteredTickets = complaints.filter(c => {
    if (activeFilter === 'ALL') return true;
    return c.status === activeFilter;
  });

  const urgentCount = complaints.filter(c => c.priority === 'URGENT' && c.status !== 'COMPLETED').length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS').length;
  const completedCount = complaints.filter(c => c.status === 'COMPLETED').length;

  const handleStartRepair = (id: string) => {
    updateComplaintStatus(
      id, 
      'IN_PROGRESS', 
      language === 'am' ? 'ቴክኒሻኑ በቦታው ደርሷል:: ምርመራና የጥገና ስራ ተጀምሯል::' : 'Technician arrived on-site. Diagnostic and repair begun.'
    );
    setActionMsg(language === 'am' ? 'የጥገና ስራው ተጀምሯል (በሂደት ላይ)' : 'Ticket moved to IN PROGRESS');
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleCompleteRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !completionNotes.trim()) return;

    updateComplaintStatus(selectedTicket.id, 'COMPLETED', completionNotes);
    setActionMsg(
      language === 'am' 
        ? `ጥገና ቁጥር ${selectedTicket.ticketNumber} በተሳካ ሁኔታ ተጠናቋል!` 
        : `Ticket ${selectedTicket.ticketNumber} marked as COMPLETED!`
    );
    setSelectedTicket(null);
    setCompletionNotes('');
    setTimeout(() => setActionMsg(''), 3000);
  };

  const getCategoryIcon = (cat: MaintenanceComplaint['category']) => {
    switch (cat) {
      case 'WATER_PLUMBING': return <Droplet className="w-4 h-4 text-cyan-500" />;
      case 'ELECTRICITY': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'DOORS_WINDOWS': return <DoorOpen className="w-4 h-4 text-purple-500" />;
      default: return <Wrench className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="rounded-2xl border border-orange-200 dark:border-orange-500/30 bg-gradient-to-r from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-[#261508] dark:to-slate-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-orange-100 dark:bg-orange-950 border border-orange-300 dark:border-orange-500/40 rounded-2xl text-orange-700 dark:text-orange-400">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {language === 'am' ? 'የጥገናና ፋሲሊቲ ኢንጂነሪንግ ክፍል' : 'Dormitory Maintenance & Work Orders Desk'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30">
                {language === 'am' ? 'የሜዳ ኦፕሬሽን' : 'FIELD OPERATIONS'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {language === 'am'
                ? 'ገቢር የጥገና ትዕዛዞች፣ በአይ የተደረጉ የደረጃ ምደባዎች እና የማጠናቀቂያ ሪፖርቶች በሁሉም ዶርሞች ውስጥ::'
                : 'Active repair tickets, AI severity categorization, and completion logs across student residential blocks.'}
            </p>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-500/40 text-center">
            <div className="text-[10px] text-red-700 dark:text-red-300 uppercase font-mono">
              {language === 'am' ? 'አስቸኳይ አደጋ' : 'Urgent Hazard'}
            </div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center justify-center space-x-1">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>{urgentCount}</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-500/40 text-center">
            <div className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-mono">
              {language === 'am' ? 'በሂደት ላይ' : 'In Progress'}
            </div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{inProgressCount}</div>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer ${
            activeFilter === 'ALL' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {language === 'am' ? `ሁሉም ጥያቄዎች (${complaints.length})` : `All Complaints (${complaints.length})`}
        </button>
        <button
          onClick={() => setActiveFilter('ASSIGNED')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer ${
            activeFilter === 'ASSIGNED' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {language === 'am' ? 'የተመደቡ ስራዎች' : 'Assigned Tasks'}
        </button>
        <button
          onClick={() => setActiveFilter('IN_PROGRESS')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer ${
            activeFilter === 'IN_PROGRESS' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {language === 'am' ? `በሂደት ላይ (${inProgressCount})` : `In Progress (${inProgressCount})`}
        </button>
        <button
          onClick={() => setActiveFilter('COMPLETED')}
          className={`py-2 px-3 border-b-2 transition cursor-pointer ${
            activeFilter === 'COMPLETED' ? 'border-orange-500 text-orange-600 dark:text-orange-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          {language === 'am' ? `የተጠናቀቁ (${completedCount})` : `Completed (${completedCount})`}
        </button>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map(ticket => (
          <div 
            key={ticket.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              ticket.priority === 'URGENT' && ticket.status !== 'COMPLETED'
                ? 'bg-red-50/40 dark:bg-slate-900/90 border-red-300 dark:border-red-500/50 shadow-sm'
                : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-orange-600 dark:text-orange-400">
                  {getCategoryIcon(ticket.category)}
                  <span>{ticket.ticketNumber}</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ticket.priority === 'URGENT' 
                    ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-400 border border-red-300 dark:border-red-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {formatPriority(language, ticket.priority)}
                </span>
              </div>

              <div>
                <div className="text-slate-900 dark:text-white font-bold text-sm">
                  {getDormName(language, ticket.dormitoryName, dormitories)}
                </div>
                <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                  {language === 'am' ? 'ቦታ፡ ክፍል ' : 'Location: Room '} {ticket.roomNumber}
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                "{ticket.description}"
              </p>

              {ticket.imageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-28">
                  <img src={ticket.imageUrl} alt="Complaint Issue" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white font-mono">
                    {language === 'am' ? 'የተማሪው ፎቶ' : 'Student Photo'}
                  </span>
                </div>
              )}

              <div className="text-[10px] text-slate-400 flex justify-between pt-1">
                <span>{language === 'am' ? 'አመልካች፡ ' : 'Reporter: '}{getStudentName(language, ticket.studentName, officialStudents)}</span>
                <span>{ticket.createdAt}</span>
              </div>

              {ticket.repairNotes && (
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                  {language === 'am' ? 'የጥገና ማስታወሻ፡ ' : 'Notes: '}{ticket.repairNotes}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-end space-x-2">
              {ticket.status !== 'IN_PROGRESS' && ticket.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleStartRepair(ticket.id)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition shadow-sm cursor-pointer"
                >
                  {language === 'am' ? 'ስራ ጀምር' : 'Start Work'}
                </button>
              )}

              {ticket.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setCompletionNotes('');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition flex items-center space-x-1 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'am' ? 'እንደተጠናቀቀ መዝግብ' : 'Mark Completed'}</span>
                </button>
              )}

              {ticket.status === 'COMPLETED' && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'am' ? 'ስራው ተረጋግጧል' : 'Work Verified'}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Notes Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>{language === 'am' ? `የተከናወነውን ጥገና አረጋግጥ፡ ${selectedTicket.ticketNumber}` : `Complete Repair Task: ${selectedTicket.ticketNumber}`}</span>
              </h3>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCompleteRepair} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-bold">
                  {language === 'am' ? 'የተከናወነው ጥገና ዝርዝር ማስታወሻ *' : 'Work Done / Repair Notes *'}
                </label>
                <textarea
                  rows={3}
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder={language === 'am' ? 'የተተካውን መለዋወጫና የተከናወነውን ስራ በዝርዝር ይግለጹ...' : 'Detail replaced parts, tests conducted, and resolved defect...'}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded text-xs cursor-pointer"
                >
                  {language === 'am' ? 'ሰርዝ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs cursor-pointer"
                >
                  {language === 'am' ? 'ስራውን አጠናቅቅ' : 'Submit & Close Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
