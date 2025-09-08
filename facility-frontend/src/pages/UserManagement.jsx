import React, { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { toast } from "react-toastify";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        try {
            let res = await authAPIs().get(endpoints.getAllUsers);
            setUsers(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách người dùng");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleLockUnlock = async (id, action) => {
        setLoading(true);
        try {
            let url = action === "lock" ? endpoints.lockUser(id) : endpoints.unlockUser(id);
            await authAPIs().post(url);
            toast.success(action === "lock" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
            loadUsers();
        } catch (err) {
            toast.error("Thao tác thất bại");
        } finally {
            setLoading(false);
        }
    };

    const getRoleDisplay = (role) => {
        const roleConfig = {
            'admin': {
                text: 'Quản trị viên',
                gradient: 'from-purple-100 to-indigo-100',
                textColor: 'text-purple-800',
                border: 'border-purple-200',
                icon: '👑'
            },
            'lecturer': {
                text: 'Giảng viên',
                gradient: 'from-blue-100 to-cyan-100',
                textColor: 'text-blue-800',
                border: 'border-blue-200',
                icon: '👨‍🏫'
            },
            'student': {
                text: 'Sinh viên',
                gradient: 'from-green-100 to-emerald-100',
                textColor: 'text-green-800',
                border: 'border-green-200',
                icon: '🎓'
            }
        };

        const config = roleConfig[role?.toLowerCase()] || {
            text: role,
            gradient: 'from-gray-100 to-slate-100',
            textColor: 'text-gray-800',
            border: 'border-gray-200',
            icon: '👤'
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${config.gradient} ${config.textColor} border ${config.border}`}>
                <span className="mr-1">{config.icon}</span>
                {config.text}
            </span>
        );
    };

    const getStatusDisplay = (status) => {
        if (status === "active") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                    Hoạt động
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    Bị khóa
                </span>
            );
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 flex items-center">
                    <span className="text-4xl mr-3">👥</span>
                    Quản lý người dùng
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
                <p className="text-slate-600 mt-3 font-medium">Quản lý tài khoản và quyền hạn của người dùng trong hệ thống</p>
                <div className="mt-4 flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>Tổng: {users.length} người dùng</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span>Hoạt động: {users.filter(u => u.status === 'active').length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span>Bị khóa: {users.filter(u => u.status !== 'active').length}</span>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/40 shadow-xl bg-white/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 backdrop-blur-sm">
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b border-white/40">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                                        <span>Thông tin</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b border-white/40">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                        <span>Email</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b border-white/40">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                        <span>Vai trò</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b border-white/40">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                        <span>Trạng thái</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b border-white/40">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                        <span>Hành động</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {users.map((u, index) => (
                                <tr
                                    key={u.userId}
                                    className={`hover:bg-gradient-to-r hover:from-white/30 hover:to-slate-50/30 transition-all duration-300 group ${index % 2 === 0 ? 'bg-white/20' : 'bg-slate-50/20'
                                        }`}
                                >

                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">

                                            <div>
                                                <div className="font-semibold text-slate-800 group-hover:text-slate-900">{u.fullName}</div>
                                                <div className="text-xs text-slate-500 mt-1">Tên tài khoản</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-700 font-medium group-hover:text-slate-900">{u.email}</div>
                                        <div className="text-xs text-slate-500 mt-1">Email liên hệ</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleDisplay(u.role)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusDisplay(u.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.status === "active" ? (
                                            <button
                                                disabled={loading}
                                                onClick={() => handleLockUnlock(u.userId, "lock")}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="mr-1">🔒</span>
                                                Khóa
                                            </button>
                                        ) : (
                                            <button
                                                disabled={loading}
                                                onClick={() => handleLockUnlock(u.userId, "unlock")}
                                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span className="mr-1">🔓</span>
                                                Mở khóa
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-8xl mb-6">👥</div>
                        <div className="text-slate-600 text-xl font-semibold mb-2">Không có người dùng nào</div>
                        <div className="text-slate-500 text-sm">Danh sách người dùng sẽ hiển thị ở đây khi có dữ liệu</div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/50">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-slate-700 font-semibold text-lg">Đang xử lý...</span>
                            <div className="text-slate-500 text-sm">Vui lòng chờ trong giây lát</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;