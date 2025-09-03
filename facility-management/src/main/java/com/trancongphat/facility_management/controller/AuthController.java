package com.trancongphat.facility_management.controller;

import com.trancongphat.facility_management.dto.LoginRequest;
import com.trancongphat.facility_management.dto.LoginResponse;
import com.trancongphat.facility_management.dto.RegisterRequest;
import com.trancongphat.facility_management.entity.LecturerRequest;
import com.trancongphat.facility_management.entity.User;
import com.trancongphat.facility_management.service.JwtService;
import com.trancongphat.facility_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import com.trancongphat.facility_management.repository.UserRepository;


@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;




    @PostMapping("/register/student")
    public ResponseEntity<?> register(@ModelAttribute RegisterRequest req) {
        try {
            userService.registerStudent(req);
            return ResponseEntity.ok(Map.of("message", "Đăng ký thành công. Vui lòng kiểm tra email để xác thực."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register/lecturer")
    public ResponseEntity<?> registerLecturer(@RequestBody RegisterRequest request) {
        try {
            userService.registerLecturer(request);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Đăng ký giảng viên thành công. Vui lòng kiểm tra email để xác thực tài khoản!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Xác thực tài khoản
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Lấy thông tin user
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // 3. Kiểm tra xác thực email
            if (!user.isVerified()) {
                return ResponseEntity.badRequest().body("Tài khoản chưa xác thực email.");
            }

            // 4. Kiểm tra tài khoản bị khóa
            if (user.getStatus() == User.Status.locked) {
                return ResponseEntity.badRequest().body("Tài khoản đã bị khóa.");
            }

            // 5. Kiểm tra giảng viên chưa đổi mật khẩu trong 24h
            if (user.getRole() == User.Role.lecturer && user.getLastPasswordChange() == null) {
                LocalDateTime expiredTime = user.getCreatedAt().toLocalDateTime().plusHours(24);
                if (LocalDateTime.now().isAfter(expiredTime)) {
                    user.setStatus(User.Status.locked);
                    userRepository.save(user);
                    return ResponseEntity.badRequest().body("Tài khoản giảng viên đã bị khóa do chưa đổi mật khẩu trong 24 giờ.");
                }
            }
            // 6. Kiểm tra vai trò
            User.Role expectedRole;
            try {
                expectedRole = User.Role.valueOf(request.getRole());
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Vai trò không hợp lệ.");
            }

            if (user.getRole() != expectedRole) {
                return ResponseEntity.badRequest().body("Bạn không thuộc vai trò: " + request.getRole());
            }

            // 7. Trả về JWT token
            String token = jwtService.generateToken(user);
            LoginResponse response = new LoginResponse(user.getUserId(),token, user.getRole().name(), user.getFullName(), user.getAvatar());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("Sai email hoặc mật khẩu.");
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

