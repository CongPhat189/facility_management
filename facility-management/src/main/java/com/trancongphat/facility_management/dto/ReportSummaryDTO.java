package com.trancongphat.facility_management.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ReportSummaryDTO {
    private LocalDateTime from;
    private LocalDateTime to;
    private List<Map<String, Object>> bookingsByType;
    private List<Map<String, Object>> bookingsByStatus;
    private Double sportFieldRevenue;
    private String analysis;

    // ==== Constructors ====
    public ReportSummaryDTO() {
    }

    public ReportSummaryDTO(LocalDateTime from, LocalDateTime to,
                            List<Map<String, Object>> bookingsByType,
                            List<Map<String, Object>> bookingsByStatus,
                            Double sportFieldRevenue,
                            String analysis) {
        this.from = from;
        this.to = to;
        this.bookingsByType = bookingsByType;
        this.bookingsByStatus = bookingsByStatus;
        this.sportFieldRevenue = sportFieldRevenue;
        this.analysis = analysis;
    }

    // ==== Getters & Setters ====
    public LocalDateTime getFrom() {
        return from;
    }

    public void setFrom(LocalDateTime from) {
        this.from = from;
    }

    public LocalDateTime getTo() {
        return to;
    }

    public void setTo(LocalDateTime to) {
        this.to = to;
    }

    public List<Map<String, Object>> getBookingsByType() {
        return bookingsByType;
    }

    public void setBookingsByType(List<Map<String, Object>> bookingsByType) {
        this.bookingsByType = bookingsByType;
    }

    public List<Map<String, Object>> getBookingsByStatus() {
        return bookingsByStatus;
    }

    public void setBookingsByStatus(List<Map<String, Object>> bookingsByStatus) {
        this.bookingsByStatus = bookingsByStatus;
    }

    public Double getSportFieldRevenue() {
        return sportFieldRevenue;
    }

    public void setSportFieldRevenue(Double sportFieldRevenue) {
        this.sportFieldRevenue = sportFieldRevenue;
    }

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    // ==== Builder Pattern thủ công ====
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private LocalDateTime from;
        private LocalDateTime to;
        private List<Map<String, Object>> bookingsByType;
        private List<Map<String, Object>> bookingsByStatus;
        private Double sportFieldRevenue;
        private String analysis;

        public Builder from(LocalDateTime from) {
            this.from = from;
            return this;
        }

        public Builder to(LocalDateTime to) {
            this.to = to;
            return this;
        }

        public Builder bookingsByType(List<Map<String, Object>> bookingsByType) {
            this.bookingsByType = bookingsByType;
            return this;
        }

        public Builder bookingsByStatus(List<Map<String, Object>> bookingsByStatus) {
            this.bookingsByStatus = bookingsByStatus;
            return this;
        }

        public Builder sportFieldRevenue(Double sportFieldRevenue) {
            this.sportFieldRevenue = sportFieldRevenue;
            return this;
        }

        public Builder analysis(String analysis) {
            this.analysis = analysis;
            return this;
        }

        public ReportSummaryDTO build() {
            return new ReportSummaryDTO(from, to, bookingsByType, bookingsByStatus, sportFieldRevenue, analysis);
        }
    }
}
