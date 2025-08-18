package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.Booking;
import com.trancongphat.facility_management.entity.FieldBooking;
import com.trancongphat.facility_management.entity.SportField;
import com.trancongphat.facility_management.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SportFieldBookingRepository extends JpaRepository<FieldBooking, Long> {
    List<FieldBooking> findBySportField(SportField sportField);
    Optional<FieldBooking> findByBookingBookingId(Long bookingId);

    List<FieldBooking> findBySportFieldAndBookingStatus(SportField sportField, BookingStatus status);

    boolean existsBySportFieldAndBooking_StartTimeLessThanEqualAndBooking_EndTimeGreaterThanEqualAndBooking_Status(
            SportField sportField,
            LocalDateTime endTime,
            LocalDateTime startTime,
            Booking.BookingStatus status
    );
}
