package com.academia.demo.web.dto;

import java.time.LocalDate;
import java.util.UUID;

public record AttendanceResponse(
        UUID id,
        StudentResponse student,
        CourseResponse course,
        UUID sessionId,
        LocalDate classDate,
        String status,
        String remarks,
        String markedBy
) {
}
