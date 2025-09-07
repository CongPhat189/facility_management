package com.trancongphat.facility_management.dto;

import com.trancongphat.facility_management.entity.Booking;

import java.math.BigInteger;
import java.time.LocalDateTime;

public class BookingResponseDTO {
    private Integer bookingId;
    private String resourceType;
    private Integer resourceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String purpose;


    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public Integer getResourceId() {
        return resourceId;
    }

    public void setResourceId(Integer resourceId) {
        this.resourceId = resourceId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
    public static BookingResponseDTO fromEntity(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setResourceType(booking.getResourceType().name());
        dto.setResourceId(booking.getResourceId());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setStatus(booking.getStatus().name());
        dto.setPurpose(booking.getPurpose());
        return dto;
    }

}
