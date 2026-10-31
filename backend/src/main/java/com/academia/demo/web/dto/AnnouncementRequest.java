package com.academia.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AnnouncementRequest(
        @NotBlank @Size(max = 140) String title,
        @NotBlank String body,
        @NotBlank @Size(max = 30) String category,
        @NotBlank @Size(max = 30) String audience,
        @NotBlank @Size(max = 160) String createdBy,
        @NotBlank @Size(max = 60) String createdByUsername
) {
}
