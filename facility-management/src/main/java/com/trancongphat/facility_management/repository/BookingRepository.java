package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserUserId(Integer userId);
    List<Booking> findByStatus(BookingStatus status);

    // check overlapping bookings for a resource (classroom or field or equipment)
    @Query("select case when count(b) > 0 then true else false end from Booking b " +
            "where b.resourceType = ?1 and b.resourceId = ?2 " +
            "and b.status <> com.trancongphat.facility_management.entity.Booking.BookingStatus.CANCELLED " +
            "and b.startTime < ?4 and b.endTime > ?3")
    boolean existsOverlap(Booking.ResourceType resourceType, Integer resourceId, LocalDateTime start, LocalDateTime end);
}
