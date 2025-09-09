package com.trancongphat.facility_management.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class RawReportDTO {
    private LocalDateTime from;
    private LocalDateTime to;
    private List<Map<String, Object>> bookingsByType;
    private List<Map<String, Object>> bookingsByStatus;
    private Double sportFieldRevenue;
    private List<Map<String, Object>> peakHours; // [{hour: 7, total: 12}, ...]

    public RawReportDTO() {}

    public RawReportDTO(LocalDateTime from, LocalDateTime to,
                        List<Map<String, Object>> bookingsByType,
                        List<Map<String, Object>> bookingsByStatus,
                        Double sportFieldRevenue,
                        List<Map<String, Object>> peakHours) {
        this.from = from;
        this.to = to;
        this.bookingsByType = bookingsByType;
        this.bookingsByStatus = bookingsByStatus;
        this.sportFieldRevenue = sportFieldRevenue;
        this.peakHours = peakHours;
    }

    // getters/setters
    public LocalDateTime getFrom() { return from; }
    public void setFrom(LocalDateTime from) { this.from = from; }
    public LocalDateTime getTo() { return to; }
    public void setTo(LocalDateTime to) { this.to = to; }
    public List<Map<String, Object>> getBookingsByType() { return bookingsByType; }
    public void setBookingsByType(List<Map<String, Object>> bookingsByType) { this.bookingsByType = bookingsByType; }
    public List<Map<String, Object>> getBookingsByStatus() { return bookingsByStatus; }
    public void setBookingsByStatus(List<Map<String, Object>> bookingsByStatus) { this.bookingsByStatus = bookingsByStatus; }
    public Double getSportFieldRevenue() { return sportFieldRevenue; }
    public void setSportFieldRevenue(Double sportFieldRevenue) { this.sportFieldRevenue = sportFieldRevenue; }
    public List<Map<String, Object>> getPeakHours() { return peakHours; }
    public void setPeakHours(List<Map<String, Object>> peakHours) { this.peakHours = peakHours; }
}
