import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { ActivityMonitorProvider, useActivityMonitor } from './components/ActivityMonitor';
import { DataProvider } from './components/DataContext';
import { FloatingChatbot } from './components/FloatingChatbot';
import { SecureLoginPage } from './components/SecureLoginPage';
import { LoginPage, OperationType } from './components/LoginPage';
import { EntryPage } from './components/EntryPage';
import { ControlCenter } from './components/ControlCenter';
import { DashboardBuilder } from './components/DashboardBuilder';
import { Simulator } from './components/Simulator';
import { WhatIfAnalysisSimple } from './components/WhatIfAnalysisSimple';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { CourierHub } from './components/CourierHub';
import { WorkforceView } from './components/WorkforceView';
import { EnergyView } from './components/EnergyView';

import { CustomizeDashboard } from './components/CustomizeDashboard';

import { BottomNavigation } from './components/BottomNavigation';
import { OperationSwitcher } from './components/OperationSwitcher';
import { Toaster } from './components/ui/sonner';

export type AppPage = 'secure-login' | 'login' | 'entry' | 'home' | 'dashboard' | 'simulator' | 'reports' | 'settings' | 'whatif' | 'courier' | 'workforce' | 'energy' | 'customize';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>('terminal');
  const { logActivity } = useActivityMonitor();

  // Check for existing session on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('rto_session_token');
    const savedUser = localStorage.getItem('rto_remember_user');
    
    if (savedToken && savedUser) {
      // Validate token (basic check for demo)
      try {
        const tokenData = atob(savedToken);
        const [username, timestamp] = tokenData.split('-');
        const tokenAge = Date.now() - parseInt(timestamp);
        
        // Token valid for 24 hours
        if (tokenAge < 24 * 60 * 60 * 1000 && username === savedUser) {
          setIsAuthenticated(true);
          setCurrentPage('login');
        }
      } catch (error) {
        // Invalid token, clear storage
        localStorage.removeItem('rto_session_token');
        localStorage.removeItem('rto_remember_user');
      }
    }
  }, []);

  // Log page navigation activity
  useEffect(() => {
    if (currentPage !== 'secure-login' && currentPage !== 'login' && currentPage !== 'entry') {
      logActivity(
        'Page Navigation',
        getPageDisplayName(currentPage),
        `User navigated to ${getPageDisplayName(currentPage)} page`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); // logActivity is memoized in context

  const getPageDisplayName = (page: AppPage): string => {
    const pageNames = {
      'secure-login': 'Secure Login',
      'login': 'Operation Selection',
      'entry': 'Entry Page',
      'home': 'Control Center',
      'dashboard': 'Dashboard Builder',
      'simulator': 'Simulator',
      'whatif': 'What-If Analysis',
      'reports': 'Reports',
      'settings': 'Settings',
      'courier': 'Courier Hub',
      'workforce': 'Workforce Management',
      'energy': 'Energy Management',
      'customize': 'Customize My Dashboard'
    };
    return pageNames[page] || page;
  };

  const handleSecureLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('login');
    logActivity(
      'Authentication',
      'Secure Login',
      'User successfully authenticated to the platform'
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedOperation(null);
    setCurrentPage('secure-login');
    logActivity(
      'Authentication',
      'Logout',
      'User signed out of the platform'
    );
  };

  const handleOperationSelect = (operation: OperationType) => {
    setSelectedOperation(operation);
    // Navigate to the main page based on operation type
    switch (operation) {
      case 'terminal':
        setCurrentPage('entry');
        break;
      case 'courier':
        setCurrentPage('courier');
        break;
      case 'workforce':
        setCurrentPage('workforce');
        break;
      case 'energy':
        setCurrentPage('energy');
        break;
      default:
        setCurrentPage('entry');
    }
  };

  const handleStartSimulation = () => {
    setCurrentPage('home');
  };

  const handleOperationSwitch = (operation: OperationType) => {
    setSelectedOperation(operation);
    // Navigate to the main page based on operation type
    switch (operation) {
      case 'terminal':
        setCurrentPage('home');
        break;
      case 'courier':
        setCurrentPage('courier');
        break;
      case 'workforce':
        setCurrentPage('workforce');
        break;
      case 'energy':
        setCurrentPage('energy');
        break;
      default:
        setCurrentPage('home');
    }
  };



  // Get available pages based on operation type
  const getAvailablePages = (): AppPage[] => {
    if (!selectedOperation) return [];
    
    switch (selectedOperation) {
      case 'terminal':
        return ['home', 'dashboard', 'simulator', 'whatif', 'reports', 'settings'];
      case 'courier':
        return ['courier', 'dashboard', 'simulator', 'whatif', 'reports', 'settings'];
      case 'workforce':
        return ['workforce', 'dashboard', 'simulator', 'whatif', 'reports', 'settings'];
      case 'energy':
        return ['energy', 'dashboard', 'simulator', 'whatif', 'reports', 'settings'];
      default:
        return ['simulator', 'reports', 'settings'];
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'secure-login':
        return <SecureLoginPage onLoginSuccess={handleSecureLoginSuccess} />;
      case 'login':
        return <LoginPage onOperationSelect={handleOperationSelect} />;
      case 'entry':
        return <EntryPage onStartSimulation={handleStartSimulation} />;
      case 'home':
        return <ControlCenter onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardBuilder onNavigate={setCurrentPage} operationType={selectedOperation || 'terminal'} />;
      case 'simulator':
        return <Simulator onNavigate={setCurrentPage} operationType={selectedOperation || 'terminal'} />;
      case 'whatif':
        return <WhatIfAnalysisSimple onNavigate={setCurrentPage} />;
      case 'reports':
        return <ReportsPage onNavigate={setCurrentPage} operationType={selectedOperation || 'terminal'} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} operationType={selectedOperation || 'terminal'} onLogout={handleLogout} />;
      case 'courier':
        return <CourierHub onNavigate={setCurrentPage} />;
      case 'workforce':
        return <WorkforceView onNavigate={setCurrentPage} />;
      case 'energy':
        return <EnergyView onNavigate={setCurrentPage} />;
      case 'customize':
        return <CustomizeDashboard onNavigate={setCurrentPage} />;
      default:
        return <ControlCenter onNavigate={setCurrentPage} />;
    }
  };

  const showBottomNav = currentPage !== 'secure-login' && currentPage !== 'login' && currentPage !== 'entry' && currentPage !== 'whatif' && currentPage !== 'customize';
  const showOperationSwitcher = selectedOperation && currentPage !== 'secure-login' && currentPage !== 'login' && currentPage !== 'entry';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showOperationSwitcher && (
        <OperationSwitcher 
          currentOperation={selectedOperation}
          onOperationChange={handleOperationSwitch}
        />
      )}
      <div className={`flex-1 ${showBottomNav ? 'pb-16' : ''}`}>
        {renderCurrentPage()}
      </div>
      {showBottomNav && (
        <BottomNavigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          availablePages={getAvailablePages()}
          selectedOperation={selectedOperation}
        />
      )}
      {/* Floating Chatbot - show on all pages except login and entry */}
      {currentPage !== 'secure-login' && currentPage !== 'login' && currentPage !== 'entry' && (
        <FloatingChatbot 
          onWorkflowChange={handleOperationSwitch}
          currentOperation={selectedOperation || undefined}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ActivityMonitorProvider>
        <DataProvider>
          <AppContent />
          <Toaster />
        </DataProvider>
      </ActivityMonitorProvider>
    </ThemeProvider>
  );
}