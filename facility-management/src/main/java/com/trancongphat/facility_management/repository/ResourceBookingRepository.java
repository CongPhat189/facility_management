package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.ResourceBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.util.Optional;

public interface ResourceBookingRepository extends JpaRepository<ResourceBooking, Integer> {
    Optional<ResourceBooking> findByBookingBookingId(Integer bookingId);
}
