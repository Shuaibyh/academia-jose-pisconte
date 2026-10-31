package com.academia.demo.web;

import com.academia.demo.service.FileStorageService;
import com.academia.demo.web.dto.UploadResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public UploadResponse upload(@RequestPart("file") MultipartFile file) {
        return fileStorageService.store(file);
    }
}
