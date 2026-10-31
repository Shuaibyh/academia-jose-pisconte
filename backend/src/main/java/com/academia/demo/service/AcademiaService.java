package com.academia.demo.service;

import com.academia.demo.domain.Announcement;
import com.academia.demo.domain.AppUser;
import com.academia.demo.domain.Assignment;
import com.academia.demo.domain.AttendanceRecord;
import com.academia.demo.domain.AttendanceSession;
import com.academia.demo.domain.Course;
import com.academia.demo.domain.Enrollment;
import com.academia.demo.domain.EnrollmentStatus;
import com.academia.demo.domain.Lesson;
import com.academia.demo.domain.PracticeScore;
import com.academia.demo.domain.Student;
import com.academia.demo.domain.Submission;
import com.academia.demo.repository.AnnouncementRepository;
import com.academia.demo.repository.AppUserRepository;
import com.academia.demo.repository.AssignmentRepository;
import com.academia.demo.repository.AttendanceRecordRepository;
import com.academia.demo.repository.AttendanceSessionRepository;
import com.academia.demo.repository.CourseRepository;
import com.academia.demo.repository.EnrollmentRepository;
import com.academia.demo.repository.LessonRepository;
import com.academia.demo.repository.PracticeScoreRepository;
import com.academia.demo.repository.StudentRepository;
import com.academia.demo.repository.SubmissionRepository;
import com.academia.demo.web.dto.AnnouncementRequest;
import com.academia.demo.web.dto.AnnouncementResponse;
import com.academia.demo.web.dto.AssignmentResponse;
import com.academia.demo.web.dto.AssignmentRequest;
import com.academia.demo.web.dto.AttendanceRequest;
import com.academia.demo.web.dto.AttendanceResponse;
import com.academia.demo.web.dto.AttendanceSessionRequest;
import com.academia.demo.web.dto.AttendanceSessionResponse;
import com.academia.demo.web.dto.CourseProgressResponse;
import com.academia.demo.web.dto.CourseRequest;
import com.academia.demo.web.dto.CourseResponse;
import com.academia.demo.web.dto.DashboardResponse;
import com.academia.demo.web.dto.EnrollmentRequest;
import com.academia.demo.web.dto.EnrollmentResponse;
import com.academia.demo.web.dto.LessonResponse;
import com.academia.demo.web.dto.LessonRequest;
import com.academia.demo.web.dto.LoginRequest;
import com.academia.demo.web.dto.LoginResponse;
import com.academia.demo.web.dto.ProfilePhotoRequest;
import com.academia.demo.web.dto.StudentAccountRequest;
import com.academia.demo.web.dto.StudentAccountResponse;
import com.academia.demo.web.dto.StudentRequest;
import com.academia.demo.web.dto.StudentResponse;
import com.academia.demo.web.dto.SubmissionRequest;
import com.academia.demo.web.dto.SubmissionResponse;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Comparator;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AcademiaService {

    private final StudentRepository studentRepository;
    private final AppUserRepository appUserRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final AnnouncementRepository announcementRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final AttendanceSessionRepository attendanceSessionRepository;
    private final PracticeScoreRepository practiceScoreRepository;

    public AcademiaService(
            StudentRepository studentRepository,
            AppUserRepository appUserRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            LessonRepository lessonRepository,
            AssignmentRepository assignmentRepository,
            SubmissionRepository submissionRepository,
            AnnouncementRepository announcementRepository,
            AttendanceRecordRepository attendanceRecordRepository,
            AttendanceSessionRepository attendanceSessionRepository,
            PracticeScoreRepository practiceScoreRepository
    ) {
        this.studentRepository = studentRepository;
        this.appUserRepository = appUserRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.announcementRepository = announcementRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.attendanceSessionRepository = attendanceSessionRepository;
        this.practiceScoreRepository = practiceScoreRepository;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        AppUser user = appUserRepository.findByUsernameIgnoreCaseAndPassword(request.username(), request.password())
                .orElseThrow(() -> new EntityNotFoundException("Credenciales invalidas"));
        return toLoginResponse(user);
    }

    @Transactional
    public LoginResponse updateProfilePhoto(UUID userId, ProfilePhotoRequest request) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setProfilePhotoUrl(request.profilePhotoUrl());
        return toLoginResponse(appUserRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> listStudents() {
        return studentRepository.findAll().stream().map(this::toStudentResponse).toList();
    }

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        Student student = new Student();
        student.setFirstName(request.firstName());
        student.setLastName(request.lastName());
        student.setEmail(request.email());
        student.setDocumentNumber(request.documentNumber());
        student.setGuardianName(request.guardianName());
        student.setGuardianPhone(request.guardianPhone());
        student.setGuardianRelationship(request.guardianRelationship());
        student.setSecondGuardianName(request.secondGuardianName());
        student.setSecondGuardianPhone(request.secondGuardianPhone());
        student.setSecondGuardianRelationship(request.secondGuardianRelationship());
        return toStudentResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentResponse updateStudent(UUID id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        student.setFirstName(request.firstName());
        student.setLastName(request.lastName());
        student.setEmail(request.email());
        student.setDocumentNumber(request.documentNumber());
        student.setGuardianName(request.guardianName());
        student.setGuardianPhone(request.guardianPhone());
        student.setGuardianRelationship(request.guardianRelationship());
        student.setSecondGuardianName(request.secondGuardianName());
        student.setSecondGuardianPhone(request.secondGuardianPhone());
        student.setSecondGuardianRelationship(request.secondGuardianRelationship());
        return toStudentResponse(studentRepository.save(student));
    }

    @Transactional
    public StudentAccountResponse createStudentAccount(StudentAccountRequest request) {
        String role = normalizeAccountRole(request.role());
        Student savedStudent = null;

        if ("STUDENT".equals(role)) {
            Student student = new Student();
            student.setFirstName(request.firstName());
            student.setLastName(request.lastName());
            student.setEmail(request.email());
            student.setDocumentNumber(request.documentNumber());
            student.setGuardianName(request.guardianName());
            student.setGuardianPhone(request.guardianPhone());
            student.setGuardianRelationship(request.guardianRelationship());
            student.setSecondGuardianName(request.secondGuardianName());
            student.setSecondGuardianPhone(request.secondGuardianPhone());
            student.setSecondGuardianRelationship(request.secondGuardianRelationship());
            savedStudent = studentRepository.save(student);
        }

        AppUser user = new AppUser();
        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setPassword(request.password());
        user.setDisplayName(request.firstName() + " " + request.lastName());
        user.setRole(role);
        user.setPhone(request.phone());
        user.setStudent(savedStudent);
        AppUser savedUser = appUserRepository.save(user);

        return new StudentAccountResponse(savedStudent == null ? null : toStudentResponse(savedStudent), toLoginResponse(savedUser));
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> listCourses() {
        return courseRepository.findAll().stream().map(this::toCourseResponse).toList();
    }

    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course();
        course.setCode(request.code());
        course.setName(request.name());
        course.setCredits(request.credits());
        course.setTeacher(request.teacher());
        return toCourseResponse(courseRepository.save(course));
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> listEnrollments() {
        return enrollmentRepository.findAll().stream().map(this::toEnrollmentResponse).toList();
    }

    @Transactional
    public EnrollmentResponse createEnrollment(EnrollmentRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        return toEnrollmentResponse(enrollmentRepository.save(enrollment));
    }

    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        return new DashboardResponse(
                studentRepository.count(),
                courseRepository.count(),
                enrollmentRepository.count(),
                lessonRepository.count(),
                assignmentRepository.count(),
                submissionRepository.count()
        );
    }

    @Transactional(readOnly = true)
    public List<LessonResponse> listLessons() {
        return lessonRepository.findAllByOrderByCourseNameAscSequenceAsc().stream()
                .map(this::toLessonResponse)
                .toList();
    }

    @Transactional
    public LessonResponse createLesson(LessonRequest request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));
        Lesson lesson = new Lesson();
        lesson.setCourse(course);
        lesson.setTitle(request.title());
        lesson.setDescription(request.description());
        lesson.setVideoUrl(request.videoUrl());
        lesson.setMaterialType(request.materialType());
        lesson.setMaterialName(request.materialName());
        lesson.setDurationMinutes(request.durationMinutes());
        lesson.setSequence(request.sequence());
        lesson.setWeekNumber(request.weekNumber());
        return toLessonResponse(lessonRepository.save(lesson));
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> listAssignments() {
        return assignmentRepository.findAllByOrderByEndAtAscTitleAsc().stream()
                .map(this::toAssignmentResponse)
                .toList();
    }

    @Transactional
    public AssignmentResponse createAssignment(AssignmentRequest request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));
        Assignment assignment = new Assignment();
        assignment.setCourse(course);
        assignment.setTitle(request.title());
        assignment.setInstructions(request.instructions());
        assignment.setStartAt(request.startAt());
        assignment.setEndAt(request.endAt());
        assignment.setDueDate(request.dueDate() == null ? request.endAt().toLocalDate() : request.dueDate());
        assignment.setMaxScore(request.maxScore());
        return toAssignmentResponse(assignmentRepository.save(assignment));
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> listSubmissions() {
        return submissionRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(this::toSubmissionResponse)
                .toList();
    }

    @Transactional
    public SubmissionResponse createSubmission(SubmissionRequest request) {
        Assignment assignment = assignmentRepository.findById(request.assignmentId())
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found"));
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setArtifactType(request.artifactType());
        submission.setArtifactUrl(request.artifactUrl());
        submission.setArtifactName(request.artifactName());
        submission.setStudentComment(request.studentComment());
        submission.setScore(scoreDemoSubmission(request.studentComment(), assignment.getMaxScore()));
        submission.setStatus("AI_REVIEWED");
        submission.setAiFeedback(buildDemoFeedback(request.studentComment(), assignment));
        return toSubmissionResponse(submissionRepository.save(submission));
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> listAnnouncements() {
        return announcementRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::toAnnouncementResponse)
                .toList();
    }

    @Transactional
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        Announcement announcement = new Announcement();
        announcement.setTitle(request.title());
        announcement.setBody(request.body());
        announcement.setCategory(request.category());
        announcement.setAudience(request.audience());
        announcement.setCreatedBy(request.createdBy());
        announcement.setCreatedByUsername(request.createdByUsername());
        announcement.setActive(true);
        return toAnnouncementResponse(announcementRepository.save(announcement));
    }

    @Transactional
    public AnnouncementResponse updateAnnouncement(UUID id, AnnouncementRequest request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found"));
        announcement.setTitle(request.title());
        announcement.setBody(request.body());
        announcement.setCategory(request.category());
        announcement.setAudience(request.audience());
        return toAnnouncementResponse(announcementRepository.save(announcement));
    }

    @Transactional
    public void deleteAnnouncement(UUID id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found"));
        announcement.setActive(false);
    }

    @Transactional(readOnly = true)
    public List<CourseProgressResponse> studentProgress(UUID studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findAll().stream()
                .filter(enrollment -> enrollment.getStudent().getId().equals(studentId))
                .toList();
        Map<UUID, List<PracticeScore>> scoresByCourse = practiceScoreRepository.findByStudentId(studentId).stream()
                .collect(Collectors.groupingBy(score -> score.getCourse().getId()));
        Map<UUID, List<AttendanceRecord>> attendanceByCourse = attendanceRecordRepository.findByStudentId(studentId).stream()
                .collect(Collectors.groupingBy(record -> record.getCourse().getId()));

        return enrollments.stream()
                .map(enrollment -> toCourseProgressResponse(
                        enrollment.getCourse(),
                        scoresByCourse.getOrDefault(enrollment.getCourse().getId(), List.of()),
                        attendanceByCourse.getOrDefault(enrollment.getCourse().getId(), List.of())
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> attendanceByDate(LocalDate date) {
        return attendanceRecordRepository.findByClassDate(date).stream()
                .sorted(Comparator
                        .comparing((AttendanceRecord record) -> record.getCourse().getName())
                        .thenComparing(record -> record.getStudent().getLastName()))
                .map(this::toAttendanceResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> listAttendanceRecords() {
        return attendanceRecordRepository.findAllByOrderByClassDateAsc().stream()
                .map(this::toAttendanceResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> attendanceByStudent(UUID studentId) {
        return attendanceRecordRepository.findByStudentIdOrderByClassDateAsc(studentId).stream()
                .map(this::toAttendanceResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceSessionResponse> listAttendanceSessions() {
        return attendanceSessionRepository.findByActiveTrueOrderBySessionDateAscWeekNumberAsc().stream()
                .map(this::toAttendanceSessionResponse)
                .toList();
    }

    @Transactional
    public AttendanceSessionResponse createAttendanceSession(AttendanceSessionRequest request) {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));
        AttendanceSession session = new AttendanceSession();
        session.setCourse(course);
        session.setTitle(request.title());
        session.setSessionDate(request.sessionDate());
        session.setWeekNumber(request.weekNumber());
        session.setCreatedBy(request.createdBy());
        session.setActive(true);
        return toAttendanceSessionResponse(attendanceSessionRepository.save(session));
    }

    @Transactional
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));
        AttendanceSession session = request.sessionId() == null ? null : attendanceSessionRepository.findById(request.sessionId())
                .orElseThrow(() -> new EntityNotFoundException("Attendance session not found"));

        AttendanceRecord record = attendanceRecordRepository
                .findByStudentIdAndCourseIdAndClassDate(request.studentId(), request.courseId(), request.classDate())
                .orElseGet(AttendanceRecord::new);
        record.setStudent(student);
        record.setCourse(course);
        record.setSession(session);
        record.setClassDate(request.classDate());
        record.setStatus(request.status());
        record.setRemarks(request.remarks());
        record.setMarkedBy(request.markedBy());
        return toAttendanceResponse(attendanceRecordRepository.save(record));
    }

    private StudentResponse toStudentResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                student.getDocumentNumber(),
                student.getGuardianName(),
                student.getGuardianPhone(),
                student.getGuardianRelationship(),
                student.getSecondGuardianName(),
                student.getSecondGuardianPhone(),
                student.getSecondGuardianRelationship(),
                student.getCreatedAt()
        );
    }

    private CourseResponse toCourseResponse(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getCredits(),
                course.getTeacher(),
                course.getCreatedAt()
        );
    }

    private LessonResponse toLessonResponse(Lesson lesson) {
        return new LessonResponse(
                lesson.getId(),
                toCourseResponse(lesson.getCourse()),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getVideoUrl(),
                lesson.getMaterialType(),
                lesson.getMaterialName(),
                lesson.getDurationMinutes(),
                lesson.getSequence(),
                lesson.getWeekNumber()
        );
    }

    private AssignmentResponse toAssignmentResponse(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                toCourseResponse(assignment.getCourse()),
                assignment.getTitle(),
                assignment.getInstructions(),
                assignment.getDueDate(),
                assignment.getStartAt(),
                assignment.getEndAt(),
                assignment.getMaxScore()
        );
    }

    private EnrollmentResponse toEnrollmentResponse(Enrollment enrollment) {
        return new EnrollmentResponse(
                enrollment.getId(),
                toStudentResponse(enrollment.getStudent()),
                toCourseResponse(enrollment.getCourse()),
                enrollment.getStatus(),
                enrollment.getEnrolledAt()
        );
    }

    private SubmissionResponse toSubmissionResponse(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                toAssignmentResponse(submission.getAssignment()),
                toStudentResponse(submission.getStudent()),
                submission.getArtifactType(),
                submission.getArtifactUrl(),
                submission.getArtifactName(),
                submission.getStudentComment(),
                submission.getAiFeedback(),
                submission.getScore(),
                submission.getStatus(),
                submission.getSubmittedAt()
        );
    }

    private AnnouncementResponse toAnnouncementResponse(Announcement announcement) {
        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getBody(),
                announcement.getCategory(),
                announcement.getAudience(),
                announcement.getCreatedBy(),
                announcement.getCreatedByUsername(),
                announcement.getCreatedAt()
        );
    }

    private AttendanceResponse toAttendanceResponse(AttendanceRecord attendance) {
        return new AttendanceResponse(
                attendance.getId(),
                toStudentResponse(attendance.getStudent()),
                toCourseResponse(attendance.getCourse()),
                attendance.getSession() == null ? null : attendance.getSession().getId(),
                attendance.getClassDate(),
                attendance.getStatus(),
                attendance.getRemarks(),
                attendance.getMarkedBy()
        );
    }

    private AttendanceSessionResponse toAttendanceSessionResponse(AttendanceSession session) {
        return new AttendanceSessionResponse(
                session.getId(),
                toCourseResponse(session.getCourse()),
                session.getTitle(),
                session.getSessionDate(),
                session.getWeekNumber(),
                session.getCreatedBy()
        );
    }

    private CourseProgressResponse toCourseProgressResponse(
            Course course,
            List<PracticeScore> scores,
            List<AttendanceRecord> attendance
    ) {
        double average = averageScore(scores);
        long present = attendance.stream().filter(record -> "PRESENT".equals(record.getStatus())).count();
        long absent = attendance.stream().filter(record -> "ABSENT".equals(record.getStatus())).count();
        long totalAttendance = present + absent;
        double attendancePercent = totalAttendance == 0 ? 0 : round((present * 100.0) / totalAttendance);
        int progress = scores.isEmpty() ? 0 : Math.min(100, scores.size() * 50);
        return new CourseProgressResponse(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getTeacher(),
                progress,
                average,
                attendancePercent,
                present,
                absent
        );
    }

    private LoginResponse toLoginResponse(AppUser user) {
        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole(),
                user.getProfilePhotoUrl(),
                user.getPhone(),
                user.getStudent() == null ? null : user.getStudent().getId()
        );
    }

    private double averageScore(List<PracticeScore> scores) {
        if (scores.isEmpty()) {
            return 0;
        }
        BigDecimal total = scores.stream()
                .map(score -> score.getScore()
                        .multiply(BigDecimal.valueOf(20))
                        .divide(score.getMaxScore(), 2, RoundingMode.HALF_UP))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return round(total.divide(BigDecimal.valueOf(scores.size()), 2, RoundingMode.HALF_UP).doubleValue());
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private int scoreDemoSubmission(String studentComment, int maxScore) {
        int lengthBonus = Math.min(studentComment.length() / 30, 6);
        return Math.min(maxScore, 12 + lengthBonus);
    }

    private String normalizeAccountRole(String role) {
        return "STUDENT";
    }

    private String buildDemoFeedback(String studentComment, Assignment assignment) {
        String base = "Revision IA demo: entrega recibida para '" + assignment.getTitle() + "'. ";
        if (studentComment.length() < 80) {
            return base + "Agrega mas detalle sobre tu procedimiento y evidencia para una correccion mas precisa.";
        }
        return base + "Buen nivel de detalle. Revisa orden, claridad del procedimiento y conclusiones antes de enviar la version final.";
    }
}
