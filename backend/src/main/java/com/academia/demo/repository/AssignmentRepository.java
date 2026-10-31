package com.academia.demo.repository;

import com.academia.demo.domain.Assignment;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {

    List<Assignment> findAllByOrderByEndAtAscTitleAsc();
}
