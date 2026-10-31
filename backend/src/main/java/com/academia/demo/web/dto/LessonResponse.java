package com.academia.demo.web.dto;

import java.util.UUID;

public record LessonResponse(
        UUID id,
        CourseResponse course,
        String title,
        String description,
        String videoUrl,
        String materialType,
        String materialName,
        Integer durationMinutes,
        Integer sequence,
        Integer weekNumber
) {
}
