package com.trancongphat.facility_management.entity;

import jakarta.persistence.*;
import lombok.*;



@Entity
@Table(name = "resource_bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Booking liên kết
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // Phòng học (nếu là đặt phòng)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id")
    private Classroom classroom;

    // Sân thể thao (nếu là đặt sân)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_field_id")
    private SportField sportField;

    // Thiết bị (nếu là mượn thiết bị)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;
}
