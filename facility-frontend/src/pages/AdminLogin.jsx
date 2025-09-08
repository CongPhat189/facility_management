import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import APIs, { endpoints } from '../configs/APIs';
import Input from '../components/ui/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await APIs.post(endpoints.login, {
                email,
                password,
                role: 'admin',
            });

            const token = res.data.token;
            const userData = {
                name: res.data.fullName,
                role: res.data.role,
                avatar: res.data.avatar,
            };

            login(userData, token);
            toast.success('Đăng nhập quản trị thành công 🎉');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Đăng nhập admin thất bại:', err);
            toast.error('❌ Sai email hoặc mật khẩu quản trị!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-200 flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
                        🔑 Đăng nhập Quản trị
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                        Vui lòng nhập thông tin tài khoản quản trị viên
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@ou.edu.vn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="password">
                                Mật khẩu <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Nhập mật khẩu quản trị"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                        >
                            Đăng nhập
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminLogin;
