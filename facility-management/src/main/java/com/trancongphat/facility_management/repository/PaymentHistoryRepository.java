package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Integer> {}
