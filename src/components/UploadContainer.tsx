import { useState, useEffect } from 'react';
import { FileUploadZone } from './FileUploadZone';
import { FileList } from './FileList';
import { UploadSummary } from './UploadSummary';
import { FileWithProgress } from '../types/file';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { fileApi } from '../services/api';

export function UploadContainer() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [uploadJobs, setUploadJobs] = useState<{[key: string]: boolean}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any ongoing uploads when component unmounts
      Object.keys(uploadJobs).forEach(fileId => {
        fileApi.cancelUpload(fileId).catch(() => {
          // Ignore errors during cleanup
        });
      });
    };
  }, [uploadJobs]);

  const handleFilesAdded = (newFiles: File[]) => {
    if (isLoading) return;
    
    // Validate file types - allow common document and media types
    const allowedTypes = [
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument',
      'text/',
      'video/',
      'audio/'
    ];
    
    const validFiles = newFiles.filter(file => 
      allowedTypes.some(type => file.type.startsWith(type))
    );
    
    if (validFiles.length !== newFiles.length) {
      toast.warning('Some files were rejected due to unsupported file types');
    }
    
    const filesWithProgress = validFiles.map(file => ({
      id: uuidv4(),
      file,
      progress: 0,
      status: 'queued' as const,
      uploadedChunks: 0,
      totalChunks: Math.ceil(file.size / (1024 * 1024)) // Chunk size: 1MB
    }));
    
    setFiles(prev => [...prev, ...filesWithProgress]);
    setTotalSize(prev => prev + validFiles.reduce((sum, file) => sum + file.size, 0));
    
    // Start uploading the new files
    filesWithProgress.forEach(fileWithProgress => {
      uploadFile(fileWithProgress.id);
    });
  };

  const uploadFile = async (fileId: string) => {
    const fileToUpload = files.find(f => f.id === fileId);
    if (!fileToUpload) return;
    
    // Update status to uploading
    setFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, status: 'uploading' } : f)
    );
    
    // Track this upload job
    setUploadJobs(prev => ({ ...prev, [fileId]: true }));
    setIsLoading(true);

    try {
      const response = await fileApi.uploadFile(
        fileToUpload.file,
        (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            
            setFiles(prev => 
              prev.map(f => f.id === fileId ? { ...f, progress } : f)
            );
            
            if (progress === 100) {
              setFiles(prev => 
                prev.map(f => f.id === fileId ? { ...f, status: 'completed' } : f)
              );
              
              setTotalUploaded(prev => prev + fileToUpload.file.size);
              
              // Remove from active jobs
              setUploadJobs(prev => {
                const newJobs = { ...prev };
                delete newJobs[fileId];
                return newJobs;
              });
            }
          }
        }
      );
      
      toast.success(`${fileToUpload.file.name} uploaded successfully!`);
    } catch (error) {
      console.error('Upload failed:', error);
      
      setFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, status: 'error' } : f)
      );
      
      toast.error(`Failed to upload ${fileToUpload.file.name}`);
      
      // Remove from active jobs
      setUploadJobs(prev => {
        const newJobs = { ...prev };
        delete newJobs[fileId];
        return newJobs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePauseResume = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || file.status === 'completed' || file.status === 'error') return;
    
    try {
      if (file.status === 'paused') {
        // Resume upload
        await fileApi.resumeUpload(fileId);
        
        setFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, status: 'uploading' } : f)
        );
        
        // Start monitoring the upload again
        uploadFile(fileId);
      } else {
        // Pause upload
        await fileApi.pauseUpload(fileId);
        
        setFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, status: 'paused' } : f)
        );
      }
    } catch (error) {
      console.error('Failed to toggle pause/resume:', error);
      toast.error(`Failed to ${file.status === 'paused' ? 'resume' : 'pause'} upload`);
    }
  };

  const cancelUpload = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;
    
    try {
      // If the file is actively uploading, cancel it on the server
      if (file.status !== 'completed' && file.status !== 'error') {
        await fileApi.cancelUpload(fileId);
      }
      
      // If the file was completed, remove its size from total uploaded
      if (file.status === 'completed') {
        setTotalUploaded(prev => prev - file.file.size);
      }
      
      // Remove from total size and files list
      setTotalSize(prev => prev - file.file.size);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      
      // Remove from active jobs
      setUploadJobs(prev => {
        const newJobs = { ...prev };
        delete newJobs[fileId];
        return newJobs;
      });
      
      toast.info(`${file.file.name} was removed`);
    } catch (error) {
      console.error('Failed to cancel upload:', error);
      toast.error(`Failed to remove ${file.file.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Upload Files
      </h2>
      <p className="text-slate-600">
        Drag and drop files to upload them to cloud storage. You can upload multiple files at once.
      </p>
      
      <FileUploadZone onFilesAdded={handleFilesAdded} isLoading={isLoading} />
      
      {files.length > 0 && (
        <div className="space-y-6 mt-8">
          <UploadSummary 
            totalFiles={files.length} 
            totalSize={totalSize} 
            uploadedSize={totalUploaded} 
          />
          <FileList 
            files={files} 
            onTogglePauseResume={togglePauseResume} 
            onCancel={cancelUpload} 
          />
        </div>
      )}
    </div>
  );
}
