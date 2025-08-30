package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.entity.Booking;
import com.trancongphat.facility_management.entity.Booking.BookingStatus;
import com.trancongphat.facility_management.repository.BookingRepository;
import com.trancongphat.facility_management.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@PreAuthorize( "hasRole('ROLE_ADMIN')")
@RestController
@RequestMapping("api/admin/bookings")
public class AdminBookingController {

    private final AdminService adminService;
    private final BookingRepository bookingRepo;

    public AdminBookingController(AdminService adminService, BookingRepository bookingRepo) {
        this.adminService = adminService;
        this.bookingRepo = bookingRepo;
    }

    // Lấy danh sách booking đang chờ duyệt
    @GetMapping("/pending")
    public List<Booking> getPendingBookings() {
        return bookingRepo.findByStatus(BookingStatus.PENDING);
    }

    // Admin duyệt booking
    @PostMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Integer id, @RequestParam Integer adminId) {
        return adminService.approveBooking(id, adminId);
    }

    // Admin từ chối booking
    @PostMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable Integer id,
                                 @RequestParam String reason,
                                 @RequestParam Integer adminId) {
        return adminService.rejectBooking(id, reason, adminId);
    }
}
