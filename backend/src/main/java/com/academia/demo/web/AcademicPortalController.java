package com.academia.demo.web;

import com.academia.demo.service.AcademiaService;
import com.academia.demo.web.dto.AnnouncementRequest;
import com.academia.demo.web.dto.AnnouncementResponse;
import com.academia.demo.web.dto.AttendanceRequest;
import com.academia.demo.web.dto.AttendanceResponse;
import com.academia.demo.web.dto.AttendanceSessionRequest;
import com.academia.demo.web.dto.AttendanceSessionResponse;
import com.academia.demo.web.dto.CourseProgressResponse;
import com.academia.demo.web.dto.StudentAccountRequest;
import com.academia.demo.web.dto.StudentAccountResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portal")
public class AcademicPortalController {

    private final AcademiaService academiaService;

    public AcademicPortalController(AcademiaService academiaService) {
        this.academiaService = academiaService;
    }

    @GetMapping("/announcements")
    public List<AnnouncementResponse> announcements() {
        return academiaService.listAnnouncements();
    }

    @PostMapping("/announcements")
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@Valid @RequestBody AnnouncementRequest request) {
        AnnouncementResponse created = academiaService.createAnnouncement(request);
        return ResponseEntity.created(URI.create("/api/portal/announcements/" + created.id())).body(created);
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable UUID id) {
        academiaService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/announcements/{id}")
    public AnnouncementResponse updateAnnouncement(@PathVariable UUID id, @Valid @RequestBody AnnouncementRequest request) {
        return academiaService.updateAnnouncement(id, request);
    }

    @GetMapping("/students/{studentId}/progress")
    public List<CourseProgressResponse> studentProgress(@PathVariable UUID studentId) {
        return academiaService.studentProgress(studentId);
    }

    @GetMapping("/attendance")
    public List<AttendanceResponse> attendance(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        return academiaService.attendanceByDate(date);
    }

    @GetMapping("/attendance-records")
    public List<AttendanceResponse> attendanceRecords() {
        return academiaService.listAttendanceRecords();
    }

    @GetMapping("/students/{studentId}/attendance")
    public List<AttendanceResponse> studentAttendance(@PathVariable UUID studentId) {
        return academiaService.attendanceByStudent(studentId);
    }

    @GetMapping("/attendance-sessions")
    public List<AttendanceSessionResponse> attendanceSessions() {
        return academiaService.listAttendanceSessions();
    }

    @PostMapping("/attendance-sessions")
    public ResponseEntity<AttendanceSessionResponse> createAttendanceSession(@Valid @RequestBody AttendanceSessionRequest request) {
        AttendanceSessionResponse created = academiaService.createAttendanceSession(request);
        return ResponseEntity.created(URI.create("/api/portal/attendance-sessions/" + created.id())).body(created);
    }

    @PostMapping("/attendance")
    public AttendanceResponse markAttendance(@Valid @RequestBody AttendanceRequest request) {
        return academiaService.markAttendance(request);
    }

    @PostMapping("/student-accounts")
    public ResponseEntity<StudentAccountResponse> createStudentAccount(@Valid @RequestBody StudentAccountRequest request) {
        StudentAccountResponse created = academiaService.createStudentAccount(request);
        return ResponseEntity.created(URI.create("/api/portal/student-accounts/" + created.user().id())).body(created);
    }
}
