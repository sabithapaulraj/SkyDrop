import { CircleCheck, Clock, File, Pause, Play, CircleX } from 'lucide-react';
import { FileWithProgress } from '../types/file';

interface FileListProps {
  files: FileWithProgress[];
  onTogglePauseResume: (fileId: string) => void;
  onCancel: (fileId: string) => void;
}

export function FileList({ files, onTogglePauseResume, onCancel }: FileListProps) {
  if (!files.length) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-4 py-3">
        <h3 className="font-medium">Files</h3>
      </div>
      <ul className="divide-y divide-slate-200">
        {files.map(file => (
          <li key={file.id} className="p-4 flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="bg-slate-100 rounded p-2">
                <File className="h-5 w-5 text-slate-500" />
              </div>
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium truncate pr-2" title={file.file.name}>
                  {file.file.name}
                </p>
                <span className="text-xs text-slate-500">
                  {formatFileSize(file.file.size)}
                </span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {file.status === 'completed' ? (
                    <CircleCheck className="h-3.5 w-3.5 text-green-500 mr-1" />
                  ) : file.status === 'paused' ? (
                    <Clock className="h-3.5 w-3.5 text-amber-500 mr-1" />
                  ) : (
                    <></>
                  )}
                  <span className="text-xs text-slate-500">
                    {file.status === 'completed' 
                      ? 'Completed' 
                      : file.status === 'paused'
                        ? 'Paused'
                        : `${Math.round(file.progress)}%`
                    }
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {file.status !== 'completed' && (
                    <button
                      onClick={() => onTogglePauseResume(file.id)}
                      className="text-slate-500 hover:text-blue-600 transition-colors"
                      title={file.status === 'paused' ? 'Resume' : 'Pause'}
                    >
                      {file.status === 'paused' ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={() => onCancel(file.id)}
                    className="text-slate-500 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <CircleX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
