package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Tìm tất cả booking của 1 user
    List<Booking> findByUserUserId(Integer userId);

    // Tìm tất cả booking theo status
    List<Booking> findByStatus(Booking.BookingStatus status);

    // ================== CHECK CONFLICT ==================

    /**
     * Check conflict đặt phòng học:
     * Nếu startTime < endTime mới và endTime > startTime mới
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
            "FROM Booking b " +
            "WHERE b.classroom.classroomId = :classroomId " +
            "AND b.status = 'APPROVED' " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsClassroomConflict(@Param("classroomId") Long classroomId,
                                    @Param("startTime") LocalDateTime startTime,
                                    @Param("endTime") LocalDateTime endTime);

    /**
     * Check conflict đặt sân thể thao
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
            "FROM Booking b " +
            "WHERE b.sportField.fieldId = :fieldId " +
            "AND b.status = 'APPROVED' " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsSportFieldConflict(@Param("fieldId") Long fieldId,
                                     @Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);

    /**
     * Check conflict mượn dụng cụ học tập
     * (ở đây có thể kiểm tra theo số lượng, ví dụ mượn 5/10 thì vẫn cho phép nếu chưa hết)
     * cùng thời gian thì không cho phép nếu đã có booking Approved
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
            "FROM Booking b " +
            "WHERE b.equipment.equipmentId = :equipmentId " +
            "AND b.status = 'APPROVED' " +
            "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsEquipmentConflict(@Param("equipmentId") Long equipmentId,
                                    @Param("startTime") LocalDateTime startTime,
                                    @Param("endTime") LocalDateTime endTime);

    // ================== QUẢN LÝ BOOKING ==================

    // Lấy danh sách booking theo khoảng thời gian
    List<Booking> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    // Lấy danh sách booking của một phòng học trong khoảng thời gian
    List<Booking> findByClassroomClassroomIdAndStartTimeBetween(Long classroomId,
                                                                LocalDateTime start,
                                                                LocalDateTime end);

    // Lấy danh sách booking của một sân thể thao trong khoảng thời gian
    List<Booking> findBySportFieldFieldIdAndStartTimeBetween(Long fieldId,
                                                             LocalDateTime start,
                                                             LocalDateTime end);

    // Lấy danh sách booking của một dụng cụ trong khoảng thời gian
    List<Booking> findByEquipmentEquipmentIdAndStartTimeBetween(Long equipmentId,
                                                                LocalDateTime start,
                                                                LocalDateTime end);
    // Lấy danh sách booking của một người dùng trong khoảng thời gian
    List<Booking> findByUserUserIdAndStartTimeBetween(Integer userId,
                                                      LocalDateTime start,
                                                      LocalDateTime end);

}
