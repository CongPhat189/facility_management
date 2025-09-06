package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.InvoiceResponseDTO;
import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentService {

    private final InvoiceRepository invoiceRepo;
    private final PaymentMethodRepository methodRepo;
    private final PaymentHistoryRepository historyRepo;
    private final RestTemplate rest = new RestTemplate();
    @Autowired
    private BookingRepository bookingRepository;

    private final String momoEndpoint;
    private final String momoPartnerCode;
    private final String momoAccessKey;
    private final String momoSecretKey;
    private final String momoReturnUrl;
    private final String momoNotifyUrl;
    private final String momoRequestType = "captureWallet";

    public PaymentService(InvoiceRepository invoiceRepo,
                          PaymentMethodRepository methodRepo,
                          PaymentHistoryRepository historyRepo,
                          org.springframework.core.env.Environment env) {
        this.invoiceRepo = invoiceRepo;
        this.methodRepo = methodRepo;
        this.historyRepo = historyRepo;
        this.momoEndpoint = env.getProperty("momo.endpoint");
        this.momoPartnerCode = env.getProperty("momo.partner-code");
        this.momoAccessKey = env.getProperty("momo.access-key");
        this.momoSecretKey = env.getProperty("momo.secret-key");
        this.momoReturnUrl = env.getProperty("momo.return-url");
        this.momoNotifyUrl = env.getProperty("momo.notify-url");
    }

    @Transactional
    public Invoice payCash(Integer invoiceId, String payerInfo) {
        Invoice inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (inv.getStatus() == Invoice.InvoiceStatus.PAID) return inv;

        PaymentMethod cash = methodRepo.findByMethodNameIgnoreCase("CASH")
                .orElseThrow(() -> new IllegalStateException("CASH method not found"));

        // ✅ update trực tiếp invoice
        invoiceRepo.updateInvoicePaid(invoiceId, cash.getMethodId(), "CASH-" + UUID.randomUUID(), LocalDateTime.now());

        // ✅ update booking
        inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (inv.getBooking() != null) {
            bookingRepository.approveBooking(inv.getBooking().getBookingId());
        }

        PaymentHistory his = new PaymentHistory();
        his.setInvoice(inv);
        his.setAmount(inv.getFinalAmount());
        his.setPaymentMethodId(cash.getMethodId());
        his.setPaymentDate(LocalDateTime.now());
        his.setPayerInfo(payerInfo);
        his.setStatus(PaymentHistory.PaymentStatus.SUCCESS);
        historyRepo.save(his);

        return inv;
    }

    // Create momo payment - return payUrl for frontend redirection
    public String initMomoPayment(Integer invoiceId) {
        Invoice inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        String requestId = UUID.randomUUID().toString();
        String orderId = "INV-" + invoiceId + "-" + System.currentTimeMillis();
        String amount = inv.getFinalAmount()
                .setScale(0, BigDecimal.ROUND_HALF_UP)
                .toPlainString(); // MoMo yêu cầu số nguyên
        String orderInfo = "Payment for invoice " + invoiceId;

        Map<String, String> params = new HashMap<>();
        params.put("partnerCode", momoPartnerCode);
        params.put("accessKey", momoAccessKey);
        params.put("requestId", requestId);
        params.put("amount", amount);
        params.put("orderId", orderId);
        params.put("orderInfo", orderInfo);
        params.put("redirectUrl", momoReturnUrl);
        params.put("ipnUrl", momoNotifyUrl);
        params.put("extraData", "");
        params.put("requestType", momoRequestType);

        // ✅ rawSignature MoMo yêu cầu đủ cả redirectUrl và ipnUrl
        String rawSignature = "accessKey=" + momoAccessKey +
                "&amount=" + amount +
                "&extraData=" + "" +
                "&ipnUrl=" + momoNotifyUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + momoPartnerCode +
                "&redirectUrl=" + momoReturnUrl +
                "&requestId=" + requestId +
                "&requestType=" + momoRequestType;

        String signature = hmacSHA256(rawSignature, momoSecretKey);
        params.put("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(params, headers);

        Map resp = rest.postForObject(momoEndpoint, request, Map.class);
        if (resp == null) throw new IllegalStateException("MoMo no response");

        Object payUrl = resp.get("payUrl");
        if (payUrl == null) throw new IllegalStateException("MoMo payUrl absent: " + resp);

        return payUrl.toString();
    }

    private String hmacSHA256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256"));
            byte[] rawHmac = mac.doFinal(data.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * rawHmac.length);
            for (byte b : rawHmac) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate HMAC SHA256", ex);
        }
    }

    @Transactional
    public Invoice confirmMomo(String invoiceIdStr, String momoTransId, String providerResponse) {
        Integer invoiceId = Integer.valueOf(invoiceIdStr);
        Invoice inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        PaymentMethod momo = methodRepo.findByMethodNameIgnoreCase("MOMO")
                .orElseThrow(() -> new IllegalStateException("MOMO method missing"));


        // ✅ update trực tiếp invoice
        invoiceRepo.updateInvoicePaid(invoiceId, momo.getMethodId(), momoTransId, LocalDateTime.now());

        // ✅ update booking
        inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (inv.getBooking() != null) {
            bookingRepository.approveBooking(inv.getBooking().getBookingId());
        }

        PaymentHistory his = new PaymentHistory();
        his.setInvoice(inv);
        his.setAmount(inv.getFinalAmount());
        his.setPaymentMethodId(momo.getMethodId());
        his.setTransactionId(momoTransId);
        his.setPaymentDate(LocalDateTime.now());
        his.setStatus(PaymentHistory.PaymentStatus.SUCCESS);
        historyRepo.save(his);

        return inv;
    }

    public InvoiceResponseDTO toDto(Invoice inv) {
        InvoiceResponseDTO dto = new InvoiceResponseDTO();
        dto.setInvoiceId(Math.toIntExact(inv.getInvoiceId()));
        dto.setBookingId(inv.getBooking() != null ? inv.getBooking().getBookingId() : null);
        dto.setUserId(inv.getUser() != null ? inv.getUser().getUserId() : null);
        dto.setTotalAmount(inv.getTotalAmount());
        dto.setDiscount(inv.getDiscount());
        dto.setFinalAmount(inv.getFinalAmount());
        dto.setStatus(inv.getStatus().name());
        dto.setIssuedAt(inv.getIssuedAt());
        dto.setPaidAt(inv.getPaidAt());
        dto.setTransactionId(inv.getTransactionId());
        return dto;
    }
}
