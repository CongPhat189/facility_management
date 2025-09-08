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
    //Xác thực tài khoản
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
    //Duyệt/Từ chối yêu cầu giảng viên
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


    public void sendLecturerRequestRejectedEmail(String toEmail, String reason) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Yêu cầu giảng viên bị từ chối - OU");

        String htmlContent = """
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <title>Yêu cầu giảng viên bị từ chối</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://www.senviet.art/wp-content/uploads/edd/2021/12/dai-hoc-mo-tphcm.jpg" alt="Logo OU" style="max-width: 120px;" />
            </div>
            <h2 style="color: #c0392b; text-align: center;">❌ Yêu cầu giảng viên đã bị từ chối</h2>
            <p>Xin chào,</p>
            <p>Chúng tôi rất tiếc thông báo rằng yêu cầu cấp tài khoản giảng viên của bạn trên hệ thống 
                <strong>Quản lý Cơ sở Vật chất OU</strong> <span style="color: #e74c3c; font-weight: bold;">không được chấp nhận</span>.
            </p>
            <div style="background-color: #fce4e4; border: 1px solid #e0b4b4; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #c0392b;">
                    <strong>Lý do từ chối:</strong><br/> %s
                </p>
            </div>
            <p>Nếu có thắc mắc, vui lòng liên hệ với <strong>Phòng Quản trị Hệ thống OU</strong> để được hỗ trợ thêm.</p>
            <p style="margin-top: 30px;">Trân trọng,<br/>Ban quản trị hệ thống OU</p>
        </div>
        </body>
        </html>
        """.formatted(reason);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    //Duyệt/Từ chối yêu cầu đặt lịch
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
