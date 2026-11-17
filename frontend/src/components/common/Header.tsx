import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  LogOut, 
  UserCheck, 
  Building2,
  Users,
  Wrench,
  Package,
  Sun,
  Moon,
  Globe
} from 'lucide-react';

interface HeaderProps {
  onNavigateHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome }) => {
  const { currentUser, role, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const roleLabels: Record<UserRole, { label: string; amharic: string; icon: any; color: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', amharic: 'ዋና አስተዳዳሪ', icon: ShieldCheck, color: 'text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10' },
    STUDENT: { label: 'Student Portal', amharic: 'የተማሪ ፖርታል', icon: UserCheck, color: 'text-cyan-700 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10' },
    DORMITORY_MANAGER: { label: 'Dorm Manager', amharic: 'የዶርም ኃላፊ', icon: Building2, color: 'text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10' },
    ACCOMMODATION_OFFICER: { label: 'Accommodation Officer', amharic: 'የመኖሪያ ኦፊሰር', icon: Users, color: 'text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10' },
    PROPERTY_MANAGER: { label: 'Property Manager', amharic: 'የንብረት አስተዳዳሪ', icon: Package, color: 'text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10' },
    MAINTENANCE_STAFF: { label: 'Maintenance Staff', amharic: 'የጥገና ባለሙያ', icon: Wrench, color: 'text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10' },
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#060D1E]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Single Sleek Navbar Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        
        {/* Brand Logo & Required Institutional Title */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none min-w-0"
          title={language === 'am' ? 'ወደ ዋናው ገጽ ይመለሱ' : 'Return to Home'}
        >
          <img 
            src="/assets/images/wachemo_logo.jpg" 
            alt="Wachemo University Logo" 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-cyan-600 dark:border-cyan-400 shadow-md group-hover:scale-105 transition duration-200 shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight truncate">
              {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold text-cyan-700 dark:text-cyan-400 tracking-tight leading-tight truncate">
              {language === 'am' 
                ? 'በአይ-የተደገፈ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም' 
                : 'AI-Powered University Accommodation and Property Management System'}
            </p>
          </div>
        </div>

        {/* Right Side Controls: Only Single Language Switcher, Theme Toggle, Session Action */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Language Toggle: Only ONE language displayed (EN or AM) at a time per user requirement */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
            title={language === 'en' ? 'Switch to Amharic (አማርኛ)' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-mono">{language === 'en' ? 'አማ' : 'EN'}</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* User Role Indicator & Logout (Shown only when logged in) */}
          {currentUser && role && (
            <>
              <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" />

              <div className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold ${roleLabels[role].color}`}>
                {React.createElement(roleLabels[role].icon, { className: 'w-3.5 h-3.5' })}
                <span>
                  {language === 'am' ? roleLabels[role].amharic : roleLabels[role].label}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/60 dark:hover:bg-red-900/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold shadow-sm transition-all cursor-pointer"
                title={language === 'am' ? 'ከሲስተሙ ውጣ' : 'Sign Out'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'am' ? 'ውጣ' : 'Sign Out'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
