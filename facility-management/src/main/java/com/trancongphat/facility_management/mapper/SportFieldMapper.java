package com.trancongphat.facility_management.mapper;

import com.trancongphat.facility_management.dto.SportFieldRequestDTO;
import com.trancongphat.facility_management.dto.SportFieldResponseDTO;
import com.trancongphat.facility_management.entity.SportField;

public class SportFieldMapper {
    public static SportField toEntity(SportFieldRequestDTO dto){
        SportField sf = new SportField();
        sf.setFieldName(dto.getFieldName());
        sf.setFieldType(dto.getFieldType());
        sf.setPricePerHour(dto.getPricePerHour());
        sf.setStatus(dto.getStatus());
        sf.setDescription(dto.getDescription());
        sf.setAddress(dto.getAddress());

        return sf;
    }
    public static SportFieldResponseDTO toDto(SportField sf){
        SportFieldResponseDTO dto = new SportFieldResponseDTO();
        dto.setId(sf.getId());
        dto.setFieldName(sf.getFieldName());
        dto.setFieldType(sf.getFieldType());
        dto.setPricePerHour(sf.getPricePerHour());
        dto.setStatus(sf.getStatus());
        dto.setDescription(sf.getDescription());
        dto.setAddress(sf.getAddress());
        dto.setImageUrl(sf.getImageUrl());
        return dto;
    }
}
