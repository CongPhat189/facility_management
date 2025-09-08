package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.repository.BookingRepository;
import com.trancongphat.facility_management.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {
    @Autowired BookingRepository bookingRepo;
    @Autowired InvoiceRepository invoiceRepo;

    public Map<String, Object> getMonthlyReport(int month, int year) {
        Long bookingCount = bookingRepo.countBookingsInMonth(month, year);
        Double revenue = invoiceRepo.getRevenueInMonth(month, year);

        Map<String, Object> report = new HashMap<>();
        report.put("month", month);
        report.put("year", year);
        report.put("totalBookings", bookingCount);
        report.put("totalRevenue", revenue);

        return report;
    }
}
