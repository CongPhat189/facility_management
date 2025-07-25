package com.trancongphat.facility_management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = "http://localhost:8080/api/auth/verify?token=" + token;

            // Load file HTML từ resource
            String template = new String(Files.readAllBytes(
                    Paths.get(new ClassPathResource("templates/verification_email.html").getURI())
            ));


            String content = template.replace("{{link}}", link);


            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Xác thực tài khoản của bạn");
            helper.setText(content, true);
            helper.setFrom("tcp18092004@gmail.com");

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi gửi email xác thực: " + e.getMessage());
        }
    }
    public void sendLecturerAccountInfo(String toEmail, String defaultPassword) {
        String subject = "Tài khoản giảng viên OU";
        String content = "Bạn vừa được cấp tài khoản giảng viên trên hệ thống OU.\n"
                + "Mật khẩu mặc định: " + defaultPassword + "\n"
                + "Vui lòng đăng nhập và đổi mật khẩu trong vòng 24 giờ để tránh bị khóa tài khoản.";

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject(subject);
        msg.setText(content);
        mailSender.send(msg);
    }

}
