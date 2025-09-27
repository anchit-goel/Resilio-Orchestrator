import React from 'react';
import { Home, BarChart3, Play, FileText, Settings, Truck, Users, Zap, Brain } from 'lucide-react';
import { AppPage } from '../App';
import { OperationType } from './LoginPage';

interface BottomNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  availablePages: AppPage[];
  selectedOperation: OperationType | null;
}

export function BottomNavigation({ currentPage, onNavigate, availablePages, selectedOperation }: BottomNavigationProps) {
  const allNavItems = [
    { id: 'home' as AppPage, icon: Home, label: 'Control Center' },
    { id: 'dashboard' as AppPage, icon: BarChart3, label: 'Dashboard' },
    { id: 'simulator' as AppPage, icon: Play, label: 'Simulator' },
    { id: 'whatif' as AppPage, icon: Brain, label: 'What-If' },
    { id: 'courier' as AppPage, icon: Truck, label: 'Courier Hub' },
    { id: 'workforce' as AppPage, icon: Users, label: 'Workforce' },
    { id: 'energy' as AppPage, icon: Zap, label: 'Energy' },
    { id: 'reports' as AppPage, icon: FileText, label: 'Reports' },
    { id: 'settings' as AppPage, icon: Settings, label: 'Settings' },
  ];

  // Filter nav items based on available pages
  const navItems = allNavItems.filter(item => availablePages.includes(item.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-50">
      <div className={`flex items-center justify-around max-w-md mx-auto ${navItems.length <= 3 ? 'max-w-sm' : 'max-w-md'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-lg transition-all duration-200 min-w-0 flex-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                isActive 
                  ? 'bg-primary/10 text-primary shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted/60'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
              <span className={`text-xs truncate transition-colors max-w-full ${isActive ? 'text-primary font-medium' : 'group-hover:text-foreground'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}