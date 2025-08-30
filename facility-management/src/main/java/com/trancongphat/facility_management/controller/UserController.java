package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.ClassroomResponseDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.dto.SportFieldResponseDTO;
import com.trancongphat.facility_management.service.ClassroomService;
import com.trancongphat.facility_management.service.EquipmentService;
import com.trancongphat.facility_management.service.SportFieldService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private ClassroomService classroomService;

    @Autowired
    private SportFieldService sportFieldService;

    @Autowired
    private EquipmentService equipmentService;


    @GetMapping("/classrooms")
    @PreAuthorize("hasAnyRole('STUDENT','LECTURER')")
    public ResponseEntity<List<ClassroomResponseDTO>> getAllClassrooms() {
        return ResponseEntity.ok(classroomService.getAllClassrooms());
    }


    @GetMapping("/sport-fields")
    @PreAuthorize("hasAnyRole('STUDENT','LECTURER')")
    public ResponseEntity<List<SportFieldResponseDTO>> getAllSportFields() {
        return ResponseEntity.ok(sportFieldService.getAllSportFields());
    }


    @GetMapping("/equipments")
    @PreAuthorize("hasAnyRole('LECTURER')")
    public ResponseEntity<List<EquipmentResponseDTO>> getAllEquipments() {
        return ResponseEntity.ok(equipmentService.getAllEquipments());
    }




}
