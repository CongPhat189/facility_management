package com.trancongphat.facility_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = "http://localhost:8080/api/auth/verify?token=" + token;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("Xác thực tài khoản OU");
        msg.setText("Vui lòng xác thực tài khoản bằng cách nhấn vào link: \n" + link);

        mailSender.send(msg);
    }
}

