package com.trancongphat.facility_management.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_methods")
public class PaymentMethod {
    @Column(name = "method_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer methodId;

    @Column(name = "method_name")
    private String methodName; // "CASH", "MOMO"
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    @Column(name = "is_active" )
    private Boolean isActive = true; // default is active
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Integer getMethodId() {
        return methodId;
    }

    public void setMethodId(Integer methodId) {
        this.methodId = methodId;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
