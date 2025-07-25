package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.dto.LecturerAccountRequest;
import com.trancongphat.facility_management.entity.LecturerRequest;
import com.trancongphat.facility_management.entity.User;
import com.trancongphat.facility_management.repository.LecturerRequestRepository;
import com.trancongphat.facility_management.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;
    @Autowired private LecturerRequestRepository lecturerRequestRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Transactional
    public void approveLecturerRequest(Long requestId) {
        LecturerRequest req = lecturerRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã tồn tại.");
        }


        String defaultPassword = "ou@hcm";
        String encodedPassword = passwordEncoder.encode(defaultPassword);
        String token = UUID.randomUUID().toString();

        User user = new User();
        user.setEmail(req.getEmail());
        user.setFullName(req.getFullName());
        user.setPassword(encodedPassword);
        user.setRole(User.Role.lecturer);
        user.setVerified(true);
        user.setStatus(User.Status.active);
        user.setMustChangePassword(true);
        user.setTokenExpiresAt(Timestamp.valueOf(LocalDateTime.now().plusHours(24)));
        user.setVerificationToken(token);
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        userRepository.save(user);

        // Gán user vừa tạo cho bảng lecturer_requests
        req.setUser(user);
        req.setStatus(LecturerRequest.Status.APPROVED);
        lecturerRequestRepository.save(req);

        // Gửi email tài khoản
        emailService.sendLecturerAccountInfo(req.getEmail(), defaultPassword);
    }


}

