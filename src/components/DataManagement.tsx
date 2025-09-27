import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { useDataContext, parseCSVContent, createDatasetFromData } from './DataContext';
import { 
  Upload, 
  FileText, 
  Database, 
  Trash2,
  CheckCircle,
  AlertCircle,
  FileJson,
  FileSpreadsheet,
  File,
  Brain,
  Eye,
  Download,
  Plus,
  Search,
  Filter,
  BarChart3,
  Activity,
  Settings,
  Building2,
  Truck,
  Users,
  Zap,
  FileX
} from 'lucide-react';
import { OperationType } from './LoginPage';

interface DataManagementProps {
  operationType: OperationType;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'processing' | 'ready' | 'error';
  recordCount?: number;
  columnCount?: number;
  datasetId?: string;
  category: 'data' | 'configuration';
  fileType?: 'operational-data' | 'dashboard-config' | 'schedules' | 'manifests' | 'routes' | 'profiles';
}

export function DataManagement({ operationType }: DataManagementProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [selectedUploadType, setSelectedUploadType] = useState<'data' | 'configuration'>('data');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDataset, datasets, removeDataset, clearAllDatasets } = useDataContext();

  // Load persisted uploaded files on mount
  useEffect(() => {
    loadPersistedFiles();
  }, []);

  // Save uploaded files whenever they change (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      saveUploadedFiles(uploadedFiles);
    }
  }, [uploadedFiles, isInitialized]);

  const loadPersistedFiles = () => {
    try {
      const storedFiles = localStorage.getItem('rto_uploaded_files');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        // Convert date strings back to Date objects
        const files = parsedFiles.map((file: any) => ({
          ...file,
          uploadDate: new Date(file.uploadDate)
        }));
        setUploadedFiles(files);
      }
    } catch (error) {
      console.error('Failed to load persisted files:', error);
      toast.error('Failed to load previously uploaded files');
    } finally {
      setIsInitialized(true);
    }
  };

  const saveUploadedFiles = (files: UploadedFile[]) => {
    try {
      // Only save if we have files (avoid saving empty array on initial load)
      if (files.length > 0) {
        const dataToSave = JSON.stringify(files);
        // Check storage size limit
        if (dataToSave.length > MAX_STORAGE_SIZE) {
          toast.error('Storage limit exceeded. Please remove some files.');
          return;
        }
        localStorage.setItem('rto_uploaded_files', dataToSave);
      }
    } catch (error) {
      console.error('Failed to save uploaded files:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error('Storage quota exceeded. Please remove some files.');
      } else {
        toast.error('Failed to save file changes');
      }
    }
  };

  const getStorageInfo = () => {
    try {
      const datasets = localStorage.getItem('rto_datasets') || '';
      const files = localStorage.getItem('rto_uploaded_files') || '';
      const totalSize = datasets.length + files.length;
      const usedPercentage = (totalSize / MAX_STORAGE_SIZE) * 100;
      
      return {
        used: totalSize,
        total: MAX_STORAGE_SIZE,
        percentage: Math.min(usedPercentage, 100),
        formattedUsed: (totalSize / 1024).toFixed(1) + ' KB',
        formattedTotal: (MAX_STORAGE_SIZE / 1024 / 1024).toFixed(1) + ' MB'
      };
    } catch (error) {
      return {
        used: 0,
        total: MAX_STORAGE_SIZE,
        percentage: 0,
        formattedUsed: '0 KB',
        formattedTotal: '5 MB'
      };
    }
  };

  const MAX_FILES = 15; // Increased to accommodate both data and config files
  const ACCEPTED_TYPES = ['.xlsx', '.json', '.csv', '.config', '.xml'];
  const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit

  const handleFileUpload = () => {
    if (uploadedFiles.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    if (uploadedFiles.length + files.length > MAX_FILES) {
      toast.error(`Cannot upload more than ${MAX_FILES} files total`);
      return;
    }

    // Validate file types
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return !ACCEPTED_TYPES.includes(extension);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid file types. Only ${ACCEPTED_TYPES.join(', ')} files are allowed`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress((i / files.length) * 100);

        const uploadedFile: UploadedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: '.' + file.name.split('.').pop()?.toLowerCase(),
          uploadDate: new Date(),
          status: 'processing',
          category: selectedUploadType,
          fileType: getFileTypeFromName(file.name, selectedUploadType)
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);

        try {
          // Only process data files for dataset creation
          if (uploadedFile.category === 'data' && ['.csv', '.json', '.xlsx'].includes(uploadedFile.type)) {
            const dataset = await processFile(file, uploadedFile.id);
            
            // Update file status with dataset info
            setUploadedFiles(prev => prev.map(f => 
              f.id === uploadedFile.id 
                ? {
                    ...f,
                    status: 'ready',
                    recordCount: dataset.rowCount,
                    columnCount: dataset.columnCount,
                    datasetId: dataset.id
                  }
                : f
            ));

            addDataset(dataset);
            
            // Save the updated files immediately for data files
            try {
              const updatedFiles = uploadedFiles.map(f => 
                f.id === uploadedFile.id 
                  ? {
                      ...f,
                      status: 'ready' as const,
                      recordCount: dataset.rowCount,
                      columnCount: dataset.columnCount,
                      datasetId: dataset.id
                    }
                  : f
              );
              localStorage.setItem('rto_uploaded_files', JSON.stringify(updatedFiles));
            } catch (storageError) {
              console.error('Failed to save file update:', storageError);
            }
          } else {
            // For configuration files, just mark as ready
            setUploadedFiles(prev => prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: 'ready' }
                : f
            ));
            
            // Save the updated files immediately for config files
            try {
              const updatedFiles = uploadedFiles.map(f => 
                f.id === uploadedFile.id 
                  ? { ...f, status: 'ready' as const }
                  : f
              );
              localStorage.setItem('rto_uploaded_files', JSON.stringify(updatedFiles));
            } catch (storageError) {
              console.error('Failed to save file update:', storageError);
            }
          }
          
        } catch (error) {
          console.error('File processing error:', error);
          setUploadedFiles(prev => prev.map(f => 
            f.id === uploadedFile.id ? { ...f, status: 'error' } : f
          ));
          toast.error(`Failed to process ${file.name}`);
        }
      }

      setUploadProgress(100);
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      setShowUploadDialog(false);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processFile = async (file: File, fileId: string): Promise<any> => {
    try {
      const content = await readFileContent(file);
      let parsedData: any[] = [];
      
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      switch (extension) {
        case '.csv':
          parsedData = parseCSVContent(content);
          break;
        case '.json':
          const jsonData = JSON.parse(content);
          if (Array.isArray(jsonData)) {
            parsedData = jsonData;
          } else if (jsonData.data && Array.isArray(jsonData.data)) {
            parsedData = jsonData.data;
          } else {
            parsedData = [jsonData];
          }
          break;
        case '.xlsx':
          // For demo purposes, treat as CSV
          toast.info('XLSX files are processed as CSV for this demo');
          parsedData = parseCSVContent(content);
          break;
        default:
          throw new Error('Unsupported file type');
      }
      
      if (parsedData.length === 0) {
        throw new Error('No valid data found in file');
      }
      
      // Limit data size to prevent performance issues
      if (parsedData.length > 1000) {
        parsedData = parsedData.slice(0, 1000);
        toast.info(`Data limited to 1000 records for performance`);
      }
      
      return createDatasetFromData(
        file.name.replace(/\.[^/.]+$/, ''),
        operationType,
        parsedData,
        file.size
      );
    } catch (error) {
      throw error;
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

  const handleDeleteFile = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file?.datasetId) {
      removeDataset(file.datasetId);
    }
    setUploadedFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      // Update localStorage immediately
      try {
        if (newFiles.length === 0) {
          localStorage.removeItem('rto_uploaded_files');
        } else {
          localStorage.setItem('rto_uploaded_files', JSON.stringify(newFiles));
        }
      } catch (error) {
        console.error('Failed to update storage after file removal:', error);
      }
      return newFiles;
    });
    toast.success('File removed');
  };

  const getFileTypeFromName = (fileName: string, category: 'data' | 'configuration'): UploadedFile['fileType'] => {
    const name = fileName.toLowerCase();
    
    if (category === 'configuration') {
      if (name.includes('dashboard') || name.includes('config')) return 'dashboard-config';
      if (name.includes('profile')) return 'profiles';
      return 'dashboard-config';
    }
    
    // Data file type detection
    if (name.includes('schedule')) return 'schedules';
    if (name.includes('manifest') || name.includes('cargo')) return 'manifests';
    if (name.includes('route') || name.includes('delivery')) return 'routes';
    if (name.includes('profile') || name.includes('equipment')) return 'profiles';
    
    return 'operational-data';
  };

  const getFileIcon = (file: UploadedFile) => {
    switch (file.type.toLowerCase()) {
      case '.json':
        return FileJson;
      case '.csv':
      case '.xlsx':
        return FileSpreadsheet;
      case '.config':
        return Settings;
      case '.xml':
        return FileX;
      default:
        return File;
    }
  };

  const getFileTypeLabel = (fileType: UploadedFile['fileType']) => {
    const labels = {
      'operational-data': 'Operational Data',
      'dashboard-config': 'Dashboard Config',
      'schedules': 'Schedules',
      'manifests': 'Cargo Manifests',
      'routes': 'Routes & Delivery',
      'profiles': 'Equipment Profiles'
    };
    return labels[fileType || 'operational-data'];
  };

  const getStatusBadge = (status: UploadedFile['status']) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Processing</Badge>;
      case 'ready':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Ready</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Error</Badge>;
    }
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
    return matchesSearch && matchesType;
  });

  const fileTypes = ['all', ...new Set(uploadedFiles.map(f => f.type))];
  const readyFiles = uploadedFiles.filter(f => f.status === 'ready');
  const totalRecords = readyFiles.reduce((sum, f) => sum + (f.recordCount || 0), 0);
  const storageInfo = getStorageInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Upload & Manage Data</h2>
          <p className="text-sm text-muted-foreground">
            Upload operational data files, configurations, and manage all {operationType} files in one place
          </p>
          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <CheckCircle className="h-3 w-3" />
              Data persisted locally
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {uploadedFiles.length > 0 && (
            <Button 
              onClick={() => {
                setUploadedFiles([]);
                clearAllDatasets();
                toast.success('All data cleared');
              }}
              variant="outline"
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
          <Button 
            onClick={() => setShowUploadDialog(true)}
            disabled={uploadedFiles.length >= MAX_FILES}
            className="bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-semibold">{uploadedFiles.length}</p>
              </div>
              <Database className="h-8 w-8 text-primary/70" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                {MAX_FILES - uploadedFiles.length} slots remaining
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ready Files</p>
                <p className="text-2xl font-semibold text-green-600">{readyFiles.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Available for analysis
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-2xl font-semibold text-blue-600">{totalRecords.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                Across all datasets
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-semibold text-orange-600">
                  {storageInfo.formattedUsed}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">
                  {storageInfo.percentage.toFixed(1)}% of {storageInfo.formattedTotal}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    storageInfo.percentage > 80 ? 'bg-red-500' : 
                    storageInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Type Selection */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <Button
          onClick={() => setSelectedUploadType('data')}
          variant={selectedUploadType === 'data' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
        >
          <Database className="h-4 w-4 mr-2" />
          Data Files
        </Button>
        <Button
          onClick={() => setSelectedUploadType('configuration')}
          variant={selectedUploadType === 'configuration' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
        >
          <Settings className="h-4 w-4 mr-2" />
          Configuration Files
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedFileType}
            onChange={(e) => setSelectedFileType(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            {fileTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No files uploaded</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your operational data files to get started
              </p>
              <Button 
                onClick={() => setShowUploadDialog(true)}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload First File
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file);
                return (
                  <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileIcon className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{file.name}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              file.category === 'data' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {getFileTypeLabel(file.fileType)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span>{(file.size / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>{file.uploadDate.toLocaleDateString()}</span>
                          {file.recordCount && (
                            <>
                              <span>•</span>
                              <span>{file.recordCount.toLocaleString()} records</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(file.status)}
                      {file.status === 'ready' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/80"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Upload {selectedUploadType === 'data' ? 'Data' : 'Configuration'} Files
            </DialogTitle>
            <DialogDescription>
              {selectedUploadType === 'data' 
                ? 'Upload operational data files to enhance your terminal management experience with real data insights.'
                : 'Upload configuration files like dashboard settings, equipment profiles, and system configurations.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {selectedUploadType === 'data' ? (
                  <Database className="h-8 w-8 text-primary" />
                ) : (
                  <Settings className="h-8 w-8 text-primary" />
                )}
              </div>
              <h3 className="font-medium mb-2">
                Upload Your {selectedUploadType === 'data' ? 'Data' : 'Configuration'} Files
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select up to {MAX_FILES - uploadedFiles.length} files to upload
              </p>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES.join(',')}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button onClick={handleFileUpload} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {ACCEPTED_TYPES.join(', ')} files only
              </p>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Processing files...
                  </span>
                  <span className="text-sm font-medium">{uploadProgress.toFixed(0)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">File Requirements:</p>
                  <ul className="space-y-1">
                    <li>• Maximum {MAX_FILES} files total</li>
                    <li>• Accepted formats: {ACCEPTED_TYPES.join(', ')}</li>
                    <li>• Files will be processed for AI analysis</li>
                    <li>• Data will replace default demo values</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}