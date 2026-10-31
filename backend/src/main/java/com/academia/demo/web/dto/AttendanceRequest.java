package com.academia.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

public record AttendanceRequest(
        @NotNull UUID studentId,
        @NotNull UUID courseId,
        UUID sessionId,
        @NotNull LocalDate classDate,
        @NotBlank @Size(max = 20) String status,
        @Size(max = 220) String remarks,
        @NotBlank @Size(max = 160) String markedBy
) {
}
