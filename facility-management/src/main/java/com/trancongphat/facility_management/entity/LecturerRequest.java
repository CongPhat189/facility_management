package com.trancongphat.facility_management.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "lecturer_requests")
public class LecturerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String email;

    @Enumerated(EnumType.STRING)
    private Status status;

    private Timestamp createdAt;

    // Khóa ngoại đến bảng users
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

