package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.ClassroomBooking;
import com.trancongphat.facility_management.entity.Classroom;
import com.trancongphat.facility_management.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClassroomBookingRepository extends JpaRepository<ClassroomBooking, Long> {
    List<ClassroomBooking> findByClassroom(Classroom classroom);

    List<ClassroomBooking> findByClassroomAndBookingStatus(Classroom classroom, Booking.BookingStatus status);

    // Kiểm tra trùng lịch đặt cho phòng học
    boolean existsByClassroomAndBooking_StartTimeLessThanEqualAndBooking_EndTimeGreaterThanEqualAndBooking_Status(
            Classroom classroom,
            LocalDateTime endTime,
            LocalDateTime startTime,
            Booking.BookingStatus status
    );
}

