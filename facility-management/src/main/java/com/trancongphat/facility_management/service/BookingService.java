package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.CreateBookingRequest;
import com.trancongphat.facility_management.dto.BookingResponseDTO;
import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepo;
    private final ClassroomRepository classroomRepo;
    private final SportFieldRepository fieldRepo;
    private final EquipmentRepository equipmentRepo;
    private final ClassroomBookingRepository classroomBookingRepo;
    private final SportFieldBookingRepository fieldBookingRepo;
    private final EquipmentBookingRepository equipmentBookingRepo;
    private final InvoiceService invoiceService;

    public BookingService(BookingRepository bookingRepo,
                          ClassroomRepository classroomRepo,
                          SportFieldRepository fieldRepo,
                          EquipmentRepository equipmentRepo,
                          ClassroomBookingRepository classroomBookingRepo,
                          SportFieldBookingRepository fieldBookingRepo,
                          EquipmentBookingRepository equipmentBookingRepo,
                          InvoiceService invoiceService) {
        this.bookingRepo = bookingRepo;
        this.classroomRepo = classroomRepo;
        this.fieldRepo = fieldRepo;
        this.equipmentRepo = equipmentRepo;
        this.classroomBookingRepo = classroomBookingRepo;
        this.fieldBookingRepo = fieldBookingRepo;
        this.equipmentBookingRepo = equipmentBookingRepo;
        this.invoiceService = invoiceService;
    }

    @Transactional
    public BookingResponseDTO createBooking(CreateBookingRequest req) {
        // ===== Validate input =====
        if (req.getUserId() == null) throw new IllegalArgumentException("userId required");
        if (req.getStartTime() == null || req.getEndTime() == null) throw new IllegalArgumentException("startTime/endTime required");
        if (!req.getEndTime().isAfter(req.getStartTime())) throw new IllegalArgumentException("endTime must be after startTime");

        // ===== Create base booking =====
        Booking booking = new Booking();
        User user = new User();
        user.setUserId(req.getUserId());
        booking.setUser(user);
        booking.setPurpose(req.getPurpose());
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());
        booking.setStatus(Booking.BookingStatus.PENDING);

        booking = bookingRepo.save(booking); // persist to get bookingId

        // ===== Classroom booking =====
        if (req.getClassroomId() != null) {
            Classroom classroom = classroomRepo.findById(req.getClassroomId())
                    .orElseThrow(() -> new IllegalArgumentException("Classroom not found"));

            // conflict check
            boolean conflict = classroomBookingRepo.existsByClassroomAndBooking_StartTimeLessThanEqualAndBooking_EndTimeGreaterThanEqualAndBooking_Status(
                    classroom,
                    req.getEndTime(),
                    req.getStartTime(),
                    Booking.BookingStatus.APPROVED
            );
            if (conflict) throw new IllegalStateException("Classroom already booked in this time slot");

            ClassroomBooking cb = new ClassroomBooking();
            cb.setBooking(booking);
            cb.setClassroom(classroom);
            classroomBookingRepo.save(cb);
        }

        // ===== Sport field booking =====
        if (req.getFieldId() != null) {
            SportField field = fieldRepo.findById(req.getFieldId())
                    .orElseThrow(() -> new IllegalArgumentException("Sport field not found"));

            boolean conflict = fieldBookingRepo.existsBySportFieldAndBooking_StartTimeLessThanEqualAndBooking_EndTimeGreaterThanEqualAndBooking_Status(
                    field,
                    req.getEndTime(),
                    req.getStartTime(),
                    Booking.BookingStatus.APPROVED
            );
            if (conflict) throw new IllegalStateException("Sport field already booked in this time slot");

            FieldBooking fb = new FieldBooking();
            fb.setBooking(booking);
            fb.setField(field);
            fieldBookingRepo.save(fb);

            // sport field requires payment
            booking.setPaymentRequired(true);
            bookingRepo.save(booking);

            // generate invoice
            invoiceService.createInvoiceForFieldBooking(booking, req.getPromotionId());
        }

        // ===== Equipment booking =====
        if (req.getEquipmentId() != null) {
            Equipment equipment = equipmentRepo.findById(req.getEquipmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Equipment not found"));

            // check conflict (nếu cùng thiết bị + trùng thời gian + số lượng > tồn kho)
            boolean conflict = equipmentBookingRepo.existsByEquipmentAndBooking_StartTimeLessThanEqualAndBooking_EndTimeGreaterThanEqualAndBooking_Status(
                    equipment,
                    req.getEndTime(),
                    req.getStartTime(),
                    Booking.BookingStatus.APPROVED
            );
            if (conflict) throw new IllegalStateException("Equipment already booked in this time slot");

            EquipmentBooking eb = new EquipmentBooking();
            eb.setBooking(booking);
            eb.setEquipment(equipment);
            eb.setQuantity(req.getEquipmentQuantity() == null ? 1 : req.getEquipmentQuantity());
            equipmentBookingRepo.save(eb);
        }

        // ===== Build response =====
        BookingResponseDTO res = new BookingResponseDTO();
        res.setBookingId(booking.getBookingId());
        res.setPurpose(booking.getPurpose());
        res.setStartTime(booking.getStartTime());
        res.setEndTime(booking.getEndTime());
        res.setStatus(booking.getStatus().name());
        res.setPaymentRequired(booking.getPaymentRequired());

        if (req.getClassroomId() != null) res.setClassroomId(req.getClassroomId());
        if (req.getFieldId() != null) res.setFieldId(req.getFieldId());
        if (req.getEquipmentId() != null) res.setEquipmentId(req.getEquipmentId());

        return res;
    }

    public Optional<Booking> findById(Long id) {
        return bookingRepo.findById(id);
    }
    // lấy danh sách booking của 1 user trong 1 khoảng thời gian
    public List<BookingResponseDTO> getBookingsByUser(Integer userId) {
        List<Booking> bookings = bookingRepo.findByUserUserId(userId);
        return bookings.stream().map(BookingResponseDTO::fromEntity).toList();
    }
    @Transactional
    public void cancelBooking(Long bookingId, Integer userId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getUser().getUserId().equals(userId)) {
            throw new IllegalStateException("You can only cancel your own bookings");
        }

        // Chỉ cho phép hủy nếu trạng thái là PENDING hoặc REJECTED
        if (booking.getStatus() != Booking.BookingStatus.PENDING && booking.getStatus() != Booking.BookingStatus.REJECTED) {
            throw new IllegalStateException("Only pending or rejected bookings can be canceled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELED);
        bookingRepo.save(booking);
    }

}
