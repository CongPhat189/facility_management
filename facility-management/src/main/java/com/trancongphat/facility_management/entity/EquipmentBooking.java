package com.trancongphat.facility_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment_bookings")
public class EquipmentBooking {
    @Id
    @Column(name = "booking_id")
    private Integer bookingId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "equipment_id")
    private Integer equipmentId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(name = "quantity")
    private Integer quantity = 1;

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

    public Integer getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Integer equipmentId) {
        this.equipmentId = equipmentId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }
}
