import { CloudUpload } from 'lucide-react';

interface UploadSummaryProps {
  totalFiles: number;
  totalSize: number;
  uploadedSize: number;
}

export function UploadSummary({ totalFiles, totalSize, uploadedSize }: UploadSummaryProps) {
  const progress = totalSize ? Math.round((uploadedSize / totalSize) * 100) : 0;
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-5 text-white shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Upload Summary</h3>
          <p className="text-blue-100 text-sm">
            {totalFiles} file{totalFiles !== 1 ? 's' : ''} • {formatFileSize(totalSize)}
          </p>
        </div>
        <div className="bg-white/20 p-2 rounded-full">
          <CloudUpload className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>{formatFileSize(uploadedSize)} uploaded</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-blue-400/30 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
