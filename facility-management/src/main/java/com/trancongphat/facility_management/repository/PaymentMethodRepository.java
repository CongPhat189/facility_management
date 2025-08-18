package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {
    Optional<PaymentMethod> findByMethodNameIgnoreCase(String methodName);
}
