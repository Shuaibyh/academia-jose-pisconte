package com.academia.demo.repository;

import com.academia.demo.domain.Submission;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, UUID> {

    List<Submission> findAllByOrderBySubmittedAtDesc();
}
