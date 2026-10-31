package com.academia.demo.web.dto;

import java.time.LocalDate;
import java.util.UUID;

public record AttendanceSessionResponse(
        UUID id,
        CourseResponse course,
        String title,
        LocalDate sessionDate,
        Integer weekNumber,
        String createdBy
) {
}
