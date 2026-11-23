import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/common/Header';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SuperAdminDashboard } from './dashboards/admin/SuperAdminDashboard';
import { StudentDashboard } from './dashboards/student/StudentDashboard';
import { DormitoryDashboard } from './dashboards/dormitory/DormitoryDashboard';
import { AccommodationDashboard } from './dashboards/accommodation/AccommodationDashboard';
import { PropertyDashboard } from './dashboards/property/PropertyDashboard';
import { MaintenanceDashboard } from './dashboards/maintenance/MaintenanceDashboard';

type ViewState = 'home' | 'login' | 'register';

const AppContent: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // If user is logged in, show their role dashboard (no global header — DashboardLayout provides its own)
  if (currentUser && role) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-200">
        {role === 'SUPER_ADMIN' && <SuperAdminDashboard />}
        {role === 'STUDENT' && <StudentDashboard />}
        {role === 'DORMITORY_MANAGER' && <DormitoryDashboard />}
        {role === 'ACCOMMODATION_OFFICER' && <AccommodationDashboard />}
        {role === 'PROPERTY_MANAGER' && <PropertyDashboard />}
        {role === 'MAINTENANCE_STAFF' && <MaintenanceDashboard />}
      </div>
    );
  }

  // Home page has its own integrated navbar — no global Header needed
  if (currentView === 'home') {
    return (
      <HomePage
        onNavigateToLogin={() => setCurrentView('login')}
        onNavigateToRegister={() => setCurrentView('register')}
      />
    );
  }

  // Login and Register pages use the shared Header for consistent branding
  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-200">
      <Header onNavigateHome={() => setCurrentView('home')} />
      <div className="flex-1">
        {currentView === 'login' && (
          <LoginPage
            onBackToHome={() => setCurrentView('home')}
            onGoToRegister={() => setCurrentView('register')}
          />
        )}
        {currentView === 'register' && (
          <RegisterPage
            onBackToHome={() => setCurrentView('home')}
            onGoToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
