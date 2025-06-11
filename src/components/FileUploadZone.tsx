import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader, Upload } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  isLoading?: boolean;
}

export function FileUploadZone({ onFilesAdded, isLoading = false }: FileUploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!isLoading) {
      onFilesAdded(acceptedFiles);
    }
  }, [onFilesAdded, isLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: true,
    disabled: isLoading
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        border-2 border-dashed rounded-lg p-8 
        transition-colors duration-200 ease-in-out
        flex flex-col items-center justify-center
        cursor-pointer min-h-[200px]
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : isLoading
            ? 'border-slate-300 bg-slate-50 cursor-not-allowed'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }
      `}
    >
      <input {...getInputProps()} disabled={isLoading} />
      
      <div className="text-center">
        {isLoading ? (
          <Loader className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
        ) : isDragActive ? (
          <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        ) : (
          <FileUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        )}
        
        <p className="text-lg font-medium mb-2">
          {isLoading
            ? 'Uploading...'
            : isDragActive
              ? 'Drop the files here'
              : 'Drag & drop files here'
          }
        </p>
        
        <p className="text-slate-500 text-sm mb-4">
          {isLoading
            ? 'Please wait while we process your files'
            : 'or click to select files from your computer'
          }
        </p>
        
        <button 
          type="button"
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${isLoading
              ? 'bg-slate-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
          onClick={e => e.stopPropagation()}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Select Files'}
        </button>
      </div>
    </div>
  );
}
