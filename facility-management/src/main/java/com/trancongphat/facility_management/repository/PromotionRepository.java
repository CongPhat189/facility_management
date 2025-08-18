package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    Optional<Promotion> findById(Integer promotionId);
    Optional<Promotion> findByCodeIgnoreCase(String code);


}