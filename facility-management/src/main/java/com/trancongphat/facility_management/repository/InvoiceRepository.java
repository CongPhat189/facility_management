package com.trancongphat.facility_management.repository;


import com.trancongphat.facility_management.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    // Tìm kiếm theo ID
    Optional<Invoice> findById(Integer id);
    // Custom query nếu cần
}
