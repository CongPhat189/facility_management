package com.trancongphat.facility_management.mapper;

import com.trancongphat.facility_management.dto.ClassroomRequestDTO;
import com.trancongphat.facility_management.dto.ClassroomResponseDTO;
import com.trancongphat.facility_management.entity.Classroom;

public class ClassroomMapper {
    public static Classroom toEntity(ClassroomRequestDTO dto) {
        Classroom c = new Classroom();
        c.setRoomNumber(dto.getRoomNumber());
        c.setBuilding(dto.getBuilding());
        c.setAddress(dto.getAddress());
        c.setCapacity(dto.getCapacity());
        c.setDescription(dto.getDescription());
        c.setStatus(dto.getStatus());

        return c;
    }

    public static ClassroomResponseDTO toDto(Classroom c) {
        ClassroomResponseDTO dto = new ClassroomResponseDTO();
        dto.setId(c.getClassroomId());
        dto.setRoomNumber(c.getRoomNumber());
        dto.setBuilding(c.getBuilding());
        dto.setAddress(c.getAddress());
        dto.setCapacity(c.getCapacity());
        dto.setDescription(c.getDescription());
        dto.setStatus(c.getStatus());
        dto.setImageUrl(c.getImageUrl());
        return dto;
    }
}

