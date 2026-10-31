package com.academia.demo.web.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AnnouncementResponse(
        UUID id,
        String title,
        String body,
        String category,
        String audience,
        String createdBy,
        String createdByUsername,
        OffsetDateTime createdAt
) {
}
