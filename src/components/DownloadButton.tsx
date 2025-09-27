import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { 
  Download, 
  FileText, 
  Database, 
  Settings,
  Loader2,
  CheckCircle 
} from 'lucide-react';
import { OperationType } from './LoginPage';

interface DownloadButtonProps {
  type: 'config' | 'backup' | 'data';
  operationType: OperationType;
  filename?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  children?: React.ReactNode;
}

export function DownloadButton({ 
  type, 
  operationType, 
  filename,
  className = '',
  size = 'md',
  variant = 'outline',
  children
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const getDownloadConfig = () => {
    const configs = {
      config: {
        icon: Settings,
        label: 'Download Config',
        fileExtension: '.json',
        mimeType: 'application/json'
      },
      backup: {
        icon: Database,
        label: 'Download Backup',
        fileExtension: '.backup.json',
        mimeType: 'application/json'
      },
      data: {
        icon: FileText,
        label: 'Download Data',
        fileExtension: '.csv',
        mimeType: 'text/csv'
      }
    };
    return configs[type];
  };

  const generateMockData = () => {
    const timestamp = new Date().toISOString();
    const operationName = operationType.charAt(0).toUpperCase() + operationType.slice(1);
    
    switch (type) {
      case 'config':
        return {
          version: '1.0.0',
          operationType,
          exportedAt: timestamp,
          settings: {
            theme: 'light',
            notifications: true,
            autoSave: true,
            dashboardLayout: 'grid',
            refreshInterval: 30000
          },
          dashboardConfig: {
            widgets: [
              { id: 'kpi-1', type: 'kpi', title: 'Efficiency', position: { x: 0, y: 0 } },
              { id: 'chart-1', type: 'chart', title: 'Volume Trends', position: { x: 1, y: 0 } },
              { id: 'table-1', type: 'table', title: 'Performance Data', position: { x: 0, y: 1 } }
            ]
          }
        };
        
      case 'backup':
        return {
          version: '1.0.0',
          operationType,
          backupDate: timestamp,
          userData: {
            preferences: { theme: 'light', language: 'en' },
            customDashboards: 3,
            savedReports: 12
          },
          systemState: {
            lastLogin: timestamp,
            sessionCount: 247,
            totalReportsGenerated: 89
          }
        };
        
      case 'data':
        return `Metric,Value,Unit,Timestamp
Efficiency,87,%,${timestamp}
Total Volume,18750,units,${timestamp}
Processing Time,52,minutes,${timestamp}
Utilization Rate,94,%,${timestamp}
Success Rate,96,%,${timestamp}`;

        
      default:
        return {};
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const config = getDownloadConfig();
      const data = generateMockData();
      
      let content: string;
      let mimeType: string;
      
      if (type === 'data') {
        content = data as string;
        mimeType = config.mimeType;
      } else {
        content = JSON.stringify(data, null, 2);
        mimeType = config.mimeType;
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const defaultFilename = `${operationType}_${type}_${new Date().toISOString().split('T')[0]}${config.fileExtension}`;
      const downloadFilename = filename || defaultFilename;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadComplete(true);
      toast.success(`${config.label} downloaded successfully!`);
      
      // Reset completed state after 2 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 2000);
      
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(`Failed to download ${type}. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const config = getDownloadConfig();
  const Icon = config.icon;
  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  return (
    <Button
      variant={variant}
      size={buttonSize}
      onClick={handleDownload}
      disabled={isDownloading}
      className={`transition-all duration-200 ${className}`}
    >
      {downloadComplete ? (
        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
      ) : isDownloading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Icon className="h-4 w-4 mr-2" />
      )}
      {children || (
        <>
          {isDownloading ? 'Downloading...' : downloadComplete ? 'Downloaded!' : config.label}
          {!isDownloading && !downloadComplete && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {config.fileExtension}
            </Badge>
          )}
        </>
      )}
    </Button>
  );
}