package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.InvoiceResponseDTO;
import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.repository.*;
import com.trancongphat.facility_management.util.HmacSHA256Util;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final InvoiceRepository invoiceRepo;
    private final PaymentMethodRepository methodRepo;
    private final PaymentHistoryRepository historyRepo;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${momo.partnerCode}")
    private String partnerCode;
    @Value("${momo.accessKey}")
    private String accessKey;
    @Value("${momo.secretKey}")
    private String secretKey;
    @Value("${momo.endpoint}")
    private String endpoint;
    @Value("${momo.redirectUrl}")
    private String redirectUrl;
    @Value("${momo.ipnUrl}")
    private String ipnUrl;
    @Value("${momo.requestType}")
    private String requestType;

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

    /** Khởi tạo thanh toán MoMo */
    public String initMomoPayment(Integer invoiceId) {
        Invoice invoice = invoiceRepo.findById(Long.valueOf(invoiceId))
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        String orderId = UUID.randomUUID().toString();
        String requestId = UUID.randomUUID().toString();
        String amount = invoice.getFinalAmount().toBigInteger().toString();

        String rawData = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=Pay invoice " + invoiceId +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = HmacSHA256Util.sign(rawData, secretKey);

        Map<String, Object> payload = new HashMap<>();
        payload.put("partnerCode", partnerCode);
        payload.put("accessKey", accessKey);
        payload.put("requestId", requestId);
        payload.put("amount", amount);
        payload.put("orderId", orderId);
        payload.put("orderInfo", "Pay invoice " + invoiceId);
        payload.put("redirectUrl", redirectUrl);
        payload.put("ipnUrl", ipnUrl);
        payload.put("extraData", "");
        payload.put("requestType", requestType);
        payload.put("signature", signature);
        payload.put("lang", "en");

        ResponseEntity<Map> res = restTemplate.postForEntity(endpoint, payload, Map.class);
        if (res.getStatusCode().is2xxSuccessful()) {
            return res.getBody().get("payUrl").toString();
        }
        throw new RuntimeException("MoMo API error: " + res);
    }

    /** Xử lý notify từ MoMo */
    @Transactional
    public Invoice handleMomoNotify(Map<String, String> momoParams) {
        String rawData = "accessKey=" + accessKey +
                "&amount=" + momoParams.get("amount") +
                "&extraData=" + momoParams.get("extraData") +
                "&message=" + momoParams.get("message") +
                "&orderId=" + momoParams.get("orderId") +
                "&orderInfo=" + momoParams.get("orderInfo") +
                "&orderType=" + momoParams.get("orderType") +
                "&partnerCode=" + momoParams.get("partnerCode") +
                "&payType=" + momoParams.get("payType") +
                "&requestId=" + momoParams.get("requestId") +
                "&responseTime=" + momoParams.get("responseTime") +
                "&resultCode=" + momoParams.get("resultCode") +
                "&transId=" + momoParams.get("transId");

        String expectedSig = HmacSHA256Util.sign(rawData, secretKey);
        if (!expectedSig.equals(momoParams.get("signature"))) {
            throw new RuntimeException("Invalid MoMo signature");
        }

        // Chỉ khi resultCode == 0 mới coi là thành công
        if (!"0".equals(momoParams.get("resultCode"))) {
            throw new RuntimeException("MoMo payment failed: " + momoParams.get("message"));
        }

        // Lấy invoiceId từ orderInfo hoặc extraData
        String orderInfo = momoParams.get("orderInfo");
        Integer invoiceId = Integer.valueOf(orderInfo.replace("Pay invoice ", ""));
        Invoice invoice = invoiceRepo.findById(Long.valueOf(invoiceId))
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        PaymentMethod momo = methodRepo.findByMethodNameIgnoreCase("MOMO")
                .orElseThrow(() -> new IllegalStateException("Payment method MOMO not found"));

        invoice.setPaymentMethodId(momo.getMethodId());
        invoice.setTransactionId(momoParams.get("transId"));
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(invoice);

        PaymentHistory his = new PaymentHistory();
        his.setInvoice(invoice);
        his.setAmount(invoice.getFinalAmount());
        his.setPaymentId(momo.getMethodId());
        his.setTransactionId(momoParams.get("transId"));
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
