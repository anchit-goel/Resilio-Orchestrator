import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { useTheme } from './ThemeProvider';
import { useActivityMonitor } from './ActivityMonitor';
import { AIActivityReport } from './AIActivityReport';
import { FileUploadManager } from './FileUploadManager';

import { DownloadButton } from './DownloadButton';
import { DataManagement } from './DataManagement';
import { OperationType } from './LoginPage';
import { 
  ArrowLeft,
  Database,
  Palette,
  Brain,
  FileText,
  Download,
  Upload,
  Moon,
  Sun,
  Sparkles,
  ChevronRight,
  Activity,
  Eye,
  Building2,
  Truck,
  Users,
  Zap,
  LogOut
} from 'lucide-react';
import { AppPage } from '../App';

interface SettingsPageProps {
  onNavigate: (page: AppPage) => void;
  operationType?: OperationType;
  onLogout?: () => void;
}

export function SettingsPage({ onNavigate, operationType = 'terminal', onLogout }: SettingsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const { getAISummary } = useActivityMonitor();
  const [aiAssistant, setAiAssistant] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [showAIReport, setShowAIReport] = useState(false);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  const darkMode = theme === 'dark';
  const aiSummary = getAISummary();
  
  // Simple storage calculation without context dependency
  const getStorageInfo = () => {
    try {
      let totalUsed = 0;
      const rtoKeys = Object.keys(localStorage).filter(key => key.startsWith('rto_'));
      
      rtoKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          totalUsed += new Blob([value]).size;
        }
      });

      const totalAvailable = 5 * 1024 * 1024; // 5MB
      const percentage = Math.min(100, (totalUsed / totalAvailable) * 100);

      return {
        used: totalUsed,
        available: totalAvailable - totalUsed,
        percentage: Math.round(percentage)
      };
    } catch (error) {
      return { used: 0, available: 5 * 1024 * 1024, percentage: 0 };
    }
  };
  
  const storageInfo = getStorageInfo();

  const getOperationDetails = (operation: OperationType) => {
    const details = {
      'terminal': {
        name: 'Terminal Operations',
        icon: Building2,
        color: 'bg-blue-500'
      },
      'courier': {
        name: 'Courier Hub',
        icon: Truck,
        color: 'bg-green-500'
      },
      'workforce': {
        name: 'Workforce Management',
        icon: Users,
        color: 'bg-purple-500'
      },
      'energy': {
        name: 'Energy Management',
        icon: Zap,
        color: 'bg-yellow-500'
      }
    };
    return details[operation] || details.terminal;
  };

  const operationDetails = getOperationDetails(operationType);

  const settingSections = [
    {
      title: 'AI & Intelligence',
      items: [
        {
          id: 'ai-activity',
          title: 'AI Activity Report',
          subtitle: `${aiSummary.totalActivities} activities monitored • ${aiSummary.predictionsGenerated} predictions`,
          icon: Activity,
          action: 'navigate',
          onClick: () => setShowAIReport(true)
        }
      ]
    },
    {
      title: `${operationDetails.name} Data`,
      items: [
        {
          id: 'data-management',
          title: 'Upload & Manage Data',
          subtitle: `Upload operational data, configurations, and manage all ${operationType} files in one place`,
          icon: Database,
          action: 'navigate',
          onClick: () => setShowDataManagement(true)
        },
        {
          id: 'dataset-upload',
          title: 'Upload Datasets',
          subtitle: `Upload CSV, JSON, or XLSX files for AI analysis (max 10 files)`,
          icon: Upload,
          action: 'navigate',
          onClick: () => setShowFileUpload(true)
        },
        {
          id: 'export',
          title: 'Export Data',
          subtitle: `Download current ${operationType} dataset and configurations`,
          icon: Download,
          action: 'custom',
          customComponent: (
            <DownloadButton
              type="data"
              operationType={operationType}
              size="sm"
              className="pointer-events-auto"
            />
          )
        }
      ]
    },
    {
      title: 'Configuration',
      items: [
        {
          id: 'backup-config',
          title: 'Backup Configuration',
          subtitle: 'Save current settings and customizations',
          icon: Database,
          action: 'custom',
          customComponent: (
            <DownloadButton
              type="backup"
              operationType={operationType}
              size="sm"
              className="pointer-events-auto"
            />
          )
        },
        {
          id: 'storage-cleanup',
          title: 'Storage Cleanup',
          subtitle: 'Clear temporary data and optimize storage',
          icon: Database,
          action: 'button',
          actionText: 'Optimize',
          onClick: () => {
            // Clear non-essential data
            try {
              const keysToRemove = Object.keys(localStorage).filter(key => 
                key.startsWith('rto_temp_') || 
                key.startsWith('rto_cache_') ||
                key.includes('_backup_')
              );
              
              keysToRemove.forEach(key => localStorage.removeItem(key));
              
              if (keysToRemove.length > 0) {
                toast.success(`Cleaned ${keysToRemove.length} temporary files`);
              } else {
                toast.info('Storage is already optimized');
              }
            } catch (error) {
              toast.error('Failed to clean storage');
            }
          }
        }
      ]
    },
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: darkMode ? Moon : Sun,
          action: 'toggle',
          value: darkMode,
          onChange: toggleTheme
        }
      ]
    },
    {
      title: 'Features',
      items: [
        {
          id: 'ai',
          title: 'AI Assistant',
          subtitle: 'Enable AI-powered insights',
          icon: Brain,
          action: 'toggle',
          value: aiAssistant,
          onChange: setAiAssistant
        },
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'System alerts and updates',
          icon: Sparkles,
          action: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          id: 'autosave',
          title: 'Auto-save',
          subtitle: 'Automatically save changes',
          icon: Database,
          action: 'toggle',
          value: autoSave,
          onChange: setAutoSave
        }
      ]
    }
  ];

  const renderSettingAction = (item: any) => {
    switch (item.action) {
      case 'toggle':
        return (
          <Switch
            checked={item.value}
            onCheckedChange={item.onChange}
            className="pointer-events-auto"
          />
        );
      case 'button':
        return (
          <Button 
            variant="outline" 
            size="sm"
            className="pointer-events-auto hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation();
              if (item.onClick) {
                item.onClick();
              }
            }}
          >
            {item.actionText}
          </Button>
        );
      case 'custom':
        return item.customComponent;
      case 'navigate':
        return (
          <div className="flex items-center space-x-2 pointer-events-none">
            {item.count && (
              <Badge variant="secondary" className="text-xs">
                {item.count}
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('home')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-foreground">Settings</h1>
            <p className="text-muted-foreground text-sm">Configure app preferences</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6 pb-20">
        {/* App Info */}
        <Card className="border border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-card-foreground">Resilient Terminal Orchestrator</h2>
                <p className="text-muted-foreground text-sm">Version 1.0.0 • Honeywell Hackathon</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className="bg-green-100 text-green-700 text-xs">Connected</Badge>
                  <div className="flex items-center space-x-1">
                    <div className={`w-3 h-3 ${operationDetails.color} rounded`}></div>
                    <Badge variant="outline" className="text-xs">{operationDetails.name}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <section key={`settings-section-${sectionIndex}-${section.title}`}>
            <h2 className="text-foreground mb-4">{section.title}</h2>
            
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={`setting-item-${section.title}-${item.id}-${itemIndex}`} 
                    className={`border border-border transition-all duration-200 bg-card ${
                      item.onClick ? 'cursor-pointer hover:shadow-sm hover:border-primary/20' : ''
                    }`}
                    onClick={item.onClick}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-card-foreground">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <div onClick={(e) => {
                          // Prevent parent card click when clicking on action elements
                          if (item.action === 'toggle' || item.action === 'button') {
                            e.stopPropagation();
                          }
                        }}>
                          {renderSettingAction(item)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}

        {/* System Status */}
        <section className="pb-4">
          <h2 className="text-foreground mb-4">System Status</h2>
          
          <Card className="border border-border bg-card">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Data Source</span>
                  <Badge className="bg-green-100 text-green-700 text-xs">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Simulation Status</span>
                  <Badge className="bg-primary/10 text-primary text-xs">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI Services</span>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage Used</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {(storageInfo.used / (1024 * 1024)).toFixed(1)} MB / 5 MB
                    </span>
                    <Badge 
                      className={`text-xs ${
                        storageInfo.percentage > 80 ? 'bg-red-100 text-red-700' :
                        storageInfo.percentage > 60 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {storageInfo.percentage}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Account & Security */}
        {onLogout && (
          <section className="pb-4">
            <h2 className="text-foreground mb-4">Account & Security</h2>
            
            <Card className="border border-border bg-card">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Signed in as</h3>
                        <p className="text-xs text-muted-foreground">
                          {localStorage.getItem('rto_remember_user') || 'Demo User'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Authenticated
                    </Badge>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10"
                    onClick={() => {
                      // Clear session data
                      localStorage.removeItem('rto_session_token');
                      localStorage.removeItem('rto_remember_user');
                      
                      if (onLogout) {
                        onLogout();
                      }
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
      
      {/* AI Activity Report Modal/Overlay */}
      {showAIReport && (
        <div className="fixed inset-0 bg-background z-50">
          <AIActivityReport onBack={() => setShowAIReport(false)} />
        </div>
      )}
      
      {/* Data Management Modal */}
      {showDataManagement && (
        <div className="fixed inset-0 bg-background z-50 flex flex-col">
          <div className="border-b border-border bg-card/80 backdrop-blur-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => setShowDataManagement(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">Data Management</h1>
                  <p className="text-sm text-muted-foreground">
                    Upload and manage operational data files
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <DataManagement operationType={operationType} />
          </div>
        </div>
      )}

      {/* File Upload Manager */}
      <FileUploadManager
        operationType={operationType}
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
      />

    </div>
  );
}