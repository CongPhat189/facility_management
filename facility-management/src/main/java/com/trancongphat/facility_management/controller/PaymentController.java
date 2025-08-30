package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.CreatePaymentRequest;
import com.trancongphat.facility_management.dto.InvoiceResponseDTO;
import com.trancongphat.facility_management.entity.Invoice;
import com.trancongphat.facility_management.entity.Booking;
import com.trancongphat.facility_management.service.InvoiceService;
import com.trancongphat.facility_management.service.PaymentService;
import com.trancongphat.facility_management.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private  PaymentService paymentService;
    @Autowired
    private  InvoiceService invoiceService;

    @PostMapping("/cash")
    public ResponseEntity<?> payCash(@RequestBody CreatePaymentRequest req) {
        if (!"CASH".equalsIgnoreCase(req.getMethod()))
            return ResponseEntity.badRequest().body("method must be CASH");
        Invoice inv = paymentService.payCash((req.getInvoiceId()), req.getPayerInfo());
        return ResponseEntity.ok(paymentService.toDto(inv));
    }

    @PostMapping("/momo/init/{invoiceId}")
    public ResponseEntity<?> initMomo(@PathVariable Integer invoiceId) {
        String url = paymentService.initMomoPayment(invoiceId);
        return ResponseEntity.ok(url);
    }

    // MoMo notify endpoint (configured as notifyUrl)
    @PostMapping("/momo/notify")
    public ResponseEntity<?> momoNotify(@RequestParam String invoiceId,
                                        @RequestParam String transId,
                                        @RequestParam(required = false) String extra) {
        Invoice inv = paymentService.confirmMomo(invoiceId, transId, extra);
        return ResponseEntity.ok(paymentService.toDto(inv));
    }
}

