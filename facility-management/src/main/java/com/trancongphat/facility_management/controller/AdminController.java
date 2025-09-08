package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.LecturerAccountRequest;
import com.trancongphat.facility_management.entity.LecturerRequest;
import com.trancongphat.facility_management.entity.User;
import com.trancongphat.facility_management.repository.LecturerRequestRepository;
import com.trancongphat.facility_management.repository.UserRepository;
import com.trancongphat.facility_management.service.AdminService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private LecturerRequestRepository lecturerRequestRepo;
    @Autowired private UserRepository userRepo;


    // ================== USER MANAGEMENT ==================
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @PostMapping("/users/{id}/lock")
    public ResponseEntity<?> lockUser(@PathVariable Integer id) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        u.setStatus( User.Status.locked);
        userRepo.save(u);
        return ResponseEntity.ok("User locked");
    }

    @PostMapping("/users/{id}/unlock")
    public ResponseEntity<?> unlockUser(@PathVariable Integer id) {
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        u.setStatus( User.Status.active);
        userRepo.save(u);
        return ResponseEntity.ok("User unlocked");
    }

    // ================== LECTURER REQUEST MANAGEMENT ==================
    @GetMapping("/lecturer-requests")
    public List<LecturerRequest> getLecturerRequests() {
        return lecturerRequestRepo.findAll();
    }
    @PostMapping("/lecturer-requests/{id}/approve")
    public ResponseEntity<?> approveLecturer(@PathVariable Long id) {
        adminService.approveLecturerRequest(id);
        return ResponseEntity.ok("Đã cấp tài khoản giảng viên thành công.");
    }
    @PostMapping("/lecturer-requests/{id}/reject")
    public ResponseEntity<?> rejectLecturerRequest(@PathVariable Long id,
                                                   @RequestParam String reason) throws MessagingException {
        adminService.rejectLecturerRequest(id, reason);
        return ResponseEntity.ok("Yêu câu đã bị từ chối.");
    }


}
