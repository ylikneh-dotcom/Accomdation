import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import {
  X,
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  LogOut,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Building2,
  Users,
  Package,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export interface TaskListItem {
  id: string;
  label: string;
  amharicLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  hasChevron?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  taskLists: TaskListItem[];
  bannerImage?: string;
}

/* ─────────────────────────────────────────────────────────
   Distinctive Non-Standard Animated Hamburger Icon
   Three styled lines:
   - Line 1: Long gradient cyan/blue bar
   - Line 2: Center dot + medium amber bar
   - Line 3: Stepped gradient bar
   When opened, morphs smoothly into an artistic 'X'
   ───────────────────────────────────────────────────────── */
const CustomHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div className="relative w-6 h-6 flex flex-col items-center justify-center cursor-pointer select-none">
    {/* Bar 1 (Top) */}
    <span
      className={`block absolute h-[2.5px] rounded-full transition-all duration-300 ease-in-out
        bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-400
        ${isOpen ? 'w-5 rotate-45 translate-y-0' : 'w-5 -translate-y-1.5'}`}
    />
    {/* Bar 2 (Middle - dot + bar) */}
    <div
      className={`absolute flex items-center space-x-1 transition-all duration-200 ease-in-out
        ${isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0" />
      <span className="w-3.5 h-[2.5px] rounded-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400" />
    </div>
    {/* Bar 3 (Bottom) */}
    <span
      className={`block absolute h-[2.5px] rounded-full transition-all duration-300 ease-in-out
        bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-blue-400 dark:to-cyan-400
        ${isOpen ? 'w-5 -rotate-45 translate-y-0' : 'w-4 translate-y-1.5 translate-x-0.5'}`}
    />
  </div>
);

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  taskLists,
  bannerImage = '/assets/images/dormitory_blocks.jpg'
}) => {
  const { currentUser, role, logout, officialStudents, properties } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Sidebar list display state: ONLY displays when hamburger is clicked!
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Notifications dropdown state
  const [showNotifications, setShowNotifications] = useState(false);

  // Live filtered search results
  const searchResults = searchQuery.trim()
    ? [
        ...officialStudents
          .filter(
            (s) =>
              s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .map((s) => ({
            type: 'student',
            title: s.fullName,
            subtitle: `${s.studentId} • ${s.departmentName}`,
            tab: 'roster'
          })),
        ...properties
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.propertyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 3)
          .map((p) => ({
            type: 'property',
            title: p.name,
            subtitle: `${p.propertyCode} • ${p.buildingName}`,
            tab: 'dormitories'
          }))
      ]
    : [];

  const roleLabels: Record<UserRole, { label: string; amharic: string; icon: any; color: string }> = {
    SUPER_ADMIN: {
      label: 'Super Admin',
      amharic: 'ዋና አስተዳዳሪ',
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40'
    },
    STUDENT: {
      label: 'Student Portal',
      amharic: 'የተማሪ ፖርታል',
      icon: UserCheck,
      color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40'
    },
    DORMITORY_MANAGER: {
      label: 'Dorm Manager',
      amharic: 'የዶርም ኃላፊ',
      icon: Building2,
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40'
    },
    ACCOMMODATION_OFFICER: {
      label: 'Accommodation Officer',
      amharic: 'የመኖሪያ ኦፊሰር',
      icon: Users,
      color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
    },
    PROPERTY_MANAGER: {
      label: 'Property Manager',
      amharic: 'የንብረት አስተዳዳሪ',
      icon: Package,
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40'
    },
    MAINTENANCE_STAFF: {
      label: 'Maintenance Staff',
      amharic: 'የጥገና ባለሙያ',
      icon: Wrench,
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-300 dark:border-orange-500/40'
    }
  };

  const currentRoleInfo = role ? roleLabels[role] : roleLabels.SUPER_ADMIN;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050C1F] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* ========================================================= */}
      {/* TOP NAVBAR: HAMBURGER, UNIVERSITY LOGO & TITLE ON NAVBAR  */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#071129]/95 backdrop-blur-md border-b border-slate-200 dark:border-cyan-500/20 px-3 sm:px-6 py-2.5 shadow-sm dark:shadow-md transition-colors duration-200">
        <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-full">
          
          {/* Left: Non-Standard Hamburger + University Logo & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
            {/* Non-Standard Animated Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 dark:from-slate-800 dark:to-slate-800/80 dark:hover:from-slate-700 dark:hover:to-slate-700/80 border border-blue-200 dark:border-cyan-500/30 shadow-sm transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              title={language === 'am' ? 'የተግባራት ማውጫ (ዝርዝር)' : 'Navigation Task List'}
              aria-label="Toggle Navigation List"
            >
              <CustomHamburgerIcon isOpen={sidebarOpen} />
            </button>

            {/* University Logo */}
            <div className="relative shrink-0">
              <div className="p-0.5 rounded-full bg-blue-50 dark:bg-cyan-950/80 border-2 border-blue-500 dark:border-cyan-400 shadow-md">
                <img
                  src="/assets/images/wachemo_logo.jpg"
                  alt="Wachemo Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
              </div>
            </div>

            {/* University Institutional Title & Subtitle */}
            <div className="min-w-0 text-left">
              <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white leading-tight truncate">
                {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
              </h1>
              <p className="text-[9px] sm:text-[11px] font-semibold text-blue-600 dark:text-cyan-300 leading-tight truncate hidden xs:block">
                {language === 'am'
                  ? 'በአይ-የተደገፈ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም'
                  : 'AI-Powered University Accommodation & Property Management System'}
              </p>
            </div>
          </div>

          {/* Center: Universal Search Bar */}
          <div className="relative flex-1 max-w-xs sm:max-w-md hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder={language === 'am' ? 'ተማሪዎችን፣ ክፍሎችን ወይም ንብረቶችን ይፈልጉ...' : 'Search students, rooms, or properties...'}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-blue-500/30 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-400 transition-all"
            />

            {/* Instant Search Results Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-cyan-500/40 rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-2 py-1 font-mono uppercase tracking-wider">
                  {language === 'am' ? 'ፈጣን የፍለጋ ውጤቶች' : 'Quick Search Matches'}
                </p>
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onMouseDown={() => {
                      onTabChange(res.tab);
                      setSearchQuery('');
                    }}
                    className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-xs flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300">
                        {res.title}
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{res.subtitle}</p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-500/40 uppercase font-mono">
                      {res.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Notifications, Theme, Language, Profile Pill */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 relative cursor-pointer transition-colors"
                title={language === 'am' ? 'ማሳወቂያዎች' : 'Notifications'}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-[#071129]">
                  3
                </span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-blue-200 dark:border-cyan-500/40 rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {language === 'am' ? 'የሲስተም ማሳወቂያዎች (3 አዲስ)' : 'Notifications (3 New)'}
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {language === 'am' ? 'የአካዳሚክ ዓመት 2017 ተማሪዎች ዝርዝር ተጭኗል' : 'Batch 2024 admissions uploaded'}
                        </p>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">10 mins ago • Registrar</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-start space-x-2">
                      <Info className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {language === 'am' ? 'የአይ-ምደባ ሞተር 75% ማደሪያ አጠናቋል' : 'AI Placement: 75% occupancy reached'}
                        </p>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">30 mins ago • Placement Engine</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {language === 'am' ? '1 የጥገና ቅሬታ አስቸኳይ ክትትል ይሻል' : 'Urgent maintenance ticket reported'}
                        </p>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">1 hour ago • Block 45</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle (Sun / Moon) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 cursor-pointer transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Language Switcher (EN / አማ) */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-cyan-500/30 shadow-sm cursor-pointer transition-all"
              title={language === 'en' ? 'Switch to Amharic (አማርኛ)' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span className="font-mono">{language === 'en' ? 'EN' : 'አማ'}</span>
            </button>

            {/* User Profile Pill & Role Badge */}
            <div className="hidden sm:flex items-center space-x-2 pl-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentRoleInfo.color}`}>
                {language === 'am' ? currentRoleInfo.amharic : currentRoleInfo.label}
              </span>
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser?.name || 'User'}
                className="w-7 h-7 rounded-full object-cover border border-blue-400 dark:border-cyan-400"
              />
            </div>

            {/* Quick Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-800/40 cursor-pointer transition-all"
              title={language === 'am' ? 'ውጣ' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SLIDE-OUT TASK LIST DRAWER: ONLY DISPLAYS ON CLICK!        */}
      {/* "when click that list must display when not click that     */}
      {/*  part list must not display"                              */}
      {/* ========================================================= */}
      
      {/* Backdrop overlay (clicking closes the drawer) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Slide-Out Navigation Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50 bg-white dark:bg-[#071129] border-r border-slate-200 dark:border-cyan-500/20 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-cyan-500/20 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-full bg-blue-50 dark:bg-cyan-950/90 border-2 border-blue-500 dark:border-cyan-400 shadow-sm">
              <img
                src="/assets/images/wachemo_logo.jpg"
                alt="Wachemo Logo"
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
              </h2>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400">
                {language === 'am' ? 'የተግባራት ማውጫ' : 'Navigation Task List'}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Navigation List"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task List Items */}
        <div className="flex-1 py-3 px-3 space-y-1.5 overflow-y-auto">
          <p className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {language === 'am' ? 'ተግባራትና ክፍሎች' : 'Tasks & Modules'}
          </p>

          {taskLists.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false); // Closes list upon selection!
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 scale-[1.01]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <ItemIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-500 dark:text-cyan-400 group-hover:scale-110 transition-transform'}`} />
                  <span className="truncate">
                    {language === 'am' ? item.amharicLabel : item.label}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.badgeColor || 'bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Drawer Footer: User Profile & Full Logout */}
        <div className="p-3.5 border-t border-slate-200 dark:border-cyan-500/20 bg-slate-50/80 dark:bg-[#050C1F]/90 space-y-3">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-blue-400 dark:border-cyan-400/80 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Yared Likneh'}
              </h4>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-cyan-400 block truncate">
                {language === 'am' ? currentRoleInfo.amharic : currentRoleInfo.label}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/40 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'am' ? 'ከሲስተም ውጣ' : 'Logout from Portal'}</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* TOP UNIVERSITY IMAGE BANNER                               */}
      {/* ========================================================= */}
      <div className="px-3 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-200 dark:border-cyan-500/30 shadow-lg dark:shadow-2xl bg-gradient-to-r from-[#003882] via-[#0251BC] to-[#0468E8] min-h-[120px] sm:min-h-[140px] flex items-center justify-between">
          {/* Crystal-Clear Campus University Photo on Right Side */}
          <div className="absolute right-0 top-0 bottom-0 w-3/5 sm:w-2/3 md:w-3/5 pointer-events-none overflow-hidden">
            <img
              src={bannerImage}
              alt="Wachemo University Campus"
              className="w-full h-full object-cover object-right sm:object-center brightness-105 contrast-105"
            />
            {/* Subtle left feather edge to blend seamlessly into header blue, leaving the campus building 100% crystal clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#003882] via-[#003882]/80 via-10% to-transparent to-30%" />
          </div>

          {/* Left Side Content & Branding */}
          <div className="relative z-10 p-4 sm:p-6 lg:p-7 flex items-center space-x-3 sm:space-x-4 max-w-xl">
            {/* Glowing University Emblem */}
            <div className="shrink-0 p-1 rounded-full bg-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <img
                src="/assets/images/wachemo_logo.jpg"
                alt="Wachemo Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
            </div>

            {/* University Headings */}
            <div className="text-left">
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight drop-shadow-md">
                {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
              </h2>
              <p className="text-[11px] sm:text-sm font-semibold text-cyan-100 tracking-tight mt-0.5 leading-snug">
                {language === 'am'
                  ? 'በአይ-የተደገፈ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም'
                  : 'AI-Powered University Accommodation and Property Management System'}
              </p>
              <p className="text-[10px] sm:text-xs italic text-cyan-200/90 font-medium tracking-wide mt-1">
                {language === 'am'
                  ? 'ብልህ አስተዳደር • የላቀ አገልግሎት • የተሳሰረ ግቢ'
                  : 'Smart Management • Better Service • A Connected Campus'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN DASHBOARD CONTENT AREA                               */}
      {/* ========================================================= */}
      <main className="px-3 sm:px-6 lg:px-8 py-5 flex-1">
        {children}
      </main>
    </div>
  );
};
