package com.trancongphat.facility_management.dto;
import com.trancongphat.facility_management.entity.Equipment;
import org.springframework.web.multipart.MultipartFile;



public class EquipmentRequestDTO {
    private String name;
    private Equipment.EquipmentType equipmentType;
    private String model;
    private String serialNumber;
    private Equipment.Status status;
    private String purchaseDate;
    private String lastMaintenance;
    private String address;
    private MultipartFile imageUrl;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Equipment.EquipmentType getEquipmentType() {
        return equipmentType;
    }

    public void setEquipmentType(Equipment.EquipmentType equipmentType) {
        this.equipmentType = equipmentType;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public Equipment.Status getStatus() {
        return status;
    }

    public void setStatus(Equipment.Status status) {
        this.status = status;
    }

    public String getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(String purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getLastMaintenance() {
        return lastMaintenance;
    }

    public void setLastMaintenance(String lastMaintenance) {
        this.lastMaintenance = lastMaintenance;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public MultipartFile getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl( MultipartFile imageUrl) {
        this.imageUrl = imageUrl;
    }
}
