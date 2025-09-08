package com.trancongphat.facility_management.dto;


import com.trancongphat.facility_management.entity.Classroom;

public class ClassroomResponseDTO {
    private Integer id;
    private String roomNumber;
    private String building;
    private String address;
    private Integer capacity;
    private String description;
    private Classroom.Status status;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Classroom.Status getStatus() {
        return status;
    }
    public void setStatus(Classroom.Status status) {
        this.status = status;
    }


}

