package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.InvoiceResponseDTO;
import com.trancongphat.facility_management.entity.Invoice;
import com.trancongphat.facility_management.repository.InvoiceRepository;
import com.trancongphat.facility_management.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceRepository invoiceRepo;
    private final PaymentService paymentService;

    public InvoiceController(InvoiceRepository invoiceRepo, PaymentService paymentService) {
        this.invoiceRepo = invoiceRepo;
        this.paymentService = paymentService;
    }

    // Lấy tất cả hóa đơn của 1 user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByUser(@PathVariable Integer userId) {
        List<InvoiceResponseDTO> invoices = invoiceRepo.findByUser_UserId(userId)
                .stream().map(paymentService::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(invoices);
    }

    // Lấy chi tiết hóa đơn theo invoiceId
    @GetMapping("/{invoiceId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoice(@PathVariable Integer invoiceId) {
        Invoice inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        return ResponseEntity.ok(paymentService.toDto(inv));
    }

    // Lấy hóa đơn theo bookingId
    @GetMapping("/by-booking/{bookingId}")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceByBooking(@PathVariable Integer bookingId) {
        Invoice inv = invoiceRepo.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        return ResponseEntity.ok(paymentService.toDto(inv));
    }
}
