package com.trancongphat.facility_management.repository;


import com.trancongphat.facility_management.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    // Tìm kiếm theo ID
    Optional<Invoice> findByInvoiceId(Integer invoiceId);
    // TÌM THEO USER ID
    Optional<Invoice> findByUser_UserId(Integer userId);
    // tìm theo booking id
    Optional<Invoice> findByBooking_BookingId(Integer bookingId);
    @Modifying
    @Query("UPDATE Invoice i SET i.paymentMethodId = :methodId, i.transactionId = :transId, " +
            "i.status = 'PAID', i.paidAt = :paidAt WHERE i.invoiceId = :invoiceId")
    int updateInvoicePaid(@Param("invoiceId") Integer invoiceId,
                          @Param("methodId") Integer methodId,
                          @Param("transId") String transId,
                          @Param("paidAt") LocalDateTime paidAt);

    @Query("SELECT COALESCE(SUM(i.finalAmount), 0) FROM Invoice i " +
            "WHERE MONTH(i.paidAt) = :month AND YEAR(i.paidAt) = :year " +
            "AND i.status = com.trancongphat.facility_management.entity.Invoice.InvoiceStatus.PAID")
    Double getRevenueInMonth(@Param("month") int month, @Param("year") int year);
}
