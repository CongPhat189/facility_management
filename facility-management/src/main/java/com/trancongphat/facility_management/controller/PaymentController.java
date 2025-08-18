package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.CreatePaymentRequest;
import com.trancongphat.facility_management.dto.InvoiceResponseDTO;
import com.trancongphat.facility_management.entity.Invoice;
import com.trancongphat.facility_management.entity.Booking;
import com.trancongphat.facility_management.service.InvoiceService;
import com.trancongphat.facility_management.service.PaymentService;
import com.trancongphat.facility_management.repository.BookingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final InvoiceService invoiceService;
    private final BookingRepository bookingRepo;

    public PaymentController(PaymentService paymentService,
                             InvoiceService invoiceService,
                             BookingRepository bookingRepo) {
        this.paymentService = paymentService;
        this.invoiceService = invoiceService;
        this.bookingRepo = bookingRepo;
    }

    /** Tạo invoice cho booking sân bóng (sau khi user đặt) */
    @PostMapping("/invoice/field/{bookingId}")
    public ResponseEntity<?> createFieldInvoice(@PathVariable Integer bookingId,
                                                @RequestParam(required = false) String promoCode) {
        Booking booking = bookingRepo.findById(bookingId.longValue())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        Invoice inv = invoiceService.createInvoiceForFieldBooking(booking, Integer.valueOf(promoCode));
        return ResponseEntity.ok(inv.getInvoiceId());
    }

    /** Thanh toán tiền mặt */
    @PostMapping("/cash")
    public ResponseEntity<?> payCash(@RequestBody CreatePaymentRequest req) {
        if (!"CASH".equalsIgnoreCase(req.getMethod()))
            return ResponseEntity.badRequest().body("method must be CASH");
        Invoice inv = paymentService.payCash(req.getInvoiceId(), req.getPayerInfo());
        return ResponseEntity.ok(paymentService.toDto(inv));
    }

    /** Khởi tạo thanh toán MoMo -> trả về payUrl (mock) */
    @PostMapping("/momo/create")
    public ResponseEntity<?> initMomo(@RequestParam Integer invoiceId) {
        String payUrl = paymentService.initMomoPayment(invoiceId);
        return ResponseEntity.ok(payUrl);
    }

    /** Callback MoMo (mock): hệ thống gọi endpoint này khi thanh toán thành công */
    @PostMapping("/momo/callback")
    public ResponseEntity<?> momoCallback(@RequestParam Integer invoiceId,
                                          @RequestParam String transId,
                                          @RequestParam(required = false) String providerResponse) {
        Invoice inv = paymentService.confirmMomoSuccess(invoiceId, transId, providerResponse);
        return ResponseEntity.ok(paymentService.toDto(inv));
    }
}
