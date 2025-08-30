package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.entity.*;
import com.trancongphat.facility_management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class InvoiceService {

    private final SportFieldRepository sportFieldRepo;
    private final PromotionRepository promotionRepo;
    private final InvoiceRepository invoiceRepo;
    private final InvoiceDetailRepository detailRepo;

    public InvoiceService(SportFieldRepository sportFieldRepo,
                          PromotionRepository promotionRepo,
                          InvoiceRepository invoiceRepo,
                          InvoiceDetailRepository detailRepo) {
        this.sportFieldRepo = sportFieldRepo;
        this.promotionRepo = promotionRepo;
        this.invoiceRepo = invoiceRepo;
        this.detailRepo = detailRepo;
    }

    @Transactional
    public Invoice createInvoiceForFieldBooking(Booking booking, Integer promotionId) {
        // find field info by resourceId
        SportField field = sportFieldRepo.findById(booking.getResourceId())
                .orElseThrow(() -> new IllegalArgumentException("Field not found"));

        long minutes = Duration.between(booking.getStartTime(), booking.getEndTime()).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        BigDecimal base = field.getPricePerHour().multiply(hours);

        BigDecimal discount = BigDecimal.ZERO;
        if (promotionId != null) {
            Promotion promo = promotionRepo.findById(Math.toIntExact(promotionId))
                    .orElseThrow(() -> new IllegalArgumentException("Promotion not found"));
            if (promo.getIsActive()) {
                if ("PERCENT".equalsIgnoreCase(String.valueOf(promo.getDiscountType()))) {
                    discount = base.multiply(promo.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else {
                    discount = promo.getDiscountValue();
                }
            }
        }

        BigDecimal finalAmount = base.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) finalAmount = BigDecimal.ZERO;

        Invoice inv = new Invoice();
        inv.setBooking(booking);
        inv.setUser(booking.getUser());
        inv.setTotalAmount(base);
        inv.setDiscount(discount);
        inv.setFinalAmount(finalAmount);
        inv.setStatus(Invoice.InvoiceStatus.PENDING);
        inv.setIssuedAt(LocalDateTime.now());

        inv = invoiceRepo.save(inv);

        InvoiceDetail detail = new InvoiceDetail();
        detail.setInvoice(inv);
        detail.setItemName("Thuê sân: " + field.getFieldName());
        detail.setQuantity(1);
        detail.setUnitPrice(field.getPricePerHour());
        detail.setDurationHours(hours);
        detail.setSubtotal(base);
        detailRepo.save(detail);

        return inv;
    }
}
