package com.academia.demo.web;

import com.academia.demo.service.AcademiaService;
import com.academia.demo.web.dto.AssignmentRequest;
import com.academia.demo.web.dto.AssignmentResponse;
import com.academia.demo.web.dto.LessonRequest;
import com.academia.demo.web.dto.LessonResponse;
import com.academia.demo.web.dto.SubmissionRequest;
import com.academia.demo.web.dto.SubmissionResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/classroom")
public class VirtualClassroomController {

    private final AcademiaService academiaService;

    public VirtualClassroomController(AcademiaService academiaService) {
        this.academiaService = academiaService;
    }

    @GetMapping("/lessons")
    public List<LessonResponse> lessons() {
        return academiaService.listLessons();
    }

    @PostMapping("/lessons")
    public ResponseEntity<LessonResponse> createLesson(@Valid @RequestBody LessonRequest request) {
        LessonResponse created = academiaService.createLesson(request);
        return ResponseEntity.created(URI.create("/api/classroom/lessons/" + created.id())).body(created);
    }

    @GetMapping("/assignments")
    public List<AssignmentResponse> assignments() {
        return academiaService.listAssignments();
    }

    @PostMapping("/assignments")
    public ResponseEntity<AssignmentResponse> createAssignment(@Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse created = academiaService.createAssignment(request);
        return ResponseEntity.created(URI.create("/api/classroom/assignments/" + created.id())).body(created);
    }

    @GetMapping("/submissions")
    public List<SubmissionResponse> submissions() {
        return academiaService.listSubmissions();
    }

    @PostMapping("/submissions")
    public ResponseEntity<SubmissionResponse> submit(@Valid @RequestBody SubmissionRequest request) {
        SubmissionResponse created = academiaService.createSubmission(request);
        return ResponseEntity.created(URI.create("/api/classroom/submissions/" + created.id())).body(created);
    }
}
