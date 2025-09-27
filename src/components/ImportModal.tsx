import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { useDataContext, parseCSVContent, createDatasetFromData } from './DataContext';
import { 
  X, 
  Upload, 
  FileText, 
  Database, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Building2,
  Truck,
  Users,
  Zap,
  FileJson,
  FileSpreadsheet,
  File,
  Brain
} from 'lucide-react';
import { OperationType } from './LoginPage';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationType: OperationType;
}

interface ImportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  acceptedFormats: string[];
  category: 'configuration' | 'data';
}

export function ImportModal({ isOpen, onClose, operationType }: ImportModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDataset } = useDataContext();

  const getOperationIcon = (operation: OperationType) => {
    const icons = {
      'terminal': Building2,
      'courier': Truck,
      'workforce': Users,
      'energy': Zap
    };
    return icons[operation] || Building2;
  };

  const getImportOptions = (operation: OperationType): ImportOption[] => {
    const baseOptions = [
      {
        id: 'dashboard-config',
        title: 'Dashboard Configuration',
        description: 'Import custom dashboard layouts and widgets',
        icon: Settings,
        acceptedFormats: ['.json', '.config'],
        category: 'configuration' as const
      },
      {
        id: 'operational-data',
        title: 'Operational Data',
        description: 'Import historical and real-time operational data',
        icon: Database,
        acceptedFormats: ['.csv', '.xlsx', '.json'],
        category: 'data' as const
      }
    ];

    // Add operation-specific options
    const operationSpecific: Record<OperationType, ImportOption[]> = {
      terminal: [
        {
          id: 'terminal-schedules',
          title: 'Terminal Schedules',
          description: 'Import vessel schedules and berth allocations',
          icon: Building2,
          acceptedFormats: ['.csv', '.xlsx'],
          category: 'data'
        },
        {
          id: 'cargo-manifests',
          title: 'Cargo Manifests',
          description: 'Import cargo lists and container data',
          icon: FileSpreadsheet,
          acceptedFormats: ['.csv', '.xlsx', '.xml'],
          category: 'data'
        }
      ],
      courier: [
        {
          id: 'delivery-routes',
          title: 'Delivery Routes',
          description: 'Import optimized delivery routes and schedules',
          icon: Truck,
          acceptedFormats: ['.csv', '.json', '.gpx'],
          category: 'data'
        },
        {
          id: 'driver-schedules',
          title: 'Driver Schedules',
          description: 'Import driver availability and shift patterns',
          icon: Users,
          acceptedFormats: ['.csv', '.xlsx'],
          category: 'data'
        }
      ],
      workforce: [
        {
          id: 'employee-data',
          title: 'Employee Data',
          description: 'Import staff information and qualifications',
          icon: Users,
          acceptedFormats: ['.csv', '.xlsx'],
          category: 'data'
        },
        {
          id: 'shift-patterns',
          title: 'Shift Patterns',
          description: 'Import shift schedules and rotation patterns',
          icon: FileSpreadsheet,
          acceptedFormats: ['.csv', '.json'],
          category: 'data'
        }
      ],
      energy: [
        {
          id: 'consumption-data',
          title: 'Energy Consumption Data',
          description: 'Import historical energy usage patterns',
          icon: Zap,
          acceptedFormats: ['.csv', '.xlsx', '.json'],
          category: 'data'
        },
        {
          id: 'equipment-profiles',
          title: 'Equipment Profiles',
          description: 'Import equipment specifications and energy profiles',
          icon: Settings,
          acceptedFormats: ['.json', '.csv'],
          category: 'configuration'
        }
      ]
    };

    return [...baseOptions, ...operationSpecific[operation]];
  };

  const handleFileSelect = () => {
    if (!selectedOption) {
      toast.error('Please select an import type first');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(files);
      processAndUploadFiles(files);
    }
  };

  const processAndUploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress((i / files.length) * 50); // First 50% for file reading
        
        // Only process data files (CSV, JSON) for AI analysis
        const isDataFile = file.name.toLowerCase().endsWith('.csv') || 
                          file.name.toLowerCase().endsWith('.json');
        
        if (isDataFile && selectedOption === 'operational-data') {
          await processDataFile(file);
        }
        
        // Simulate processing time for other file types
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(50 + ((i + 1) / files.length) * 50); // Remaining 50%
      }

      setIsUploading(false);
      
      const selectedOptionData = getImportOptions(operationType).find(opt => opt.id === selectedOption);
      toast.success(`Successfully imported ${files.length} file(s) for ${selectedOptionData?.title}`);
      
      // Reset state after successful upload
      setTimeout(() => {
        setUploadProgress(0);
        setUploadedFiles([]);
        setSelectedOption(null);
        onClose();
      }, 1500);
      
    } catch (error) {
      setIsUploading(false);
      console.error('File processing error:', error);
      toast.error('Error processing files. Please check the format and try again.');
    }
  };

  const processDataFile = async (file: File): Promise<void> => {
    setIsProcessing(true);
    
    try {
      const content = await readFileContent(file);
      let parsedData: any[] = [];
      
      if (file.name.toLowerCase().endsWith('.csv')) {
        parsedData = parseCSVContent(content);
      } else if (file.name.toLowerCase().endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          // Handle different JSON structures
          if (Array.isArray(jsonData)) {
            parsedData = jsonData;
          } else if (jsonData.data && Array.isArray(jsonData.data)) {
            parsedData = jsonData.data;
          } else {
            // Convert single object to array
            parsedData = [jsonData];
          }
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      }
      
      if (parsedData.length === 0) {
        throw new Error('No valid data found in file');
      }
      
      // Create dataset and add to context
      const dataset = createDatasetFromData(
        file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        operationType,
        parsedData,
        file.size
      );
      
      addDataset(dataset);
      
      toast.success(`📊 Dataset "${dataset.name}" processed and ready for AI analysis!`, {
        description: `${dataset.rowCount} records with ${dataset.columnCount} fields loaded`
      });
      
    } catch (error) {
      console.error('Data processing error:', error);
      toast.error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'json':
        return FileJson;
      case 'csv':
      case 'xlsx':
        return FileSpreadsheet;
      default:
        return File;
    }
  };

  const importOptions = getImportOptions(operationType);
  const OperationIcon = getOperationIcon(operationType);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <OperationIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Import Data & Configurations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {operationType.charAt(0).toUpperCase() + operationType.slice(1)} Operations
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Import Options */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Select Import Type</h3>
              <div className="grid gap-3">
                {importOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedOption === option.id;
                  
                  return (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium">{option.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {option.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {option.acceptedFormats.map((format) => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* File Upload Section */}
            {selectedOption && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Upload Files</h3>
                  <Button 
                    onClick={handleFileSelect}
                    size="sm"
                    disabled={isUploading}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Browse Files</span>
                  </Button>
                </div>

                {/* File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept={getImportOptions(operationType).find(opt => opt.id === selectedOption)?.acceptedFormats.join(',')}
                  onChange={handleFileChange}
                />

                {/* Upload Progress */}
                {(isUploading || isProcessing) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isProcessing && <Brain className="h-4 w-4 text-primary animate-pulse" />}
                        <span className="text-sm text-muted-foreground">
                          {isProcessing ? 'Processing data for AI analysis...' : 'Uploading...'}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && !isUploading && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Uploaded Files</h4>
                    {uploadedFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file.name);
                      return (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Import Instructions */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Import Guidelines:</p>
                      <ul className="space-y-1">
                        <li>• Ensure files are in the correct format for your operation type</li>
                        <li>• CSV/JSON data files will be processed for AI analysis</li>
                        <li>• Large files may take longer to process</li>
                        <li>• Existing data will be merged or replaced based on import type</li>
                        {selectedOption === 'operational-data' && (
                          <li className="text-primary font-medium">
                            🤖 Data files will be analyzed by AI for insights and recommendations
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}