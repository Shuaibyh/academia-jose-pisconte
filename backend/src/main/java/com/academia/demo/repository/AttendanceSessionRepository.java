package com.academia.demo.repository;

import com.academia.demo.domain.AttendanceSession;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, UUID> {

    List<AttendanceSession> findByActiveTrueOrderBySessionDateAscWeekNumberAsc();
}
