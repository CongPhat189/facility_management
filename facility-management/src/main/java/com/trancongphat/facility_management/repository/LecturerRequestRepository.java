package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.LecturerRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LecturerRequestRepository extends JpaRepository<LecturerRequest, Long> {
    Optional<LecturerRequest> findByEmail(String email);
    boolean existsByEmail(String email);
}

