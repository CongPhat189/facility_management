# 📚 Hệ thống Quản lý Cơ sở Vật chất Trường Học

## 📝 Giới thiệu
Đây là hệ thống quản lý cơ sở vật chất dành cho trường học, giúp sinh viên và giảng viên:
- Đặt phòng học, sân thể thao, mượn thiết bị.
- Quản lý các yêu cầu mượn/trả tài nguyên.
- Tích hợp thanh toán MoMo cho đặt sân.
- Gửi email thông báo tự động qua Gmail API.
- Tích hợp AI phân tích báo cáo qua Gemini API

Ứng dụng được xây dựng theo kiến trúc **Monolithic** (Spring Boot + ReactJS) và kết nối với cơ sở dữ liệu **MySQL**.  

---

## 🚀 Công nghệ sử dụng
### Backend
- **Spring Boot** (Java)
- **Spring Security + JWT**: xác thực & phân quyền (Sinh viên, Giảng viên, Quản trị viên).
- **Spring Data JPA (Hibernate)**: thao tác cơ sở dữ liệu.
- **MySQL**: hệ quản trị cơ sở dữ liệu.
- **Gmail API**: gửi email xác nhận tài khoản & thông báo.
- **MoMo Payment API**: thanh toán điện tử khi đặt sân thể thao.
- **Gemini AI API **: phân tích tổng hợp dữ liệu báo cáo

### Frontend
- **ReactJS** (SPA)
- **TailwindCSS + shadcn/ui**: thiết kế giao diện hiện đại.
- **Axios**: giao tiếp REST API với backend.
- **React Router DOM**: điều hướng client-side.

---

## 🏛️ Kiến trúc hệ thống
Hệ thống theo mô hình **Monolithic 3-tiers**:

1. **Frontend (ReactJS)**  
   - Giao diện đặt phòng/sân/thiết bị.
   - Quản lý dashboard của sinh viên, giảng viên, quản trị viên.
   - Tích hợp chatbot AI.  

2. **Backend (Spring Boot)**  
   - Xử lý nghiệp vụ (booking, quản lý tài nguyên, phê duyệt).
   - Gửi email, tạo hóa đơn, tích hợp MoMo API.  

3. **Database (MySQL)**  
   - Lưu trữ người dùng, phòng học, sân thể thao, thiết bị, booking, invoice, payment, request


