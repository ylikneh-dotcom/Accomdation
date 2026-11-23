import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Phone,
  MapPin,
  Sun,
  Moon,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Authentic Wachemo University campus landmarks (5 slides with crystal-clear daylight fidelity)
const CAMPUS_SLIDES = [
  {
    image: '/assets/images/dormitory_blocks.jpg',
    title: 'Modern Student Residential Dormitory Blocks & Central Campus',
    amharicTitle: 'ዘመናዊ የተማሪዎች የመኖሪያ ዶርሞችና ማዕከላዊ ግቢ'
  },
  {
    image: '/assets/images/campus_gate.jpg',
    title: 'Iconic University Main Entrance Gate',
    amharicTitle: 'የዩኒቨርሲቲው ታሪካዊ ዋና መግቢያ በር'
  },
  {
    image: '/assets/images/campus_fountain.jpg',
    title: 'Central Fountain Monument & Academic Plaza',
    amharicTitle: 'የማዕከላዊ ሀውልትና የውሃ ፏፏቴ አደባባይ'
  },
  {
    image: '/assets/images/campus_aerial.jpg',
    title: 'Wachemo University Campus Panorama & Peace Park',
    amharicTitle: 'የዋቸሞ ዩኒቨርሲቲ ፓኖራማ እይታና የሰላም ፓርክ'
  },
  {
    image: '/assets/images/graduation_ceremony.jpg',
    title: 'Graduation Hall & Academic Excellence Center',
    amharicTitle: 'የምረቃ አዳራሽና የትምህርት ልህቀት ማዕከል'
  }
];

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAMPUS_SLIDES.length) % CAMPUS_SLIDES.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between overflow-x-hidden bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* ========================================================= */}
      {/* TOP NAVBAR: LOGO + TITLE (LEFT), CONTROLS + AUTH (RIGHT)  */}
      {/* ========================================================= */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#060D1E]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[70px]">

            {/* Left: University Logo & Institutional Title */}
            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div className="p-0.5 rounded-full bg-blue-50 dark:bg-cyan-950/80 border-2 border-blue-500 dark:border-cyan-400 shadow-sm shrink-0">
                <img
                  src="/assets/images/wachemo_logo.jpg"
                  alt="Wachemo Logo"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight truncate">
                  {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
                </h1>
                <p className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-cyan-400 leading-tight truncate">
                  {language === 'am'
                    ? 'በአይ-የተደገፈ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም'
                    : 'AI-Powered University Accommodation and Property Management System'}
                </p>
              </div>
            </div>

            {/* Right: Theme Toggle, Language Switcher, Sign In, Register */}
            <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 cursor-pointer transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-cyan-500/30 shadow-sm cursor-pointer transition-all"
                title={language === 'en' ? 'Switch to Amharic (አማርኛ)' : 'Switch to English'}
              >
                <Globe className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
                <span className="font-mono">{language === 'en' ? 'EN' : 'አማ'}</span>
              </button>

              {/* Sign In Button */}
              <button
                onClick={onNavigateToLogin}
                className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ግባ' : 'Sign In'}</span>
              </button>

              {/* Register Button */}
              <button
                onClick={onNavigateToRegister}
                className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ተመዝገብ' : 'Register'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* HERO SECTION: FULL-WIDTH CAMPUS PHOTO WITH LEFT GRADIENT  */}
      {/* MATCHING USER MOCKUP EXACTLY                              */}
      {/* ========================================================= */}
      <section className="relative flex-1 min-h-[calc(100vh-140px)] flex items-center justify-center overflow-hidden">
        
        {/* Full-width 5-Picture Campus Slideshow with High Brightness */}
        <div className="absolute inset-0">
          {CAMPUS_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center brightness-105 contrast-105"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Left-side Blue Gradient Overlay - focused only on left typography area, leaving the university campus photo 100% crystal-clear and vibrant */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#002B66] via-[#0047AB]/90 via-35% to-transparent to-55% pointer-events-none" />
        </div>

        {/* Manual Slideshow Left / Right Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-900 dark:text-white backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-900 dark:text-white backdrop-blur-md shadow-lg transition-all cursor-pointer hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Left-Aligned Hero Text Overlay (matching user mockup) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
          <div className="max-w-2xl text-left">
            
            {/* University Title (Large) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[0.95] tracking-tight drop-shadow-md">
              <span>{language === 'am' ? 'ዋቸሞ' : 'Wachemo'}</span>{' '}
              <span className="font-light italic text-cyan-200">{language === 'am' ? 'ዩኒቨርሲቲ' : 'University'}</span>
            </h1>

            {/* Subtitle */}
            <h2 className="mt-4 sm:mt-5 text-lg sm:text-xl lg:text-2xl font-bold text-white/95 leading-snug drop-shadow">
              {language === 'am'
                ? 'በአይ-የተደገፈ የተማሪዎች ማደሪያና የቋሚ ንብረት አስተዳደር ሲስተም'
                : 'AI-Powered University Accommodation and Property Management System'}
            </h2>

            {/* Blue Divider Line */}
            <div className="mt-4 sm:mt-5 w-24 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow-sm" />

            {/* Tagline */}
            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base italic text-cyan-200/95 font-medium tracking-wide">
              {language === 'am'
                ? 'ብልህ አስተዳደር • የላቀ አገልግሎት • የተሳሰረ ግቢ'
                : 'Smart Management • Better Service • A Connected Campus'}
            </p>

            {/* "Explore Our Services →" CTA Button */}
            <div className="mt-8 sm:mt-10">
              <button
                onClick={onNavigateToLogin}
                className="inline-flex items-center space-x-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-slate-900/90 dark:bg-white/15 hover:bg-slate-900 dark:hover:bg-white/25 text-white text-sm sm:text-base font-bold border border-white/40 shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>{language === 'am' ? 'አገልግሎቶቻችንን ያስሱ' : 'Explore Our Services'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Slideshow Indicator Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
          {CAMPUS_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide
                  ? 'w-7 h-2 bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.7)]'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER INFO BAR: 5 ITEMS MATCHING MOCKUP                  */}
      {/* ========================================================= */}
      <footer className="relative z-20 w-full bg-white dark:bg-[#060D1E] border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:justify-between text-xs sm:text-sm">

            {/* 1. Location */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {language === 'am' ? 'ዋቸሞ ዩኒቨርሲቲ' : 'Wachemo University'}
                </span>
                <span className="hidden sm:inline text-slate-500 dark:text-slate-400 ml-1">
                  {language === 'am' ? 'ሆሳዕና፣ ማዕከላዊ ኢትዮጵያ' : 'Hosanna, Central Ethiopia'}
                </span>
              </div>
            </div>

            {/* 2. Official Verification */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-semibold">{language === 'am' ? 'ይፋዊ ማረጋገጫ' : 'Official Verification'}</span>
            </div>

            {/* 3. Dormitory Housing */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50">
                <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              </div>
              <span className="font-semibold">{language === 'am' ? 'የዶርም አገልግሎት' : 'Dormitory Housing'}</span>
            </div>

            {/* 4. Academic Year */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/50">
                <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <span className="font-semibold">{language === 'am' ? 'የአካዳሚክ ዓመት 2017 ዓ.ም' : 'Academic Year 2024/25'}</span>
            </div>

            {/* 5. Phone */}
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Phone className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <span className="font-semibold font-mono">+251 46 555 2024</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
