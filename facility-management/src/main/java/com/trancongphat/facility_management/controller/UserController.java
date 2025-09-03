package com.trancongphat.facility_management.controller;

import com.sun.security.auth.UserPrincipal;
import com.trancongphat.facility_management.dto.ClassroomResponseDTO;
import com.trancongphat.facility_management.dto.EquipmentResponseDTO;
import com.trancongphat.facility_management.dto.SportFieldResponseDTO;
import com.trancongphat.facility_management.entity.User;
import com.trancongphat.facility_management.security.CustomUserDetails;
import com.trancongphat.facility_management.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @Autowired
    private JwtService JwtService;
    @Autowired
    private UserService userService;



    @GetMapping("/classrooms")

    public ResponseEntity<List<ClassroomResponseDTO>> getAllClassrooms() {
        return ResponseEntity.ok(classroomService.getAllClassrooms());
    }


    @GetMapping("/sport-fields")

    public ResponseEntity<List<SportFieldResponseDTO>> getAllSportFields() {
        return ResponseEntity.ok(sportFieldService.getAllSportFields());
    }


    @GetMapping("/equipments")

    public ResponseEntity<List<EquipmentResponseDTO>> getAllEquipments() {
        List<EquipmentResponseDTO> list = equipmentService.getAllEquipments();
        return ResponseEntity.ok(list);
    }
    @GetMapping("/current-user")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        if (customUserDetails == null) {
            return ResponseEntity.status(403).build();
        }

        User user = customUserDetails.getUser();
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }





}
