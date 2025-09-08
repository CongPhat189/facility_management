package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.BookingResponseDTO;
import com.trancongphat.facility_management.entity.Booking;
import com.trancongphat.facility_management.entity.Booking.BookingStatus;
import com.trancongphat.facility_management.repository.BookingRepository;
import com.trancongphat.facility_management.service.AdminService;
import com.trancongphat.facility_management.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("api/admin/bookings")
public class AdminBookingController {
    @Autowired
    private  AdminService adminService;
    @Autowired
    private  BookingRepository bookingRepo;
    @Autowired
    private BookingService bookingService;


    @GetMapping("/pending")
    public List<BookingResponseDTO> getPendingBookings() {
        return bookingRepo.findByStatus(BookingStatus.PENDING)
                .stream().map(BookingResponseDTO::fromEntity).collect(Collectors.toList());
    }

    @PostMapping("/{id}/approve")
    public BookingResponseDTO approveBooking(@PathVariable Integer id, @RequestParam Integer adminId) {
        return BookingResponseDTO.fromEntity(adminService.approveBooking(id, adminId));
    }

    @PostMapping("/{id}/reject")
    public BookingResponseDTO rejectBooking(@PathVariable Integer id,
                                            @RequestParam String reason,
                                            @RequestParam Integer adminId) {
        return BookingResponseDTO.fromEntity(adminService.rejectBooking(id, reason, adminId));
    }

    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepo.findAll()
                .stream().map(BookingResponseDTO::fromEntity).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BookingResponseDTO getBookingById(@PathVariable Integer id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return BookingResponseDTO.fromEntity(booking);
    }

    @GetMapping("/by-date")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("resourceType") String resourceType
    ) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByDateAndResourceType(date, resourceType)
                .stream().map(BookingResponseDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(bookings);
    }

}
