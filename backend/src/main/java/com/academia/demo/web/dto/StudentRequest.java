package com.academia.demo.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudentRequest(
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(max = 40) String documentNumber,
        @Size(max = 120) String guardianName,
        @Size(max = 40) String guardianPhone,
        @Size(max = 60) String guardianRelationship,
        @Size(max = 120) String secondGuardianName,
        @Size(max = 40) String secondGuardianPhone,
        @Size(max = 60) String secondGuardianRelationship
) {
}
