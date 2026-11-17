import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Phone,
  MapPin
} from 'lucide-react';

// Authentic Wachemo University campus landmarks (uploaded images)
const CAMPUS_SLIDES = [
  {
    image: '/assets/images/campus_gate.jpg',
    title: 'Wachemo University Main Entrance Gate',
    amharicTitle: 'የዋቸሞ ዩኒቨርሲቲ ዋና መግቢያ በር'
  },
  {
    image: '/assets/images/campus_fountain.jpg',
    title: 'Iconic Campus Monument & Fountain',
    amharicTitle: 'የዩኒቨርሲቲው ሀውልትና የውሃ ፏፏቴ'
  },
  {
    image: '/assets/images/dormitory_blocks.jpg',
    title: 'Student Residential Dormitory Blocks',
    amharicTitle: 'የተማሪዎች የመኖሪያ ዶርሞች'
  },
  {
    image: '/assets/images/campus_aerial.jpg',
    title: 'Campus Panorama & Peace Park',
    amharicTitle: 'የግቢው ፓኖራማ እይታና የሰላም ፓርክ'
  },
  {
    image: '/assets/images/graduation_ceremony.jpg',
    title: 'Wachemo University Graduation Ceremony',
    amharicTitle: 'የምረቃ አዳራሽ ስነ-ስርዓት'
  }
];

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAMPUS_SLIDES.length) % CAMPUS_SLIDES.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);

  return (
    <div className="relative w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-between overflow-x-hidden">

      {/* ===== FULL-SCREEN HIGH-BRIGHTNESS CAMPUS PHOTO SLIDESHOW ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {CAMPUS_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover brightness-110 contrast-105"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Translucent veil tailored for Light and Dark modes to ensure maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/50 dark:from-black/40 dark:via-black/20 dark:to-black/85" />
      </div>

      {/* ===== SLIDE NAVIGATION ARROWS ===== */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 dark:bg-black/50 dark:hover:bg-black/80 dark:text-white backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 dark:bg-black/50 dark:hover:bg-black/80 dark:text-white backdrop-blur-md shadow-lg transition-all duration-200 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* ===== CENTER HERO SECTION OVERLAID DIRECTLY ON IMAGE ===== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10 w-full max-w-4xl mx-auto text-center">

        {/* University Emblem Badge */}
        <div className="p-1 sm:p-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl mb-2 sm:mb-3 border-2 border-cyan-500/80 transition-transform duration-300 hover:scale-105">
          <img
            src="/assets/images/wachemo_logo.jpg"
            alt="Wachemo University Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover shadow-sm"
          />
        </div>

        {/* Main University Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-md">
          {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
        </h1>

        {/* System Subtitle */}
        <p className="text-xs sm:text-sm md:text-base font-bold text-cyan-900 dark:text-cyan-300 mt-1 sm:mt-2 tracking-tight max-w-2xl px-3 py-1 rounded-xl bg-white/80 dark:bg-black/60 backdrop-blur-md shadow-sm">
          {language === 'am'
            ? 'በአይ-የተደገፈ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም'
            : 'AI-Powered University Accommodation and Property Management System'}
        </p>

        {/* ===== LOGIN & REGISTER CARDS — SMOOTH COLOR THEME FOR LIGHT & DARK MODES ===== */}
        <div className="mt-6 sm:mt-8 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 px-2">

          {/* 1. SIGN IN CARD — Smooth Sky/Cyan Color Theme */}
          <button
            onClick={onNavigateToLogin}
            className="group relative overflow-hidden p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer
              /* Light Mode: Smooth Sky Blue Color */
              bg-sky-50/95 hover:bg-sky-100/95 border-2 border-sky-400 hover:border-sky-500 shadow-xl shadow-sky-950/15 hover:scale-[1.02]
              /* Dark Mode: Deep Sleek Navy with Glowing Cyan */
              dark:bg-slate-900/90 dark:hover:bg-slate-900/95 dark:border-cyan-500/70 dark:hover:border-cyan-400 dark:shadow-cyan-950/50
              backdrop-blur-md"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-sky-400/25 dark:bg-cyan-500/25 rounded-full -translate-y-6 translate-x-6 blur-lg pointer-events-none group-hover:scale-125 transition-transform" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center space-x-2.5 mb-2.5">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-sky-200/80 text-sky-800 border border-sky-300 dark:bg-cyan-950/90 dark:text-cyan-300 dark:border-cyan-500/50 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-cyan-300 transition-colors">
                      {language === 'am' ? 'ወደ ሲስተሙ ግባ' : 'Sign In'}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-sky-700 dark:text-cyan-400 font-mono">
                      {language === 'am' ? 'የተጠቃሚ መግቢያ' : 'Portal Sign In'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {language === 'am'
                    ? 'በተማሪ መታወቂያ ወይም ሰራተኛ ኢሜይልና የይለፍ ቃል ግቡ::'
                    : 'Access your portal with Student ID or Official Staff Email.'}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-sky-200 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-sky-700 dark:text-cyan-300 group-hover:text-sky-900 dark:group-hover:text-cyan-200">
                <span>{language === 'am' ? 'ቀጥል' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* 2. REGISTER CARD — Smooth Mint/Emerald Color Theme */}
          <button
            onClick={onNavigateToRegister}
            className="group relative overflow-hidden p-4 sm:p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer
              /* Light Mode: Smooth Mint Emerald Color */
              bg-emerald-50/95 hover:bg-emerald-100/95 border-2 border-emerald-400 hover:border-emerald-500 shadow-xl shadow-emerald-950/15 hover:scale-[1.02]
              /* Dark Mode: Deep Sleek Slate with Glowing Emerald */
              dark:bg-slate-900/90 dark:hover:bg-slate-900/95 dark:border-emerald-500/70 dark:hover:border-emerald-400 dark:shadow-emerald-950/50
              backdrop-blur-md"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/25 dark:bg-emerald-500/25 rounded-full -translate-y-6 translate-x-6 blur-lg pointer-events-none group-hover:scale-125 transition-transform" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center space-x-2.5 mb-2.5">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-200/80 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-500/50 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {language === 'am' ? 'የተማሪ ምዝገባ' : 'Student Registration'}
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                      {language === 'am' ? 'ይፋዊ ምዝገባ' : 'Official Verification'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {language === 'am'
                    ? 'አዲስ ተማሪዎች በይፋዊ መዝገብ በመመሳከር ይመዝገቡ::'
                    : 'New students register & verify against official roster.'}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-emerald-200 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-900 dark:group-hover:text-emerald-200">
                <span>{language === 'am' ? 'ቀጥል' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Slideshow indicator dots and photo title */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center space-y-1.5">
          <div className="flex items-center space-x-2">
            {CAMPUS_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentSlide
                    ? 'w-7 sm:w-8 h-2 bg-cyan-600 dark:bg-cyan-400'
                    : 'w-2 h-2 bg-slate-400/80 dark:bg-white/40 hover:bg-slate-600 dark:hover:bg-white/70'
                }`}
                aria-label={`View slide ${idx + 1}`}
              />
            ))}
          </div>

          <p className="text-slate-900 dark:text-white text-xs font-bold drop-shadow px-3 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md">
            {language === 'am' ? CAMPUS_SLIDES[currentSlide].amharicTitle : CAMPUS_SLIDES[currentSlide].title}
          </p>
        </div>
      </div>

      {/* ===== REQUIRED DEDICATED FOOTER NAVBAR ===== */}
      <footer className="relative z-20 w-full bg-white/95 dark:bg-[#060D1E]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-xl text-slate-700 dark:text-slate-300 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs">

            {/* Left: University Branding & Location */}
            <div className="flex items-center space-x-2 text-center md:text-left">
              <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
                </span>
                <span className="mx-1.5 text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {language === 'am' ? 'ሆሳዕና፣ ማዕከላዊ ኢትዮጵያ' : 'Hosanna, Central Ethiopia'}
                </span>
              </div>
            </div>

            {/* Middle: Quick Links / Information */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs font-semibold">
              <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'am' ? 'ይፋዊ ማረጋገጫ' : 'Official Verification'}</span>
              </span>

              <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{language === 'am' ? 'የዶርም አገልግሎት' : 'Dormitory Housing'}</span>
              </span>

              <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{language === 'am' ? 'የአካዳሚክ ዓመት 2017 ዓ.ም' : 'Academic Year 2024/25'}</span>
              </span>
            </div>

            {/* Right: Operational Status & Support Contact */}
            <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{language === 'am' ? 'ሲስተም ዝግጁ' : 'Online'}</span>
              </div>

              <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-300 font-mono">
                <Phone className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>+251 46 555 2024</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
