package com.trancongphat.facility_management.mapper;
import com.trancongphat.facility_management.dto.EquipmentRequestDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.entity.Equipment;



public class EquipmentMapper {
   public static Equipment toEntity(EquipmentRequestDTO dto) {
        Equipment equipment = new Equipment();
        equipment.setName(dto.getName());
        equipment.setEquipmentType(dto.getEquipmentType());
        equipment.setModel(dto.getModel());
        equipment.setSerialNumber(dto.getSerialNumber());
        equipment.setQuantity(dto.getQuantity());
        equipment.setStatus(dto.getStatus());
        equipment.setAddress(dto.getAddress());

        return equipment;
    }

    public static EquipmentResponseDTO toDto(Equipment equipment) {
        EquipmentResponseDTO dto = new EquipmentResponseDTO();
        dto.setId(equipment.getId());
        dto.setName(equipment.getName());
        dto.setEquipmentType(equipment.getEquipmentType());
        dto.setModel(equipment.getModel());
        dto.setSerialNumber(equipment.getSerialNumber());
        dto.setQuantity(equipment.getQuantity());
        dto.setStatus(equipment.getStatus());
        dto.setAddress(equipment.getAddress());
        dto.setImageUrl(equipment.getImageUrl());

        return dto;
    }



}
