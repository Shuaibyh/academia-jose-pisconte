package com.academia.demo.repository;

import com.academia.demo.domain.PracticeScore;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PracticeScoreRepository extends JpaRepository<PracticeScore, UUID> {

    List<PracticeScore> findByStudentId(UUID studentId);
}
