import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import APIs, { endpoints } from '../configs/APIs';
import Input from '../components/ui/Input';
import Button from '../components/common/Button';

const Login = () => {
    const [userType, setUserType] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth(); // lấy hàm login từ context

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // gọi API login tới backend
            const res = await APIs.post(endpoints.login, {
                email,
                password,
                role: userType.toUpperCase(), // tuỳ backend bạn nhận 'STUDENT'/'LECTURER'
            });

            // backend trả về token + userData
            const token = res.data.token;
            const userData = res.data.user;

            // gọi hàm login của context để lưu token + user
            login(userData, token);

            navigate('/');
        } catch (err) {
            console.error('Đăng nhập thất bại:', err);
            alert("Sai email hoặc mật khẩu!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-md">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6 text-center">
                        Hệ thống quản lý cơ sở vật chất OU
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Đăng nhập để sử dụng dịch vụ
                    </p>

                    {/* Chọn loại user */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${userType === 'student'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setUserType('student')}
                        >
                            Sinh viên
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${userType === 'lecturer'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setUserType('lecturer')}
                        >
                            Giảng viên
                        </button>
                    </div>

                    {/* Form login */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={
                                    userType === 'student'
                                        ? 'example@ou.edu.vn'
                                        : 'Email giảng viên'
                                }
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="password">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mb-4"
                        >
                            Đăng nhập
                        </Button>

                        {userType === 'student' ? (
                            <Link
                                to="/register-student"
                                className="block text-center text-blue-600 hover:underline"
                            >
                                👤 Đăng ký tài khoản sinh viên
                            </Link>
                        ) : (
                            <Link
                                to="/request-lecturer"
                                className="block text-center text-blue-600 hover:underline"
                            >
                                📧 Yêu cầu cấp tài khoản giảng viên
                            </Link>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
