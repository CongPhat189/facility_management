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
import java.util.Map;
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

    // A. Đếm số booking theo loại tài nguyên
    @Query("""
        SELECT b.resourceType as type, COUNT(b) as total
        FROM Booking b
        WHERE b.startTime BETWEEN :from AND :to
          AND b.status <> com.trancongphat.facility_management.entity.Booking.BookingStatus.CANCELED
        GROUP BY b.resourceType
    """)
    List<Map<String,Object>> countByResourceType(@Param("from") LocalDateTime from,
                                                 @Param("to") LocalDateTime to);

    // C. Top thiết bị được mượn nhiều nhất
    @Query("""
        SELECT e.name
        FROM Booking b
        JOIN Equipment e ON e.id = b.resourceId
        WHERE b.resourceType = com.trancongphat.facility_management.entity.Booking.ResourceType.EQUIPMENT
          AND b.startTime BETWEEN :from AND :to
          AND b.status <> com.trancongphat.facility_management.entity.Booking.BookingStatus.CANCELED
        GROUP BY e.name
        ORDER BY COUNT(b) DESC
    """)
    List<String> topUsedEquipments(@Param("from") LocalDateTime from,
                                   @Param("to") LocalDateTime to);

    // D. Thống kê số booking theo trạng thái
    @Query("""
        SELECT b.status as status, COUNT(b) as total
        FROM Booking b
        WHERE b.startTime BETWEEN :from AND :to
        GROUP BY b.status
    """)
    List<Map<String,Object>> countByStatus(@Param("from") LocalDateTime from,
                                           @Param("to") LocalDateTime to);

    // E. Thống kê khung giờ cao điểm (native query vì dùng HOUR)
    @Query(value = """
        SELECT HOUR(b.start_time) as hour, COUNT(*) as total
        FROM bookings b
        WHERE b.start_time BETWEEN :from AND :to
          
        GROUP BY HOUR(b.start_time)
        ORDER BY hour
    """, nativeQuery = true)
    List<Map<String,Object>> countByStartHour(@Param("from") LocalDateTime from,
                                              @Param("to") LocalDateTime to);




}


