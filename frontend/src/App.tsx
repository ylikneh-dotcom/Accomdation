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

const MainContent: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // If user is logged in, show their role dashboard
  if (currentUser && role) {
    return (
      <main className="min-h-[calc(100vh-4.5rem)] pb-12">
        {role === 'SUPER_ADMIN' && <SuperAdminDashboard />}
        {role === 'STUDENT' && <StudentDashboard />}
        {role === 'DORMITORY_MANAGER' && <DormitoryDashboard />}
        {role === 'ACCOMMODATION_OFFICER' && <AccommodationDashboard />}
        {role === 'PROPERTY_MANAGER' && <PropertyDashboard />}
        {role === 'MAINTENANCE_STAFF' && <MaintenanceDashboard />}
      </main>
    );
  }

  // Not logged in: show Home, Login, or Register page
  return (
    <main className="min-h-[calc(100vh-4.5rem)]">
      {currentView === 'home' && (
        <HomePage
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToRegister={() => setCurrentView('register')}
        />
      )}
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
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-200">
            <Header />
            <div className="flex-1">
              <MainContent />
            </div>
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
