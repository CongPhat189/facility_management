package com.trancongphat.facility_management.dto;

import com.trancongphat.facility_management.entity.Booking;

import java.time.LocalDateTime;

public class BookingResponseDTO {
    private Long bookingId;
    private Integer userId;
    private Integer classroomId;
    private Integer fieldId;
    private Integer equipmentId;
    private Integer equipmentQuantity;
    private String purpose;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private boolean paymentRequired;

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(Integer classroomId) {
        this.classroomId = classroomId;
    }

    public Integer getFieldId() {
        return fieldId;
    }

    public void setFieldId(Integer fieldId) {
        this.fieldId = fieldId;
    }

    public Integer getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Integer equipmentId) {
        this.equipmentId = equipmentId;
    }

    public Integer getEquipmentQuantity() {
        return equipmentQuantity;
    }

    public void setEquipmentQuantity(Integer equipmentQuantity) {
        this.equipmentQuantity = equipmentQuantity;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
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
    public boolean isPaymentRequired() {
        return paymentRequired;
    }
    public void setPaymentRequired(boolean paymentRequired) {
        this.paymentRequired = paymentRequired;
    }
    public static BookingResponseDTO fromEntity(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(b.getBookingId());
        dto.setUserId(b.getUser() != null ? b.getUser().getUserId() : null);
        dto.setPurpose(b.getPurpose());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setStatus(b.getStatus() != null ? b.getStatus().name() : null);

        return dto;
    }


}
