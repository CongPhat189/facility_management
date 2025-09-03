package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.EquipmentRequestDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.service.EquipmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/admin/equipments")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    // ✅ Tạo mới thiết bị
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EquipmentResponseDTO> createEquipment(
            @Valid @ModelAttribute EquipmentRequestDTO dto) throws IOException {
        EquipmentResponseDTO response = equipmentService.createEquipment(dto);
        return ResponseEntity.ok(response);
    }

    // ✅ Cập nhật thiết bị
    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EquipmentResponseDTO> updateEquipment(
            @PathVariable Integer id,
            @Valid @ModelAttribute EquipmentRequestDTO dto) throws IOException {
        EquipmentResponseDTO updated = equipmentService.updateEquipment(id, dto);
        return ResponseEntity.ok(updated);
    }

    // ✅ Xoá thiết bị
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEquipment(@PathVariable Integer id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok("Deleted equipment with id: " + id);
    }

    // ✅ Lấy tất cả thiết bị
    @GetMapping
    public ResponseEntity<List<EquipmentResponseDTO>> getAllEquipments() {
        List<EquipmentResponseDTO> list = equipmentService.getAllEquipments();
        return ResponseEntity.ok(list);
    }

    // ✅ Lấy chi tiết một thiết bị
    @GetMapping("/{id}")
    public ResponseEntity<EquipmentResponseDTO> getEquipmentById(@PathVariable Integer id) {
        EquipmentResponseDTO response = equipmentService.getEquipmentById(id);
        return ResponseEntity.ok(response);
    }
}
