package com.academia.demo.web;

import com.academia.demo.service.AcademiaService;
import com.academia.demo.web.dto.LoginRequest;
import com.academia.demo.web.dto.LoginResponse;
import com.academia.demo.web.dto.ProfilePhotoRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AcademiaService academiaService;

    public AuthController(AcademiaService academiaService) {
        this.academiaService = academiaService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return academiaService.login(request);
    }

    @PutMapping("/users/{userId}/profile-photo")
    public LoginResponse updateProfilePhoto(@PathVariable UUID userId, @Valid @RequestBody ProfilePhotoRequest request) {
        return academiaService.updateProfilePhoto(userId, request);
    }
}
