package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.ClassroomRequestDTO;
import com.trancongphat.facility_management.dto.ClassroomResponseDTO;

import com.trancongphat.facility_management.service.ClassroomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/admin/classrooms")
public class ClassroomController {

    @Autowired
    private ClassroomService classroomService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClassroomResponseDTO> createClassroom(
            @Valid @RequestBody ClassroomRequestDTO dto) throws IOException {
        ClassroomResponseDTO response = classroomService.createClassroom(dto);
        return ResponseEntity.ok(response);
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClassroomResponseDTO> updateClassroom(
            @PathVariable Integer id,
            @Valid @RequestBody ClassroomRequestDTO dto) throws IOException {
        ClassroomResponseDTO updated = classroomService.updateClassroom(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClassroom(@PathVariable Integer id) {
        classroomService.deleteClassroom(id);
        return ResponseEntity.ok("Deleted classroom with id: " + id);
    }


    @GetMapping
    public ResponseEntity<List<ClassroomResponseDTO>> getAllClassrooms() {
        List<ClassroomResponseDTO> list = classroomService.getAllClassrooms();
        return ResponseEntity.ok(list);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ClassroomResponseDTO> getClassroomById(@PathVariable Integer id) {
        ClassroomResponseDTO response = classroomService.getClassroomById(id);
        return ResponseEntity.ok(response);
    }
}


