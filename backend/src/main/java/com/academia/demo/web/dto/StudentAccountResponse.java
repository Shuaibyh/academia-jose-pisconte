package com.academia.demo.web.dto;

public record StudentAccountResponse(
        StudentResponse student,
        LoginResponse user
) {
}
