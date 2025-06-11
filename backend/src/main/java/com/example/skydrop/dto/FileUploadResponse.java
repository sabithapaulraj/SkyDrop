package com.example.skydrop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String id;
    private String fileName;
    private long fileSize;
    private String fileType;
    private String uploadUrl;
    private String status;
    private String createdAt;
}
