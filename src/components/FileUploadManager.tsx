import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  Trash2,
  CheckCircle,
  AlertCircle,
  FileJson,
  FileSpreadsheet,
  File,
  X
} from 'lucide-react';
import { OperationType } from './LoginPage';

interface UploadedDataset {
  id: string;
  name: string;
  operation_type: string;
  file_size: number;
  row_count: number;
  column_count: number;
  columns: Array<{
    name: string;
    type: string;
    null_count: number;
    unique_count: number;
    sample_values: any[];
  }>;
  upload_date: string;
}

interface FileUploadManagerProps {
  operationType: OperationType;
  onClose: () => void;
  isOpen: boolean;
}

const API_BASE_URL = 'http://localhost:8002';

export function FileUploadManager({ operationType, onClose, isOpen }: FileUploadManagerProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDatasets, setUploadedDatasets] = useState<UploadedDataset[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing datasets when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadExistingDatasets();
    }
  }, [isOpen, operationType]);

  const loadExistingDatasets = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/datasets?operation_type=${operationType}`);
      if (response.ok) {
        const data = await response.json();
        setUploadedDatasets(data.datasets || []);
      }
    } catch (error) {
      console.error('Failed to load existing datasets:', error);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const allowedTypes = ['.csv', '.json', '.xlsx'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        validFiles.push(file);
      } else {
        toast.error(`Invalid file type: ${file.name}. Only CSV, JSON, and XLSX files are allowed.`);
      }
    }

    // Check total file count (including existing)
    if (selectedFiles.length + validFiles.length > 10) {
      toast.error('Maximum 10 files allowed at once');
      return;
    }

    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      formData.append('operation_type', operationType);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`${API_BASE_URL}/api/upload-data`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        toast.success(`Successfully uploaded ${result.uploaded_files.length} files`);
        setSelectedFiles([]);
        await loadExistingDatasets(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDataset = async (datasetId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Dataset deleted successfully');
        await loadExistingDatasets();
      } else {
        const error = await response.json();
        toast.error(error.detail || 'Failed to delete dataset');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete dataset');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'json':
        return <FileJson className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'csv':
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Dataset Manager - {operationType.charAt(0).toUpperCase() + operationType.slice(1)} Operations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Datasets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-300 hover:border-primary'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports CSV, JSON, and XLSX files (max 10 files)
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Select Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv,.json,.xlsx"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.name)}
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSelectedFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={uploadFiles}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Files`}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFiles([])}
                      disabled={isUploading}
                    >
                      Clear All
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="mt-2">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-center mt-1">{uploadProgress}%</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing Datasets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Datasets ({uploadedDatasets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedDatasets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>No datasets uploaded yet</p>
                  <p className="text-sm">Upload your first dataset to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedDatasets.map((dataset) => (
                    <div key={dataset.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {getFileIcon(dataset.name)}
                        <div>
                          <p className="font-medium">{dataset.name}</p>
                          <div className="flex gap-2 text-xs text-gray-500">
                            <span>{dataset.row_count} rows</span>
                            <span>•</span>
                            <span>{dataset.column_count} columns</span>
                            <span>•</span>
                            <span>{formatFileSize(dataset.file_size)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteDataset(dataset.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}