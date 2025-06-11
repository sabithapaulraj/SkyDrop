package com.example.skydrop.config;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

public interface FileStorageRepository {
    String storeFile(byte[] fileContent, String originalFilename, String contentType) throws Exception;
    FileMetadata getFileMetadata(String fileId);
    byte[] getFileContent(String fileId) throws Exception;
    void deleteFile(String fileId) throws Exception;
    
    @Data
    @AllArgsConstructor
    class FileMetadata {
        private String id;
        private String fileName;
        private String contentType;
        private long size;
        private LocalDateTime createdAt;
    }
}
