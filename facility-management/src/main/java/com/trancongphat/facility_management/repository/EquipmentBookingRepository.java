package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.EquipmentBooking;
import com.trancongphat.facility_management.entity.Equipment;
import com.trancongphat.facility_management.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EquipmentBookingRepository extends JpaRepository<EquipmentBooking, Long> {
    List<EquipmentBooking> findByEquipment(Equipment equipment);

    List<EquipmentBooking> findByEquipmentAndBookingStatus(Equipment equipment, BookingStatus status);

    boolean existsByEquipmentAndBooking_StartTimeLessThanEqualAndBooking_EndTimeGreaterThanEqualAndBooking_Status(
            Equipment equipment,
            LocalDateTime endTime,
            LocalDateTime startTime,
            BookingStatus status
    );
}

