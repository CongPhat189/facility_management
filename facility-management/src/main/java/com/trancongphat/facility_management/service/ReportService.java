package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.RawReportDTO;
import com.trancongphat.facility_management.repository.BookingRepository;
import com.trancongphat.facility_management.repository.InvoiceRepository;
import com.trancongphat.facility_management.dto.ReportSummaryDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final BookingRepository bookingRepository;
    private final InvoiceRepository invoiceRepository;
    private final ReportAnalysisService reportAnalysisService; // gọi Gemini

    public ReportService(BookingRepository bookingRepository,
                         InvoiceRepository invoiceRepository,
                         ReportAnalysisService reportAnalysisService) {
        this.bookingRepository = bookingRepository;
        this.invoiceRepository = invoiceRepository;
        this.reportAnalysisService = reportAnalysisService;
    }

    /**
     * Tạo báo cáo theo tháng/năm:
     * - Số lượt đặt theo loại tài nguyên (classroom/sport_field/equipment)
     * - Số lượt theo trạng thái (PENDING/APPROVED/REJECTED/CANCELLED/…)
     * - Doanh thu chỉ từ sân thể thao (đã PAID)
     * - (Optional) So sánh tháng trước
     * - Gọi AI để viết bản tóm tắt phân tích
     */
    public ReportSummaryDTO monthlyReportWithAI(int month, int year, boolean includeMoM) {
        // range thời gian: [from, to]
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime from = ym.atDay(1).atStartOfDay();
        LocalDateTime to = ym.atEndOfMonth().atTime(23, 59, 59);

        // --- SỐ LIỆU THÁNG HIỆN TẠI ---
        List<Map<String, Object>> bookingsByType =
                bookingRepository.countByResourceType(from, to);

        List<Map<String, Object>> bookingsByStatus =
                bookingRepository.countByStatus(from, to);

        Double revenueSportFields =
                invoiceRepository.sumRevenueSportFields(from, to);

        // Ghép vào reportData (JSON) cho AI
        Map<String, Object> reportData = new HashMap<>();
        reportData.put("period", Map.of(
                "from", from.toString(),
                "to", to.toString(),
                "label", "%04d-%02d".formatted(year, month)
        ));
        reportData.put("bookingsByType", bookingsByType);
        reportData.put("bookingsByStatus", bookingsByStatus);
        reportData.put("sportFieldRevenue", revenueSportFields);

        // --- (Optional) So sánh tháng trước (MoM) ---
        if (includeMoM) {
            YearMonth prevYm = ym.minusMonths(1);
            LocalDateTime pFrom = prevYm.atDay(1).atStartOfDay();
            LocalDateTime pTo = prevYm.atEndOfMonth().atTime(23, 59, 59);

            List<Map<String, Object>> prevBookingsByType =
                    bookingRepository.countByResourceType(pFrom, pTo);

            Double prevRevenueSportFields =
                    invoiceRepository.sumRevenueSportFields(pFrom, pTo);

            reportData.put("previousMonth", Map.of(
                    "label", "%04d-%02d".formatted(prevYm.getYear(), prevYm.getMonthValue()),
                    "bookingsByType", prevBookingsByType,
                    "sportFieldRevenue", prevRevenueSportFields
            ));
        }

        // --- GỌI AI PHÂN TÍCH ---
        String analysis = reportAnalysisService.analyzeReport(reportData);

        // Trả DTO cho Controller/FE
        return ReportSummaryDTO.builder()
                .from(from)
                .to(to)
                .bookingsByType(bookingsByType)
                .bookingsByStatus(bookingsByStatus)
                .sportFieldRevenue(revenueSportFields)
                .analysis(analysis)
                .build();
    }

    /**
     * Báo cáo tùy biến theo khoảng ngày (dành cho filter từ UI).
     * Không có MoM, chỉ số liệu + AI.
     */
    public ReportSummaryDTO rangeReportWithAI(LocalDate startDate, LocalDate endDate) {
        LocalDateTime from = startDate.atStartOfDay();
        LocalDateTime to = endDate.atTime(23, 59, 59);

        List<Map<String, Object>> bookingsByType =
                bookingRepository.countByResourceType(from, to);

        List<Map<String, Object>> bookingsByStatus =
                bookingRepository.countByStatus(from, to);

        Double revenueSportFields =
                invoiceRepository.sumRevenueSportFields(from, to);

        Map<String, Object> reportData = new HashMap<>();
        reportData.put("period", Map.of(
                "from", from.toString(),
                "to", to.toString(),
                "label", startDate + " → " + endDate
        ));
        reportData.put("bookingsByType", bookingsByType);
        reportData.put("bookingsByStatus", bookingsByStatus);
        reportData.put("sportFieldRevenue", revenueSportFields);

        String analysis = reportAnalysisService.analyzeReport(reportData);

        return ReportSummaryDTO.builder()
                .from(from)
                .to(to)
                .bookingsByType(bookingsByType)
                .bookingsByStatus(bookingsByStatus)
                .sportFieldRevenue(revenueSportFields)
                .analysis(analysis)
                .build();
    }
    // Trong ReportService

    public RawReportDTO monthlyRaw(int month, int year) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime from = ym.atDay(1).atStartOfDay();
        LocalDateTime to = ym.atEndOfMonth().atTime(23, 59, 59);

        var bookingsByType = bookingRepository.countByResourceType(from, to);
        var bookingsByStatus = bookingRepository.countByStatus(from, to);
        var revenueSportFields = invoiceRepository.sumRevenueSportFields(from, to);
        var peakHours = bookingRepository.countByStartHour(from, to);

        return new RawReportDTO(from, to, bookingsByType, bookingsByStatus, revenueSportFields, peakHours);
    }

    public RawReportDTO rangeRaw(LocalDate startDate, LocalDate endDate) {
        LocalDateTime from = startDate.atStartOfDay();
        LocalDateTime to = endDate.atTime(23, 59, 59);

        var bookingsByType = bookingRepository.countByResourceType(from, to);
        var bookingsByStatus = bookingRepository.countByStatus(from, to);
        var revenueSportFields = invoiceRepository.sumRevenueSportFields(from, to);
        var peakHours = bookingRepository.countByStartHour(from, to);

        return new RawReportDTO(from, to, bookingsByType, bookingsByStatus, revenueSportFields, peakHours);
    }

}
