package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.entity.Booking.BookingStatus;
import com.trancongphat.facility_management.entity.Booking.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserUserId(Integer userId);
    List<Booking> findByStatus(BookingStatus status);

    // check overlapping bookings for a resource (classroom or field or equipment)
    @Query("select case when count(b) > 0 then true else false end from Booking b " +
            "where b.resourceType = ?1 and b.resourceId = ?2 " +
            "and b.status <> com.trancongphat.facility_management.entity.Booking.BookingStatus.CANCELED " +
            "and b.startTime < ?4 and b.endTime > ?3")
    boolean existsOverlap(Booking.ResourceType resourceType, Integer resourceId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT b FROM Booking b " +
            "WHERE b.resourceType = :resourceType " +
            "AND b.startTime >= :startOfDay " +
            "AND b.startTime < :endOfDay " +
            "AND b.status <> com.trancongphat.facility_management.entity.Booking.BookingStatus.CANCELED")
    List<Booking> findByDateAndResourceType(
            @Param("resourceType") Booking.ResourceType resourceType,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
    @Modifying
    @Query("UPDATE Booking b SET b.status = 'APPROVED' WHERE b.bookingId = :bookingId")
    int approveBooking(@Param("bookingId") Integer bookingId);
    @Query("SELECT COUNT(b) FROM Booking b " +
            "WHERE MONTH(b.startTime) = :month AND YEAR(b.startTime) = :year " +
            "AND b.status <> com.trancongphat.facility_management.entity.Booking.BookingStatus.CANCELED")
    Long countBookingsInMonth(@Param("month") int month, @Param("year") int year);

}
