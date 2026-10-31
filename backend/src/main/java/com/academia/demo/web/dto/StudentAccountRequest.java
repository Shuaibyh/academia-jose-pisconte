package com.academia.demo.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StudentAccountRequest(
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @NotBlank @Size(max = 60) String username,
        @Email @NotBlank @Size(max = 160) String email,
        @Size(max = 40) String documentNumber,
        @Size(max = 30) String phone,
        @Size(max = 120) String guardianName,
        @Size(max = 40) String guardianPhone,
        @Size(max = 60) String guardianRelationship,
        @Size(max = 120) String secondGuardianName,
        @Size(max = 40) String secondGuardianPhone,
        @Size(max = 60) String secondGuardianRelationship,
        @NotBlank @Size(max = 120) String password,
        @NotBlank @Size(max = 30) String role
) {
}
