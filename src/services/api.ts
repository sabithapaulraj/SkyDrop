import axios from 'axios';

// Create an axios instance with the base URL of our backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export const fileApi = {
  // Upload a file
  uploadFile: async (file: File, onUploadProgress: (progressEvent: any) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
  },
  
  // Pause a file upload
  pauseUpload: async (fileId: string) => {
    return api.post(`/files/${fileId}/pause`);
  },
  
  // Resume a paused upload
  resumeUpload: async (fileId: string) => {
    return api.post(`/files/${fileId}/resume`);
  },
  
  // Cancel an upload
  cancelUpload: async (fileId: string) => {
    return api.delete(`/files/${fileId}`);
  },
  
  // Get upload status
  getUploadStatus: async (fileId: string) => {
    return api.get(`/files/${fileId}/status`);
  }
};
