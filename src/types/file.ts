export interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'paused' | 'completed' | 'error';
  uploadedChunks: number;
  totalChunks: number;
}

export interface FileUploadResponse {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadUrl: string;
  status: string;
  createdAt: string;
}

export interface FileStatusResponse {
  id: string;
  status: string;
  progress: number;
  uploadedSize: number;
  totalSize: number;
}
