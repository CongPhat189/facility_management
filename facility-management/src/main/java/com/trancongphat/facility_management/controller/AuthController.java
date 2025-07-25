package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.RegisterRequest;
import com.trancongphat.facility_management.entity.LecturerRequest;
import com.trancongphat.facility_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    private LecturerRequest lecturerRequest;

    @PostMapping("/register/student")
    public ResponseEntity<?> register(@ModelAttribute RegisterRequest req) {
        try {
            userService.registerStudent(req);
            return ResponseEntity.ok("Đăng ký thành công. Vui lòng kiểm tra email để xác thực.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/register/lecturer")
    public ResponseEntity<?> registerLecturer(@RequestBody RegisterRequest request) {
        try {
            userService.registerLecturer(request);
            return ResponseEntity.ok("Đăng ký giảng viên thành công. Vui lòng kiểm tra email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token) {
        try {
            userService.verifyEmail(token);
            return ResponseEntity.ok("Xác thực tài khoản thành công.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
