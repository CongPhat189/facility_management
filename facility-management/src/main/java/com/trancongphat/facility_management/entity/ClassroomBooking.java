package com.trancongphat.facility_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "classroom_bookings")
public class ClassroomBooking {
    @Id
    @Column(name = "booking_id")
    private Integer bookingId; //

    @OneToOne
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "classroom_id")
    private Integer classroomId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    private Classroom classroom;

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

    public Integer getClassroomId() {
        return classroomId;
    }

    public void setClassroomId(Integer classroomId) {
        this.classroomId = classroomId;
    }
    public Classroom getClassroom() {
        return classroom;
    }
    public void setClassroom(Classroom classroom) {
        this.classroom = classroom;
    }
}
