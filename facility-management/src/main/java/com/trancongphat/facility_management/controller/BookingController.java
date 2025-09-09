package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.CreateBookingRequest;
import com.trancongphat.facility_management.dto.BookingResponseDTO;
import com.trancongphat.facility_management.entity.Booking;
import com.trancongphat.facility_management.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody CreateBookingRequest req) {
        BookingResponseDTO res = bookingService.createBooking(req);
        return ResponseEntity.ok(res);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Optional<Booking>> getBooking(@PathVariable Integer id) {
        Optional<Booking> booking = bookingService.findById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(@PathVariable Integer userId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }


    @PatchMapping("/cancel/{id}")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Integer id,
            @RequestParam Integer userId) {
        bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok("Đã hủy booking thành công");
    }



}
