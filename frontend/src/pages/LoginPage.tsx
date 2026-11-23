import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Lock, 
  User as UserIcon, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  HelpCircle,
  X,
  LogIn
} from 'lucide-react';

interface LoginPageProps {
  onBackToHome: () => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToHome, onGoToRegister }) => {
  const { login } = useAuth();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!identifier.trim()) {
      setLoginError(language === 'am' ? 'እባክዎ የተማሪ መታወቂያ ወይም ኢሜይል ያስገቡ' : 'Please enter your Student ID or Email.');
      return;
    }

    if (!password) {
      setLoginError(language === 'am' ? 'እባክዎ የይለፍ ቃል ያስገቡ' : 'Please enter your password.');
      return;
    }

    const result = login(identifier, password);
    if (!result.success) {
      setLoginError(result.message || (language === 'am' ? 'የተሳሳተ መረጃ ገብቷል::' : 'Invalid credentials.'));
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
      
      {/* High-Brightness & Crisp Campus Image Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/images/campus_gate.jpg"
          alt="Wachemo Campus"
          className="w-full h-full object-cover brightness-105 contrast-105"
        />
        {/* Subtle non-blurring overlay to guarantee crisp photo clarity */}
        <div className="absolute inset-0 bg-white/20 dark:bg-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-slate-200 text-xs font-bold shadow-md border border-slate-200 dark:border-slate-700 mb-4 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'am' ? 'ወደ ዋናው ገጽ ይመለሱ' : 'Back to Home'}</span>
        </button>

        {/* Login Card with Smooth Sky/Cyan Theme */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300
          /* Light Mode: Smooth Sky Blue */
          bg-white/95 border-2 border-sky-400 shadow-2xl shadow-sky-950/20
          /* Dark Mode: Deep Navy */
          dark:bg-slate-900/90 dark:border-cyan-500/60 dark:shadow-cyan-950/50"
        >
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-1.5 rounded-full bg-sky-50 dark:bg-cyan-950/60 border-2 border-sky-400 dark:border-cyan-400 mb-3 shadow-md">
              <img 
                src="/assets/images/wachemo_logo.jpg" 
                alt="Wachemo Logo" 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-sky-700 dark:text-cyan-400 font-bold text-xs font-mono uppercase tracking-wider mb-1">
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'የተጠቃሚ መግቢያ' : 'Portal Sign In'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'am' ? 'ወደ ሲስተሙ ይግቡ' : 'Welcome to Wachemo Portal'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xs mx-auto">
              {language === 'am' 
                ? 'የተማሪ መታወቂያ ቁጥር ወይም ሰራተኛ ኢሜይል እና የይለፍ ቃል ያስገቡ' 
                : 'Enter your Student ID or Official Staff Email to access your portal.'}
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/60 text-red-700 dark:text-red-300 text-xs flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                {language === 'am' ? 'የተማሪ መታወቂያ / ሰራተኛ ኢሜይል' : 'Student ID or Official Staff Email'} *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. WU/2024/001 or admin@wachemo.edu.et"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-medium transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                {language === 'am' ? 'የይለፍ ቃል' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-medium transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold rounded-xl shadow-lg shadow-cyan-900/25 text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
            >
              <span>{language === 'am' ? 'ወደ ሲስተሙ ግባ' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {language === 'am' ? 'አዲስ ተማሪ ነዎት?' : "Don't have an account yet?"}{' '}
              <button
                onClick={onGoToRegister}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {language === 'am' ? 'የተማሪ ምዝገባ' : 'Register Here'}
              </button>
            </p>

            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center justify-center space-x-1 mx-auto transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'የመለያዎች መመሪያ (Test Accounts)' : 'Test Credentials Reference'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Credentials Reference Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>{language === 'am' ? 'የሙከራ መለያዎች ዝርዝር' : 'Quick Test Credentials'}</span>
              </h3>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {language === 'am' ? 'የሁሉም ተጠቃሚዎች የጋራ የይለፍ ቃል፡ ' : 'Default password for all roles: '}{' '}
              <code className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">password123</code>
            </p>

            <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
              {[
                { 
                  label: language === 'am' ? 'ዋና አስተዳዳሪ (ዶ/ር ሀብታሙ)' : 'Super Admin (Dr. Habtamu)', 
                  id: 'admin@wachemo.edu.et', 
                  roleColor: 'text-amber-600 dark:text-amber-400' 
                },
                { 
                  label: language === 'am' ? 'ተማሪ (አበበ ከበደ)' : 'Student (Abebe Kebede)', 
                  id: 'WU/2024/001', 
                  roleColor: 'text-cyan-600 dark:text-cyan-400' 
                },
                { 
                  label: language === 'am' ? 'የዶርም ኃላፊ (ፕሮክተር ታሪኩ)' : 'Dorm Manager (Proctor Tariku)', 
                  id: 'dorm.mgr@wachemo.edu.et', 
                  roleColor: 'text-indigo-600 dark:text-indigo-400' 
                },
                { 
                  label: language === 'am' ? 'የመኖሪያ ምደባ ኦፊሰር (ገነት)' : 'Accommodation Officer (Genet)', 
                  id: 'accommodation@wachemo.edu.et', 
                  roleColor: 'text-emerald-600 dark:text-emerald-400' 
                },
                { 
                  label: language === 'am' ? 'የንብረት አስተዳዳሪ (ሰለሞን)' : 'Property Manager (Solomon)', 
                  id: 'property@wachemo.edu.et', 
                  roleColor: 'text-purple-600 dark:text-purple-400' 
                },
                { 
                  label: language === 'am' ? 'የጥገና ኢንጂነር (ዳዊት)' : 'Maintenance Engineer (Dawit)', 
                  id: 'maintenance@wachemo.edu.et', 
                  roleColor: 'text-orange-600 dark:text-orange-400' 
                }
              ].map((acc) => (
                <div 
                  key={acc.id}
                  onClick={() => {
                    setIdentifier(acc.id);
                    setPassword('password123');
                    setShowHelpModal(false);
                  }}
                  className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-cyan-500 cursor-pointer flex justify-between items-center transition"
                >
                  <div>
                    <div className={`font-bold ${acc.roleColor}`}>{acc.label}</div>
                    <div className="font-mono text-[11px] text-slate-500">{acc.id}</div>
                  </div>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                    {language === 'am' ? 'ምረጥ' : 'Select'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                {language === 'am' ? 'ዝጋ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
