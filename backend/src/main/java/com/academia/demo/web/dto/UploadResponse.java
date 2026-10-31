package com.academia.demo.web.dto;

public record UploadResponse(
        String originalName,
        String storedName,
        String url,
        String contentType,
        long size
) {
}
