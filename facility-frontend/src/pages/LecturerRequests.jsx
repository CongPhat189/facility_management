import React, { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { toast } from "react-toastify";

const LecturerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");

    const loadRequests = async () => {
        try {
            let res = await authAPIs().get(endpoints.getLecturerRequests);
            setRequests(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách yêu cầu giảng viên");
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleApprove = async (id) => {
        setLoading(true);
        try {
            await authAPIs().post(endpoints.approveLecturer(id));
            toast.success("Duyệt thành công");
            loadRequests();
        } catch (err) {
            toast.error("Duyệt thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!reason) {
            toast.warn("Vui lòng nhập lý do từ chối!");
            return;
        }
        setLoading(true);
        try {
            await authAPIs().post(`${endpoints.rejectLecturer(id)}?reason=${reason}`);
            toast.success("Đã từ chối yêu cầu");
            setReason("");
            loadRequests();
        } catch (err) {
            toast.error("Từ chối thất bại");
        } finally {
            setLoading(false);
        }
    };

    const renderStatus = (status) => {
        switch (status) {
            case "PENDING":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
                        <div className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></div>
                        Chờ duyệt
                    </span>
                );
            case "APPROVED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        Đã duyệt
                    </span>
                );
            case "REJECTED":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        Từ chối
                    </span>
                );
            default:
                return status;
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 flex items-center">
                    <span className="text-4xl mr-3">📧</span>
                    Yêu cầu cấp tài khoản giảng viên
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
                <p className="text-slate-600 mt-3 font-medium">Quản lý các yêu cầu cấp tài khoản giảng viên</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/40 shadow-xl bg-white/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-slate-100/80 to-slate-50/80 backdrop-blur-sm">

                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b border-white/40">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                                        <span>Tên</span>
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
                                        <span>Trạng thái</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 border-b border-white/40">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                                        <span>Hành động</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/20">
                            {requests.map((r, index) => (
                                <tr
                                    key={r.id}
                                    className={`hover:bg-gradient-to-r hover:from-white/30 hover:to-slate-50/30 transition-all duration-300 group ${index % 2 === 0 ? 'bg-white/20' : 'bg-slate-50/20'
                                        }`}
                                >

                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-800 group-hover:text-slate-900">{r.fullName}</div>
                                        <div className="text-xs text-slate-500 mt-1">Giảng viên</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-700 font-medium group-hover:text-slate-900">{r.email}</div>
                                        <div className="text-xs text-slate-500 mt-1">Email liên hệ</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {renderStatus(r.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {r.status === "PENDING" && (
                                            <div className="flex flex-col space-y-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => handleApprove(r.id)}
                                                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                                    >
                                                        <span className="mr-1">✓</span>
                                                        Duyệt
                                                    </button>
                                                    <button
                                                        disabled={loading}
                                                        onClick={() => handleReject(r.id)}
                                                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                                    >
                                                        <span className="mr-1">✕</span>
                                                        Từ chối
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    placeholder="Nhập lý do từ chối..."
                                                    className="w-full px-3 py-2 text-sm border border-white/40 rounded-xl bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-300 hover:bg-white/70"
                                                />
                                            </div>
                                        )}
                                        {r.status !== "PENDING" && (
                                            <div className="text-slate-500 text-sm font-medium">
                                                {r.status === "APPROVED" ? "✅ Đã xử lý" : "❌ Đã từ chối"}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {requests.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <div className="text-slate-600 text-lg font-medium">Không có yêu cầu nào</div>
                        <div className="text-slate-500 text-sm mt-2">Các yêu cầu tài khoản giảng viên sẽ hiển thị ở đây</div>
                    </div>
                )}
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-slate-700 font-medium">Đang xử lý...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LecturerRequests;