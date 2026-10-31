package com.academia.demo.service;

import com.academia.demo.web.dto.UploadResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/webm",
            "application/pdf"
    );

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.uploads.path:uploads}") String uploadPath) {
        this.uploadRoot = Path.of(uploadPath).toAbsolutePath().normalize();
    }

    public UploadResponse store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo esta vacio");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Solo se permiten imagenes, videos mp4/webm o PDF");
        }

        String originalName = cleanName(file.getOriginalFilename());
        String extension = extensionOf(originalName);
        String storedName = UUID.randomUUID() + extension;

        try {
            Files.createDirectories(uploadRoot);
            file.transferTo(uploadRoot.resolve(storedName));
        } catch (IOException exception) {
            throw new IllegalStateException("No se pudo guardar el archivo", exception);
        }

        return new UploadResponse(originalName, storedName, "/uploads/" + storedName, file.getContentType(), file.getSize());
    }

    private String cleanName(String filename) {
        if (filename == null || filename.isBlank()) {
            return "archivo";
        }
        return Path.of(filename).getFileName().toString();
    }

    private String extensionOf(String filename) {
        int index = filename.lastIndexOf('.');
        if (index < 0) {
            return "";
        }
        return filename.substring(index).toLowerCase(Locale.ROOT);
    }
}
