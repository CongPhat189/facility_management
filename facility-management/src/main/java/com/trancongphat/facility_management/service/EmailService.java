package com.trancongphat.facility_management.service;

import com.trancongphat.facility_management.entity.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = "http://localhost:8080/api/auth/verify?token=" + token;


            String template = new String(Files.readAllBytes(
                    Paths.get(new ClassPathResource("templates/verification_email.html").getURI())
            ));


            String content = template.replace("{{link}}", link);


            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Xác thực tài khoản trên hệ thống Quản Lý Cở Sở Vật Chất OU của bạn");
            helper.setText(content, true);
            helper.setFrom("tcp18092004@gmail.com");

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi gửi email xác thực: " + e.getMessage());
        }
    }

    public void sendLecturerAccountInfo(String toEmail, String defaultPassword) {
        try {

            ClassPathResource resource = new ClassPathResource("templates/lecturer_account_email.html");
            String content = new String(Files.readAllBytes(resource.getFile().toPath()), StandardCharsets.UTF_8);


            content = content.replace("{{email}}", toEmail)
                    .replace("{{password}}", defaultPassword);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🎓 Tài khoản giảng viên OU trên hệ thống Quản Lý Cơ Sở Vật Chất OU đã được cấp");
            helper.setText(content, true);
            helper.setFrom("tcp18092004@gmail.com");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage());
        }

    }
    public void sendBookingApprovedEmail(String toEmail, Booking booking) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("Đặt lịch đã được duyệt");
        msg.setText("Xin chào, \n\nLịch đặt của bạn đã được phê duyệt.\n" +
                "Chi tiết: " + booking.toString() + "\n\nTrân trọng!");
        mailSender.send(msg);
    }

    public void sendBookingRejectedEmail(String toEmail, Booking booking, String reason) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(toEmail);
        msg.setSubject("Đặt lịch đã bị từ chối");
        msg.setText("Xin chào, \n\nLịch đặt của bạn đã bị từ chối.\n" +
                "Lý do: " + reason + "\n\nTrân trọng!");
        mailSender.send(msg);
    }
}
