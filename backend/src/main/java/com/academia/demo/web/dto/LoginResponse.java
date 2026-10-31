package com.academia.demo.web.dto;

import java.util.UUID;

public record LoginResponse(
        UUID id,
        String username,
        String email,
        String displayName,
        String role,
        String profilePhotoUrl,
        String phone,
        UUID studentId
) {
}
