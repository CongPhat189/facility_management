package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.RawReportDTO;
import com.trancongphat.facility_management.dto.ReportSummaryDTO;
import com.trancongphat.facility_management.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/report")
@CrossOrigin(origins = "*") // nếu bạn cần cho FE gọi trực tiếp
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Báo cáo theo tháng/năm.
     * Ví dụ gọi:
     *   GET /api/report/analysis?month=9&year=2025&mom=true
     */
    @GetMapping("/analysis")
    public ResponseEntity<ReportSummaryDTO> monthlyReport(
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam(name = "mom", defaultValue = "true") boolean includeMoM
    ) {
        // Validate cơ bản
        if (month < 1 || month > 12) {
            return ResponseEntity.badRequest().build();
        }
        if (year < 2000 || year > 2100) {
            return ResponseEntity.badRequest().build();
        }

        ReportSummaryDTO dto = reportService.monthlyReportWithAI(month, year, includeMoM);
        return ResponseEntity.ok(dto);
    }

    /**
     * Báo cáo theo khoảng ngày (ISO: yyyy-MM-dd).
     * Ví dụ gọi:
     *   GET /api/report/analysis-range?from=2025-09-01&to=2025-09-30
     */
    @GetMapping("/analysis-range")
    public ResponseEntity<ReportSummaryDTO> rangeReport(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        if (from == null || to == null || to.isBefore(from)) {
            return ResponseEntity.badRequest().build();
        }

        ReportSummaryDTO dto = reportService.rangeReportWithAI(from, to);
        return ResponseEntity.ok(dto);
    }
    // ====== RAW: theo tháng ======
    // GET /api/report/raw/monthly?month=9&year=2025
    @GetMapping("/raw/monthly")
    public ResponseEntity<RawReportDTO> rawMonthly(
            @RequestParam int month,
            @RequestParam int year
    ) {
        if (month < 1 || month > 12) return ResponseEntity.badRequest().build();
        if (year < 2000 || year > 2100) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(reportService.monthlyRaw(month, year));
    }

    // ====== RAW: theo khoảng ngày ======
    // GET /api/report/raw/range?from=2025-09-01&to=2025-09-30
    @GetMapping("/raw/range")
    public ResponseEntity<RawReportDTO> rawRange(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        if (from == null || to == null || to.isBefore(from)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reportService.rangeRaw(from, to));
    }

    // ====== RAW: endpoint riêng cho từng biểu đồ (tuỳ chọn) ======
    // để FE gọi nhẹ hơn nếu chỉ cần 1 metric.

    // /api/report/raw/bookings-by-type?from=2025-09-01&to=2025-09-30
    @GetMapping("/raw/bookings-by-type")
    public ResponseEntity<List<Map<String,Object>>> bookingsByType(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        var data = reportService.rangeRaw(from, to).getBookingsByType();
        return ResponseEntity.ok(data);
    }

    // /api/report/raw/bookings-by-status?from=...&to=...
    @GetMapping("/raw/bookings-by-status")
    public ResponseEntity<List<Map<String,Object>>> bookingsByStatus(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        var data = reportService.rangeRaw(from, to).getBookingsByStatus();
        return ResponseEntity.ok(data);
    }

    // /api/report/raw/revenue-sport-field?from=...&to=...
    @GetMapping("/raw/revenue-sport-field")
    public ResponseEntity<Map<String, Object>> revenueSportField(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        var revenue = reportService.rangeRaw(from, to).getSportFieldRevenue();
        return ResponseEntity.ok(Map.of("revenue", revenue));
    }

    // /api/report/raw/peak-hours?from=...&to=...
    @GetMapping("/raw/peak-hours")
    public ResponseEntity<List<Map<String,Object>>> peakHours(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        var data = reportService.rangeRaw(from, to).getPeakHours();
        return ResponseEntity.ok(data);
    }
}
