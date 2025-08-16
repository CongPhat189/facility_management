package com.trancongphat.facility_management.dto;

import com.trancongphat.facility_management.entity.SportField;

import java.math.BigDecimal;

public class SportFieldResponseDTO {
    private Integer id;
    private String fieldName;
    private SportField.FieldType fieldType;
    private BigDecimal pricePerHour;
    private SportField.Status status;
    private String description;
    private String address;
    private String imageUrl;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
    public SportField.FieldType getFieldType() {
        return fieldType;
    }
    public void setFieldType(SportField.FieldType fieldType) {
        this.fieldType = fieldType;
    }


    public BigDecimal getPricePerHour() {
        return pricePerHour;
    }
    public void setPricePerHour(BigDecimal pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public SportField.Status getStatus() {
        return status;
    }
    public void setStatus(SportField.Status status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
