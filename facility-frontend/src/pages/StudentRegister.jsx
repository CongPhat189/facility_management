import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import APIs, { endpoints } from '../configs/APIs';
import { toast } from "react-toastify";

const StudentRegister = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        studentId: '',
        email: '',
        avatar: null,
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'avatar') {
            setFormData({ ...formData, avatar: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("❌ Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append("fullName", formData.fullName);
            submitData.append("studentId", formData.studentId);
            submitData.append("email", formData.email);
            submitData.append("password", formData.password);

            if (formData.avatar) {
                submitData.append("avatar", formData.avatar);
            }

            submitData.append("role", "student");

            const res = await APIs.post(endpoints.register_student, submitData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success(res.data?.message || "🎉 Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
            navigate("/login");
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
            toast.error(error.response?.data?.error || "❌ Đăng ký thất bại! Vui lòng thử lại.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-md">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Đăng ký tài khoản sinh viên
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

                        {/* MSSV */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="studentId">
                                Mã số sinh viên <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="studentId"
                                name="studentId"
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Nhập mã số sinh viên"
                                value={formData.studentId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email OU <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full px-3 py-2 border rounded"
                                placeholder="example@ou.edu.vn"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Avatar */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="avatar">
                                Avatar
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                className="w-full px-3 py-2 border rounded"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="password">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                                Xác nhận mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className="w-full px-3 py-2 border rounded"
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default StudentRegister;
