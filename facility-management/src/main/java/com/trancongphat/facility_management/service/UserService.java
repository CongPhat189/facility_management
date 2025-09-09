package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.RegisterRequest;
import com.trancongphat.facility_management.entity.LecturerRequest;
import com.trancongphat.facility_management.entity.User;
import com.trancongphat.facility_management.repository.UserRepository;
import com.trancongphat.facility_management.repository.LecturerRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private LecturerRequestRepository lecturerRequestRepository;
    @Autowired private CloudinaryService cloudinaryService;
    @Autowired private EmailService emailService;

    public void registerStudent(RegisterRequest req) throws Exception {
        if (!req.getEmail().endsWith("@ou.edu.vn")) {
            throw new IllegalArgumentException("Email phải là @ou.edu.vn");
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        // Upload avatar lên Cloudinary
        String avatarUrl = cloudinaryService.uploadImage(req.getAvatar());

        // Tạo token xác thực
        String token = UUID.randomUUID().toString();

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(req.getPassword()));
        user.setFullName(req.getFullName());
        user.setStudentId(req.getStudentId());
        user.setAvatar(avatarUrl);
        user.setRole(User.Role.student);
        user.setVerified(false);
        user.setStatus(User.Status.inactive);
        user.setVerificationToken(token);
        user.setTokenExpiresAt(Timestamp.valueOf(LocalDateTime.now().plusHours(24)));
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }
    // Đăng ký GIẢNG VIÊN – Lưu yêu cầu vào bảng lecturer_requests
    public void registerLecturer(RegisterRequest req) {
        if (!req.getEmail().endsWith("@ou.edu.vn")) {
            throw new IllegalArgumentException("Email phải là @ou.edu.vn");
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        if (lecturerRequestRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email đã đăng ký yêu cầu giảng viên rồi.");
        }

        LecturerRequest lecturerRequest = new LecturerRequest();
        lecturerRequest.setEmail(req.getEmail());
        lecturerRequest.setFullName(req.getFullName());
        lecturerRequest.setStatus(LecturerRequest.Status.PENDING);
        lecturerRequest.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        lecturerRequestRepository.save(lecturerRequest);
    }
//    public void createAdmin(RegisterRequest req) {
//        if (userRepository.existsByEmail("admin@ou.edu.vn")) {
//            throw new IllegalArgumentException("Tài khoản admin đã tồn tại.");
//        }
//        User admin = new User();
//        admin.setEmail("admin@ou.edu.vn");
//        admin.setFullName("Quản trị viên hệ thống OU");
//        admin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
//        admin.setRole(User.Role.admin);
//        admin.setVerified(true);
//        admin.setStatus(User.Status.active);
//        admin.setCreatedAt(new Timestamp(System.currentTimeMillis()));
//        userRepository.save(admin);
//    }

    public void verifyEmail(String token) {
        User user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ."));

        user.setVerified(true);
        user.setStatus(User.Status.active);
        user.setVerificationToken(null);
        user.setTokenExpiresAt(null);
        userRepository.save(user);
    }
    // current user
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}

