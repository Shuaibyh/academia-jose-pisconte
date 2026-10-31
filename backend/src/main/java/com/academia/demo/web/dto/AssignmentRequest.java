package com.academia.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentRequest(
        @NotNull UUID courseId,
        @NotBlank @Size(max = 160) String title,
        @NotBlank String instructions,
        LocalDate dueDate,
        @NotNull LocalDateTime startAt,
        @NotNull LocalDateTime endAt,
        @NotNull @Positive Integer maxScore
) {
}
