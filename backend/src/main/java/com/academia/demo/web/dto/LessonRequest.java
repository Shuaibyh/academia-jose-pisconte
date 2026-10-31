package com.academia.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record LessonRequest(
        @NotNull UUID courseId,
        @NotBlank @Size(max = 160) String title,
        @NotBlank String description,
        @NotBlank String videoUrl,
        @NotBlank @Size(max = 30) String materialType,
        @Size(max = 220) String materialName,
        @NotNull @Positive Integer durationMinutes,
        @NotNull @Positive Integer sequence,
        @NotNull @Positive Integer weekNumber
) {
}
