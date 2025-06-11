package com.example.skydrop.service;

import com.example.skydrop.config.FileStorageRepository;
import com.example.skydrop.dto.FileStatusResponse;
import com.example.skydrop.dto.FileUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final FileStorageRepository fileRepository;
    private final Map<String, FileUploadStatus> uploads = new ConcurrentHashMap<>();

    public FileUploadResponse uploadFile(MultipartFile file) {
        String fileId = UUID.randomUUID().toString();
        String fileName = file.getOriginalFilename();
        long fileSize = file.getSize();
        
        try {
            // Create upload tracking record
            FileUploadStatus uploadStatus = new FileUploadStatus(
                fileId,
                fileName,
                fileSize,
                "uploading",
                LocalDateTime.now()
            );
            uploads.put(fileId, uploadStatus);
            
            // Upload to local storage
            String storedFileId = fileRepository.storeFile(
                file.getBytes(),
                file.getOriginalFilename(),
                file.getContentType()
            );
            
            // Update status
            uploadStatus.setStatus("completed");
            uploadStatus.setProgress(100);
            uploadStatus.setUploadedSize(fileSize);
            
            // Create response
            return new FileUploadResponse(
                fileId,
                fileName,
                fileSize,
                file.getContentType(),
                "/api/files/" + fileId + "/download",
                "completed",
                LocalDateTime.now().toString()
            );
        } catch (Exception e) {
            uploads.get(fileId).setStatus("error");
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public FileStatusResponse getFileStatus(String fileId) {
        FileUploadStatus status = uploads.get(fileId);
        if (status == null) {
            throw new RuntimeException("Upload not found");
        }
        
        return new FileStatusResponse(
            fileId,
            status.getStatus(),
            status.getProgress(),
            status.getUploadedSize(),
            status.getTotalSize()
        );
    }

    public void pauseUpload(String fileId) {
        FileUploadStatus status = uploads.get(fileId);
        if (status != null) {
            status.setStatus("paused");
        }
    }

    public void resumeUpload(String fileId) {
        FileUploadStatus status = uploads.get(fileId);
        if (status != null) {
            status.setStatus("uploading");
        }
    }

    public void cancelUpload(String fileId) {
        uploads.remove(fileId);
    }

    // Inner class for tracking uploads
    private static class FileUploadStatus {
        private final String id;
        private final String fileName;
        private final long totalSize;
        private String status;
        private int progress;
        private long uploadedSize;
        private final LocalDateTime createdAt;

        public FileUploadStatus(String id, String fileName, long totalSize, String status, LocalDateTime createdAt) {
            this.id = id;
            this.fileName = fileName;
            this.totalSize = totalSize;
            this.status = status;
            this.progress = 0;
            this.uploadedSize = 0;
            this.createdAt = createdAt;
        }

        public String getId() {
            return id;
        }

        public String getFileName() {
            return fileName;
        }

        public long getTotalSize() {
            return totalSize;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public int getProgress() {
            return progress;
        }

        public void setProgress(int progress) {
            this.progress = progress;
        }

        public long getUploadedSize() {
            return uploadedSize;
        }

        public void setUploadedSize(long uploadedSize) {
            this.uploadedSize = uploadedSize;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }
}
