package com.example.skydrop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileStatusResponse {
    private String id;
    private String status;
    private int progress;
    private long uploadedSize;
    private long totalSize;
}
