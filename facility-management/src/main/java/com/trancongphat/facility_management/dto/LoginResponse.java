package com.trancongphat.facility_management.dto;

public class LoginResponse {
    private  Integer id;
    private String token;
    private String role;
    private String fullName;
    private String avatar;

    public LoginResponse(Integer id, String token, String role, String fullName, String avatar) {
        this.id = id;
        this.token = token;
        this.role = role;
        this.fullName = fullName;
        this.avatar = avatar;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }


}
