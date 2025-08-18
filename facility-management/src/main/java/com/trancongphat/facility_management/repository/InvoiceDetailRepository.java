package com.trancongphat.facility_management.repository;

import com.trancongphat.facility_management.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, Integer> {
    List<InvoiceDetail> findByInvoiceInvoiceId(Integer invoiceId);
}
