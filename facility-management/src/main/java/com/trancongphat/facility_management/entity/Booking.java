package com.trancongphat.facility_management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BookingStatus status;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "approved_by")
    private Integer approvedBy; // admin user id

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;


    @Column(name = "payment_required")
    private Boolean paymentRequired = false;
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private ClassroomBooking classroomBooking;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private EquipmentBooking equipmentBooking;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private FieldBooking fieldBooking;

    public ClassroomBooking getClassroomBooking() {
        return classroomBooking;
    }

    public void setClassroomBooking(ClassroomBooking classroomBooking) {
        this.classroomBooking = classroomBooking;
    }

    public EquipmentBooking getEquipmentBooking() {
        return equipmentBooking;
    }

    public void setEquipmentBooking(EquipmentBooking equipmentBooking) {
        this.equipmentBooking = equipmentBooking;
    }

    public FieldBooking getFieldBooking() {
        return fieldBooking;
    }

    public void setFieldBooking(FieldBooking fieldBooking) {
        this.fieldBooking = fieldBooking;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(Integer approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Boolean getPaymentRequired() {
        return paymentRequired;
    }

    public void setPaymentRequired(Boolean paymentRequired) {
        this.paymentRequired = paymentRequired;
    }
    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, COMPLETED, CANCELED
    }

}

