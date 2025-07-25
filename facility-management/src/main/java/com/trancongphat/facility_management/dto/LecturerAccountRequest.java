package com.trancongphat.facility_management.dto;

import lombok.Data;

@Data
public class LecturerAccountRequest {
    private String fullName;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    private String email;
}
