package com.academia.demo.repository;

import com.academia.demo.domain.AttendanceRecord;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, UUID> {

    List<AttendanceRecord> findByStudentId(UUID studentId);

    List<AttendanceRecord> findByClassDate(LocalDate classDate);

    List<AttendanceRecord> findAllByOrderByClassDateAsc();

    List<AttendanceRecord> findByStudentIdOrderByClassDateAsc(UUID studentId);

    Optional<AttendanceRecord> findByStudentIdAndCourseIdAndClassDate(UUID studentId, UUID courseId, LocalDate classDate);
}
