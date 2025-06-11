package com.example.skydrop.controller;

import com.example.skydrop.dto.FileStatusResponse;
import com.example.skydrop.dto.FileUploadResponse;
import com.example.skydrop.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // In production, specify your frontend URL here
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        FileUploadResponse response = fileStorageService.uploadFile(file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{fileId}/status")
    public ResponseEntity<FileStatusResponse> getFileStatus(@PathVariable String fileId) {
        FileStatusResponse status = fileStorageService.getFileStatus(fileId);
        return ResponseEntity.ok(status);
    }

    @PostMapping("/{fileId}/pause")
    public ResponseEntity<Void> pauseUpload(@PathVariable String fileId) {
        fileStorageService.pauseUpload(fileId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{fileId}/resume")
    public ResponseEntity<Void> resumeUpload(@PathVariable String fileId) {
        fileStorageService.resumeUpload(fileId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> cancelUpload(@PathVariable String fileId) {
        fileStorageService.cancelUpload(fileId);
        return ResponseEntity.ok().build();
    }
}
