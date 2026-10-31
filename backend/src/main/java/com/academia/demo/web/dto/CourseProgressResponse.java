package com.academia.demo.web.dto;

import java.util.UUID;

public record CourseProgressResponse(
        UUID courseId,
        String code,
        String name,
        String teacher,
        int progress,
        double averageScore,
        double attendancePercent,
        long presentCount,
        long absentCount
) {
}
