package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.LecturerAccountRequest;
import com.trancongphat.facility_management.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin")
public class AdminController {

    @Autowired private AdminService adminService;

    @PutMapping("/lecturer-requests/{id}/approve")
    public ResponseEntity<?> approveLecturer(@PathVariable Long id) {
        adminService.approveLecturerRequest(id);
        return ResponseEntity.ok("Đã cấp tài khoản giảng viên thành công.");
    }

}
