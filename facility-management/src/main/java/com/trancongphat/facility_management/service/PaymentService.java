package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.InvoiceResponseDTO;
import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.repository.*;
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

    // MoMo config (in application.yml)
    private final String momoEndpoint;
    private final String momoPartnerCode;
    private final String momoAccessKey;
    private final String momoSecretKey;
    private final String momoReturnUrl;
    private final String momoNotifyUrl;

    public PaymentService(InvoiceRepository invoiceRepo,
                          PaymentMethodRepository methodRepo,
                          PaymentHistoryRepository historyRepo,
                          org.springframework.core.env.Environment env) {
        this.invoiceRepo = invoiceRepo;
        this.methodRepo = methodRepo;
        this.historyRepo = historyRepo;
        this.momoEndpoint = env.getProperty("momo.endpoint");
        this.momoPartnerCode = env.getProperty("momo.partnerCode");
        this.momoAccessKey = env.getProperty("momo.accessKey");
        this.momoSecretKey = env.getProperty("momo.secretKey");
        this.momoReturnUrl = env.getProperty("momo.returnUrl");
        this.momoNotifyUrl = env.getProperty("momo.notifyUrl");
    }

    @Transactional
    public Invoice payCash(Integer invoiceId, String payerInfo) {
        Invoice inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (inv.getStatus() == Invoice.InvoiceStatus.PAID) return inv;

        PaymentMethod cash = methodRepo.findByMethodNameIgnoreCase("CASH")
                .orElseThrow(() -> new IllegalStateException("CASH method not found"));

        inv.setPaymentMethodId(cash.getMethodId());
        inv.setStatus(Invoice.InvoiceStatus.PAID);
        inv.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(inv);

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
        String amount = inv.getFinalAmount().setScale(0, BigDecimal.ROUND_HALF_UP).toPlainString(); // momo often requires integer
        String orderInfo = "Payment for invoice " + invoiceId;

        Map<String, String> params = new HashMap<>();
        params.put("partnerCode", momoPartnerCode);
        params.put("accessKey", momoAccessKey);
        params.put("requestId", requestId);
        params.put("amount", amount);
        params.put("orderId", orderId);
        params.put("orderInfo", orderInfo);
        params.put("returnUrl", momoReturnUrl);
        params.put("notifyUrl", momoNotifyUrl);
        params.put("extraData", "");
        params.put("requestType", "captureWallet");

        // create signature: rawString = "accessKey=...&amount=...&..."
        String rawSignature = "accessKey=" + momoAccessKey +
                "&amount=" + amount +
                "&extraData=" + "" +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + momoPartnerCode +
                "&requestId=" + requestId +
                "&requestType=captureWallet";

        String signature = hmacSHA256(rawSignature, momoSecretKey);
        params.put("signature", signature);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(params, headers);

        Map resp = rest.postForObject(momoEndpoint, request, Map.class);
        if (resp == null) throw new IllegalStateException("MoMo no response");

        // MoMo response contains payUrl or payUrl
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
        Integer invoiceId = Math.toIntExact(Long.valueOf(invoiceIdStr));
        Invoice inv = invoiceRepo.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        PaymentMethod momo = methodRepo.findByMethodNameIgnoreCase("MOMO")
                .orElseThrow(() -> new IllegalStateException("MOMO method missing"));

        inv.setPaymentMethodId(momo.getMethodId());
        inv.setTransactionId(momoTransId);
        inv.setStatus(Invoice.InvoiceStatus.PAID);
        inv.setPaidAt(LocalDateTime.now());
        invoiceRepo.save(inv);

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
