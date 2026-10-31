package com.academia.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public record AttendanceSessionRequest(
        @NotNull UUID courseId,
        @NotBlank @Size(max = 120) String title,
        @NotNull LocalDate sessionDate,
        @NotNull @Positive Integer weekNumber,
        @NotBlank @Size(max = 160) String createdBy
) {
}
