package com.trancongphat.facility_management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
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
}
