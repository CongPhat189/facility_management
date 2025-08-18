package com.trancongphat.facility_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "field_bookings")
public class FieldBooking {
    @Id
    @Column(name = "booking_id")
    private Integer bookingId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "field_id")
    private Integer fieldId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "field_id", nullable = false)
    private SportField field;

    @Column(name = "payment_required")
    private Boolean paymentRequired = false;

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public Integer getFieldId() {
        return fieldId;
    }

    public void setFieldId(Integer fieldId) {
        this.fieldId = fieldId;
    }

    public Boolean getPaymentRequired() {
        return paymentRequired;
    }

    public void setPaymentRequired(Boolean paymentRequired) {
        this.paymentRequired = paymentRequired;
    }

    public SportField getField() {
        return field;
    }

    public void setField(SportField field) {
        this.field = field;
    }
}
