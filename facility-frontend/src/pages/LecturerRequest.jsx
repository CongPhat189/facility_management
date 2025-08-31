import React, { useState } from "react";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import APIs, { endpoints } from "../configs/APIs";
import { toast } from "react-toastify";

const LecturerRequest = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await APIs.post(endpoints.register_lecturer, formData);

            toast.success(
                "🎉 Yêu cầu đã được gửi! Vui lòng kiểm tra email để nhận thông tin tài khoản."
            );
            navigate("/login");
        } catch (error) {
            console.error("Gửi yêu cầu thất bại:", error);
            toast.error(
                error.response?.data?.error ||
                "❌ Gửi yêu cầu thất bại! Vui lòng thử lại."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-md">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Yêu cầu cấp tài khoản giảng viên
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {/* Họ và tên */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="fullName">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Nhập họ tên đầy đủ"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email Giảng Viên <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Nhập email liên hệ"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Thông báo */}
                        <div className="bg-yellow-100 p-4 rounded mb-6">
                            <p className="font-semibold">Lưu ý:</p>
                            <p className="text-sm">
                                Quản trị viên sẽ xem xét và gửi thông tin tài khoản đến email
                                của bạn.
                                <br />
                                Mật khẩu mặc định là <strong>ou@hcm</strong> và bạn phải đổi mật
                                khẩu trong vòng 24h.
                            </p>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                            >
                                Gửi yêu cầu
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LecturerRequest;
