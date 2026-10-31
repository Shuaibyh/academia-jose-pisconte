package com.academia.demo.web;

import com.academia.demo.service.AcademiaService;
import com.academia.demo.web.dto.StudentRequest;
import com.academia.demo.web.dto.StudentResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final AcademiaService academiaService;

    public StudentController(AcademiaService academiaService) {
        this.academiaService = academiaService;
    }

    @GetMapping
    public List<StudentResponse> list() {
        return academiaService.listStudents();
    }

    @PostMapping
    public ResponseEntity<StudentResponse> create(@Valid @RequestBody StudentRequest request) {
        StudentResponse created = academiaService.createStudent(request);
        return ResponseEntity.created(URI.create("/api/students/" + created.id())).body(created);
    }

    @PutMapping("/{id}")
    public StudentResponse update(@PathVariable UUID id, @Valid @RequestBody StudentRequest request) {
        return academiaService.updateStudent(id, request);
    }
}
