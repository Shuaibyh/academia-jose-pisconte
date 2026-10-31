package com.academia.demo.web.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssignmentResponse(
        UUID id,
        CourseResponse course,
        String title,
        String instructions,
        LocalDate dueDate,
        LocalDateTime startAt,
        LocalDateTime endAt,
        Integer maxScore
) {
}
