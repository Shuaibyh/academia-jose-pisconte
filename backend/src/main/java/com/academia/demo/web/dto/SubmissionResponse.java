package com.academia.demo.web.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SubmissionResponse(
        UUID id,
        AssignmentResponse assignment,
        StudentResponse student,
        String artifactType,
        String artifactUrl,
        String artifactName,
        String studentComment,
        String aiFeedback,
        Integer score,
        String status,
        OffsetDateTime submittedAt
) {
}
