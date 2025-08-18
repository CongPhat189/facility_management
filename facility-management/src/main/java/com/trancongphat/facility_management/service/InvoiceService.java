package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.entity.*;

import com.trancongphat.facility_management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.List;

@Service
public class InvoiceService {

    private final SportFieldRepository sportFieldRepo;
    private final PromotionRepository promotionRepo;
    private final InvoiceRepository invoiceRepository;
    private final SportFieldBookingRepository fieldBookingRepo;
    private final InvoiceDetailRepository invoiceDetailRepo;

    public InvoiceService(SportFieldRepository sportFieldRepo,
                          PromotionRepository promotionRepo,
                          InvoiceRepository invoiceRepository,
                          SportFieldBookingRepository fieldBookingRepo,
                          InvoiceDetailRepository invoiceDetailRepo) {
        this.sportFieldRepo = sportFieldRepo;
        this.promotionRepo = promotionRepo;
        this.invoiceRepository = invoiceRepository;
        this.fieldBookingRepo = fieldBookingRepo;
        this.invoiceDetailRepo = invoiceDetailRepo;
    }

    @Transactional
    public Invoice createInvoiceForFieldBooking(Booking booking, Integer promotionId) {
        // Lấy FieldBooking từ bookingId
        FieldBooking fieldBooking = fieldBookingRepo.findByBookingBookingId(booking.getBookingId())
                .orElseThrow(() -> new RuntimeException("Field booking not found"));

        SportField field = sportFieldRepo.findById(fieldBooking.getFieldId())
                .orElseThrow(() -> new RuntimeException("Field not found"));

        // Tính số giờ thuê
        long minutes = Duration.between(booking.getStartTime(), booking.getEndTime()).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        // Giá gốc
        BigDecimal base = field.getPricePerHour().multiply(hours);

        // Tính khuyến mãi
        BigDecimal discount = BigDecimal.ZERO;
        if (promotionId != null) {
            Promotion promo = promotionRepo.findById(promotionId)
                    .orElseThrow(() -> new RuntimeException("Promotion not found"));
            if (promo.getIsActive()) {
                if ("percent".equalsIgnoreCase(String.valueOf(promo.getDiscountType()))) {
                    discount = base.multiply(promo.getDiscountValue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else {
                    discount = promo.getDiscountValue();
                }
            }
        }

        BigDecimal finalAmount = base.subtract(discount);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        // Lưu invoice
        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setUser(booking.getUser());
        invoice.setTotalAmount(base);
        invoice.setDiscount(discount);
        invoice.setFinalAmount(finalAmount);
        invoice.setStatus(Invoice.InvoiceStatus.PENDING);

        invoice = invoiceRepository.save(invoice);

        // Tạo chi tiết invoice (sân + thời lượng)
        InvoiceDetail detail = new InvoiceDetail();
        detail.setInvoice(invoice);
        detail.setItemType(InvoiceDetail.InvoiceItemType.FIELD);
        detail.setItemId(field.getId());
        detail.setItemName(field.getFieldName());
        detail.setQuantity(1);
        detail.setUnitPrice(field.getPricePerHour());
        detail.setDurationHours(hours);
        detail.setSubtotal(base);
        invoiceDetailRepo.save(detail);

        return invoice;
    }
    public List<InvoiceDetail> getDetails(Integer invoiceId) {
        return invoiceDetailRepo.findByInvoiceInvoiceId(invoiceId);
    }
}
