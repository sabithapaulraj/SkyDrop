package com.example.skydrop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class LocalStorageConfig {

    @Bean
    @Primary // Override the S3 configuration
    public FileStorageRepository fileStorageRepository() throws Exception {
        // Create temp directory for file storage
        Path tempDir = Files.createTempDirectory("skydrop-storage");
        return new LocalFileStorageRepository(tempDir);
    }

    // Local implementation of file storage
    public static class LocalFileStorageRepository implements FileStorageRepository {
        private final Path storageLocation;
        private final ConcurrentHashMap<String, FileMetadata> fileMetadata = new ConcurrentHashMap<>();

        public LocalFileStorageRepository(Path storageLocation) {
            this.storageLocation = storageLocation;
        }

        @Override
        public String storeFile(byte[] fileContent, String originalFilename, String contentType) throws Exception {
            String fileId = java.util.UUID.randomUUID().toString();
            Path filePath = storageLocation.resolve(fileId);
            Files.write(filePath, fileContent);
            
            FileMetadata metadata = new FileMetadata(
                fileId,
                originalFilename,
                contentType,
                fileContent.length,
                java.time.LocalDateTime.now()
            );
            fileMetadata.put(fileId, metadata);
            
            return fileId;
        }

        @Override
        public FileMetadata getFileMetadata(String fileId) {
            return fileMetadata.get(fileId);
        }

        @Override
        public byte[] getFileContent(String fileId) throws Exception {
            Path filePath = storageLocation.resolve(fileId);
            return Files.readAllBytes(filePath);
        }

        @Override
        public void deleteFile(String fileId) throws Exception {
            Path filePath = storageLocation.resolve(fileId);
            Files.deleteIfExists(filePath);
            fileMetadata.remove(fileId);
        }
    }
}
