package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.InvoiceResponseDTO;
import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final InvoiceRepository invoiceRepo;
    private final PaymentMethodRepository methodRepo;
    private final PaymentHistoryRepository historyRepo;

    public PaymentService(InvoiceRepository invoiceRepo,
                          PaymentMethodRepository methodRepo,
                          PaymentHistoryRepository historyRepo) {
        this.invoiceRepo = invoiceRepo;
        this.methodRepo = methodRepo;
        this.historyRepo = historyRepo;
    }

    @Transactional
    public Invoice payCash(Integer invoiceId, String payerInfo) {
        Invoice invoice = invoiceRepo.findById(Long.valueOf(invoiceId))
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        if (invoice.getStatus() == Invoice.InvoiceStatus.PAID) return invoice;

        PaymentMethod cash = methodRepo.findByMethodNameIgnoreCase("CASH")
                .orElseThrow(() -> new IllegalStateException("Payment method CASH not found"));

        invoice.setPaymentMethodId(cash.getMethodId());
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(invoice);

        PaymentHistory his = new PaymentHistory();
        his.setInvoice(invoice);
        his.setAmount(invoice.getFinalAmount());
        his.setPaymentId( cash.getMethodId());
        his.setPaymentDate(LocalDateTime.now());
        his.setPayerInfo(payerInfo);
        his.setStatus(PaymentHistory.PaymentStatus.SUCCESS);
        historyRepo.save(his);

        return invoice;
    }

    /** Khởi tạo thanh toán MoMo (mock đơn giản, trả về url đặt lệnh) */
    public String initMomoPayment(Integer invoiceId) {
        // Ở production: gọi MoMo API để lấy payUrl, ở đây mock
        return "https://momo.vn/pay?invoiceId=" + invoiceId + "&token=" + UUID.randomUUID();
    }

    /** Callback MoMo (mock) -> xác nhận đã thanh toán */
    @Transactional
    public Invoice confirmMomoSuccess(Integer invoiceId, String momoTransId, String providerResponse) {
        Invoice invoice = invoiceRepo.findById(Long.valueOf(invoiceId))
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        PaymentMethod momo = methodRepo.findByMethodNameIgnoreCase("MOMO")
                .orElseThrow(() -> new IllegalStateException("Payment method MOMO not found"));

        invoice.setPaymentMethodId(momo.getMethodId());
        invoice.setTransactionId(momoTransId);
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(invoice);

        PaymentHistory his = new PaymentHistory();
        his.setInvoice(invoice);
        his.setAmount(invoice.getFinalAmount());
        his.setPaymentId( momo.getMethodId());
        his.setTransactionId(momoTransId);
        his.setPaymentDate(LocalDateTime.now());
        his.setStatus(PaymentHistory.PaymentStatus.SUCCESS);
        historyRepo.save(his);

        return invoice;
    }

    /* Helper trả DTO đẹp (nếu bạn muốn dùng) */
    public InvoiceResponseDTO toDto(Invoice inv) {
        InvoiceResponseDTO dto = new InvoiceResponseDTO();
        dto.setInvoiceId(inv.getInvoiceId());
        dto.setBookingId(inv.getBooking() != null ? inv.getBooking().getBookingId() : null);
        dto.setUserId(inv.getUser() != null ? inv.getUser().getUserId() : null);
        dto.setTotalAmount(inv.getTotalAmount());
        dto.setDiscount(inv.getDiscount());
        dto.setTax(inv.getTax());
        dto.setFinalAmount(inv.getFinalAmount());
        dto.setStatus(inv.getStatus() != null ? inv.getStatus().name() : null);
        dto.setIssuedAt(inv.getIssuedAt());
        dto.setPaidAt(inv.getPaidAt());
        dto.setTransactionId(inv.getTransactionId());
        // details nếu cần -> load qua InvoiceService.getDetails(...)
        return dto;
    }
}
