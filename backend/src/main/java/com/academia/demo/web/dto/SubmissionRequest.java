package com.academia.demo.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record SubmissionRequest(
        @NotNull UUID assignmentId,
        @NotNull UUID studentId,
        @NotBlank @Size(max = 30) String artifactType,
        @NotBlank String artifactUrl,
        @NotBlank String artifactName,
        @NotBlank String studentComment
) {
}
