import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { formatBatch, formatSemester } from '../utils/translationUtils';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  ArrowLeft,
  SearchCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Fingerprint,
  UserPlus
} from 'lucide-react';

interface RegisterPageProps {
  onBackToHome: () => void;
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onBackToHome, onGoToLogin }) => {
  const {
    registerAndVerifyStudent,
    colleges,
    departments,
    batches,
    semesters
  } = useAuth();
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Form state
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('Batch 2024');
  const [semester, setSemester] = useState('Semester 1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'flagged' | null;
    message: string;
  }>({ type: null, message: '' });

  // Filtered departments by selected college
  const filteredDepartments = departments.filter(d => {
    if (!college) return true;
    return d.collegeName === college;
  });

  const handleCollegeChange = (colName: string) => {
    setCollege(colName);
    const validDepts = departments.filter(d => d.collegeName === colName);
    if (!validDepts.some(d => d.name === department)) {
      setDepartment(validDepts.length > 0 ? validDepts[0].name : '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: null, message: '' });

    if (!studentId || !fullName || !college || !department || !batch || !semester || !password) {
      setFeedback({
        type: 'error',
        message: language === 'am' ? 'እባክዎ ሁሉንም መስኮች በትክክል ይሙሉ::' : 'All registration fields are required.'
      });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({
        type: 'error',
        message: language === 'am' ? 'የይለፍ ቃሎች አይመሳሰሉም::' : 'Passwords do not match.'
      });
      return;
    }

    if (password.length < 6) {
      setFeedback({
        type: 'error',
        message: language === 'am' ? 'የይለፍ ቃል ቢያንስ 6 ፊደላት ይኑረው::' : 'Password must be at least 6 characters.'
      });
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const result = registerAndVerifyStudent({
        studentId,
        fullName,
        collegeName: college,
        departmentName: department,
        batch,
        semester,
        password
      });

      if (result.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        setFeedback({
          type: 'success',
          message: result.message
        });
      } else {
        setFeedback({
          type: result.flagReason ? 'flagged' : 'error',
          message: result.message
        });
      }
    }, 1400);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
      
      {/* High-Brightness Campus Image Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/images/dormitory_blocks.jpg"
          alt="Wachemo Campus Dormitory"
          className="w-full h-full object-cover brightness-110 contrast-105"
        />
        {/* Responsive translucent overlay to guarantee high-contrast readability */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Back to Home */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-slate-200 text-xs font-bold shadow-md border border-slate-200 dark:border-slate-700 mb-4 transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'am' ? 'ወደ ዋናው ገጽ ይመለሱ' : 'Back to Home'}</span>
        </button>

        {/* Card with Smooth Mint/Emerald Theme */}
        <div className="rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300
          /* Light Mode: Smooth Mint Emerald */
          bg-white/95 border-2 border-emerald-400 shadow-2xl shadow-emerald-950/20
          /* Dark Mode: Deep Sleek Slate */
          dark:bg-slate-900/90 dark:border-emerald-500/60 dark:shadow-emerald-950/50"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex p-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-400 mb-3 shadow-md">
              <img
                src="/assets/images/wachemo_logo.jpg"
                alt="Wachemo Logo"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex items-center justify-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider mb-1">
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'ይፋዊ የተማሪ ምዝገባ' : 'Student Verification & Registration'}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'am' ? 'የተማሪዎች ይፋዊ ምዝገባ' : 'Official Student Registration'}
            </h2>

            <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 flex items-start space-x-1.5 font-medium text-left">
                <Fingerprint className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  {language === 'am'
                    ? 'ማረጋገጫ፡ ምዝገባው የሚጸድቀው በዋና አስተዳዳሪው ከተጫነው ይፋዊ የተማሪዎች ዝርዝር ጋር መረጃዎ ሲመሳከር ብቻ ነው::'
                    : 'Verification Rule: Your submitted information is verified in real-time against the Official Student List entered by the Super Admin.'}
                </span>
              </p>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback.type && (
            <div className={`mb-4 p-3 rounded-xl border text-xs flex items-start space-x-2 animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-300'
                : feedback.type === 'flagged'
                ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-500/60 text-amber-800 dark:text-amber-300'
                : 'bg-red-50 dark:bg-red-950/70 border-red-300 dark:border-red-500/60 text-red-800 dark:text-red-300'
            }`}>
              {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />}
              {feedback.type === 'flagged' && <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />}
              {feedback.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />}
              <div>
                <div className="font-bold">
                  {feedback.type === 'success'
                    ? (language === 'am' ? 'ማረጋገጫው ተሳክቷል!' : 'Official Verification Passed!')
                    : feedback.type === 'flagged'
                    ? (language === 'am' ? 'ማስጠንቀቂያ፡ መረጃው ተጣቅሷል' : 'Flagged for Super Admin Review')
                    : (language === 'am' ? 'ማረጋገጫው አልተሳካም' : 'Verification Denied')}
                </div>
                <div className="mt-0.5 text-[11px] opacity-90">{feedback.message}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Student ID & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'am' ? 'የተማሪ መታወቂያ (ID)' : 'Student ID'} *
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. WU/2024/002"
                  className="w-full px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'am' ? 'ሙሉ ስም' : 'Official Full Name'} *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tigist Haile Mengistu"
                  className="w-full px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                  required
                />
              </div>
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {language === 'am' ? 'ኮሌጅ' : 'College'} *
              </label>
              <select
                value={college}
                onChange={(e) => handleCollegeChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                required
              >
                <option value="">-- {language === 'am' ? 'ኮሌጅ ይምረጡ' : 'Select College'} --</option>
                {colleges.filter(c => c.isActive).map(c => (
                  <option key={c.id} value={c.name}>
                    {language === 'am' ? c.amharicName : c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
                <span>{language === 'am' ? 'ዲፓርትመንት' : 'Department'} *</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  {college ? `${filteredDepartments.length} ${language === 'am' ? 'አሉ' : 'available'}` : (language === 'am' ? 'መጀመሪያ ኮሌጅ ይምረጡ' : 'Select college first')}
                </span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={!college}
                className="w-full px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50 transition"
                required
              >
                <option value="">-- {language === 'am' ? 'ዲፓርትመንት ይምረጡ' : 'Select Department'} --</option>
                {filteredDepartments.filter(d => d.isActive).map(d => (
                  <option key={d.id} value={d.name}>
                    {language === 'am' ? d.amharicName : d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Batch & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'am' ? 'ባች' : 'Batch'} *
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  required
                >
                  {batches.filter(b => b.isActive).map(b => (
                    <option key={b.id} value={b.name}>
                      {formatBatch(language, b.name)} ({b.yearEC})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'am' ? 'ሴሚስተር' : 'Semester'} *
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  required
                >
                  {semesters.filter(s => s.isActive).map(s => (
                    <option key={s.id} value={s.name}>
                      {formatSemester(language, s.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'am' ? 'የይለፍ ቃል' : 'Password'} *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 pr-9 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {language === 'am' ? 'የይለፍ ቃል ያረጋግጡ' : 'Confirm Password'} *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-slate-50/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-900/25 text-sm flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer hover:scale-[1.01] disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{language === 'am' ? 'ከይፋዊ ሰነድ ጋር እየተመሳከረ ነው...' : 'Verifying against Official Roster...'}</span>
                </>
              ) : (
                <>
                  <SearchCheck className="w-4 h-4" />
                  <span>{language === 'am' ? 'አረጋግጥና ተመዝገብ' : 'Verify & Complete Registration'}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {language === 'am' ? 'ቀደም ሲል ተመዝግበዋል?' : 'Already have an account?'}{' '}
              <button
                onClick={onGoToLogin}
                className="font-bold text-sky-700 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                {language === 'am' ? 'ወደ መግቢያ ይሂዱ' : 'Sign In to Portal'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
