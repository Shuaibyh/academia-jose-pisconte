package com.academia.demo.web.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfilePhotoRequest(
        @NotBlank String profilePhotoUrl
) {
}
