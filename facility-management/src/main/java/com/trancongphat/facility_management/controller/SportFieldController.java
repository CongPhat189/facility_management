package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.EquipmentRequestDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.dto.SportFieldRequestDTO;
import com.trancongphat.facility_management.dto.SportFieldResponseDTO;
import com.trancongphat.facility_management.entity.SportField;
import com.trancongphat.facility_management.mapper.SportFieldMapper;
import com.trancongphat.facility_management.service.SportFieldService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@PreAuthorize( "hasRole('ROLE_ADMIN')")
@RestController
@RequestMapping("/admin/sport_fields")
public class SportFieldController {
    @Autowired
    private SportFieldService sportFieldService;
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SportFieldResponseDTO> createEquipment(
            @Valid @ModelAttribute SportFieldRequestDTO dto) throws IOException {
        SportFieldResponseDTO response = sportFieldService.createSportField(dto);
        return ResponseEntity.ok(response);
    }
    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SportFieldResponseDTO> updateEquipment(
            @PathVariable Integer id,
            @Valid @ModelAttribute SportFieldRequestDTO dto) throws IOException {
        SportFieldResponseDTO updated = sportFieldService.updateSportField(id, dto);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSportField(@PathVariable Integer id) {
        sportFieldService.deleteSportField(id);
        return ResponseEntity.ok("Deleted sport field with id: " + id);
    }

    @GetMapping
    public ResponseEntity<List<SportFieldResponseDTO>> getAllSportFields() {
        List<SportFieldResponseDTO> list = sportFieldService.getAllSportFields();
        return ResponseEntity.ok(list);
    }


    @GetMapping("/{id}")
    public ResponseEntity<SportFieldResponseDTO> getSportFieldById(@PathVariable Integer id) {
        SportFieldResponseDTO response = sportFieldService.getSportFieldById(id);
        return ResponseEntity.ok(response);
    }

}
