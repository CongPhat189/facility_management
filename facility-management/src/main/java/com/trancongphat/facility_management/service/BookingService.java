package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.BookingResponseDTO;
import com.trancongphat.facility_management.dto.CreateBookingRequest;
import com.trancongphat.facility_management.entity.Booking;
import com.trancongphat.facility_management.entity.ResourceBooking;
import com.trancongphat.facility_management.entity.User;
import com.trancongphat.facility_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepo;
    @Autowired
    private ClassroomRepository classroomRepo;
    @Autowired
    private SportFieldRepository fieldRepo;
    @Autowired
    private EquipmentRepository equipmentRepo;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ResourceBookingRepository resourceBookingRepository;



    @Transactional
    public BookingResponseDTO createBooking(CreateBookingRequest req) {
        // minimal validation
        if (req.getUserId() == null) throw new IllegalArgumentException("userId required");
        if (req.getStartTime() == null || req.getEndTime() == null) throw new IllegalArgumentException("start/end required");
        if (!req.getEndTime().isAfter(req.getStartTime())) throw new IllegalArgumentException("end must be after start");
        if (req.getStartTime().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("Không thể đặt lịch trong quá khứ");
        }

        User user = userRepo.findById(Math.toIntExact(req.getUserId()))
                .orElseThrow(() -> new IllegalArgumentException("user not found"));

        Booking.ResourceType rt = Booking.ResourceType.valueOf(req.getResourceType());

        // conflict check using BookingRepository.existsOverlap(...)
        boolean conflict = bookingRepo.existsOverlap(Booking.ResourceType.valueOf(rt.name()), req.getResourceId(), req.getStartTime(), req.getEndTime());
        if (conflict) throw new IllegalStateException("Resource not available in this time range");

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResourceType(rt);
        booking.setResourceId(req.getResourceId());
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());
        booking.setPurpose(req.getPurpose());
        booking.setStatus(Booking.BookingStatus.PENDING);

        // if resource is sport field, mark paymentRequired true
        if (rt == Booking.ResourceType.SPORT_FIELD) {
            booking.setPaymentRequired(true);
        }


        booking = bookingRepo.save(booking);
        ResourceBooking rb = new ResourceBooking();
        rb.setBooking(booking);

        switch (rt) {
            case CLASSROOM -> {
                var classroom = classroomRepo.findById(req.getResourceId())
                        .orElseThrow(() -> new IllegalArgumentException("Classroom not found"));
                rb.setClassroom(classroom);
            }
            case SPORT_FIELD -> {
                var field = fieldRepo.findById(req.getResourceId())
                        .orElseThrow(() -> new IllegalArgumentException("Sport field not found"));
                rb.setSportField(field);
            }
            case EQUIPMENT -> {
                var equipment = equipmentRepo.findById(req.getResourceId())
                        .orElseThrow(() -> new IllegalArgumentException("Equipment not found"));
                rb.setEquipment(equipment);
            }
        }
        resourceBookingRepository.save(rb);




        // if sport field -> create invoice (immediately) using invoiceService
        if (rt == Booking.ResourceType.SPORT_FIELD) {
            invoiceService.createInvoiceForFieldBooking(booking);
        }

        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setResourceType(rt.name());
        dto.setResourceId(req.getResourceId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus().name());
        dto.setPurpose(booking.getPurpose());
        return dto;
    }

    // find bookings by user
    public java.util.List<BookingResponseDTO> getBookingsByUser(Integer userId) {
        return bookingRepo.findByUserUserId((userId)).stream().map(b -> {
            BookingResponseDTO d = new BookingResponseDTO();
            d.setUserId(b.getUser().getUserId());
            d.setFullName(b.getUser().getFullName());
            d.setBookingId(b.getBookingId());
            d.setResourceType(b.getResourceType().name());
            d.setResourceId(b.getResourceId());
            d.setStartTime(b.getStartTime());
            d.setEndTime(b.getEndTime());
            d.setPurpose(b.getPurpose());
            d.setStatus(b.getStatus().name());
            return d;
        }).toList();
    }


    //cancel booking
    @Transactional
    public void cancelBooking(Integer bookingId, Integer userId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (booking.getStatus() == Booking.BookingStatus.CANCELED) {
            throw new IllegalStateException("Booking already cancelled");
        }
        if (!booking.getUser().getUserId().equals(userId)) {
            throw new SecurityException("You are not allowed to cancel this booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELED);
        bookingRepo.save(booking);
    }
    // find booking by id
    public java.util.Optional<Booking> findById(Integer id) {
        return bookingRepo.findById(id);
    }

    // get bookings by date and resource type
    public List<Booking> getBookingsByDateAndResourceType(LocalDate date, String resourceType) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();

        return bookingRepo.findByDateAndResourceType(
                Booking.ResourceType.valueOf(resourceType),
                startOfDay,
                endOfDay
        );
    }



}
