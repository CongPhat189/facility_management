import React, { useEffect, useState } from "react";
import { Calendar, BookOpen, Goal, Laptop, LogOut, Clock, Users, ChevronRight, Bell } from "lucide-react";
import { authAPIs, endpoints } from "../configs/APIs";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [classrooms, setClassrooms] = useState([]);
    const [sportFields, setSportFields] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let requests = [
                    authAPIs().get(endpoints.classrooms),
                    authAPIs().get(endpoints.sport_fields),
                    authAPIs().get(endpoints.bookings(user?.id)),
                ];

                if (user?.role === "lecturer") {
                    requests.push(authAPIs().get(endpoints.equipments));
                }

                let responses = await Promise.all(requests);

                setClassrooms(responses[0].data || []);
                setSportFields(responses[1].data || []);
                setBookings(responses[2].data || []);

                if (user?.role === "lecturer" && responses[3]) {
                    setEquipments(responses[3].data || []);
                }
            } catch (err) {
                console.error("Lỗi khi load dashboard:", err);
            }
        };
        fetchData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const availableClassrooms = classrooms.filter(c => c.status === "available").length;
    const availableSportFields = sportFields.filter(s => s.status === "available").length;
    const availableEquipments = equipments.filter(e => e.status === "available").length;

    const formatDateTime = (start, end) => {
        try {
            const startDate = new Date(start);
            const endDate = new Date(end);
            return {
                date: startDate.toLocaleDateString("vi-VN"),
                time:
                    startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) +
                    " - " +
                    endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            };
        } catch {
            return { date: "-", time: "-" };
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "PENDING": return "Chờ duyệt";
            case "APPROVED": return "Đã duyệt";
            case "REJECTED": return "Từ chối";
            case "CANCELLED": return "Đã hủy";
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "APPROVED": return "text-emerald-600 bg-emerald-50 border-emerald-200";
            case "PENDING": return "text-amber-600 bg-amber-50 border-amber-200";
            case "REJECTED": return "text-rose-600 bg-rose-50 border-rose-200";
            case "CANCELLED": return "text-slate-500 bg-slate-50 border-slate-200";
            default: return "text-slate-600 bg-slate-50 border-slate-200";
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(bookings.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentBookings = bookings.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                            <img src="/ou.svg" alt="logo" className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 text-lg">
                                Quản lý cơ sở vật chất OU
                            </h1>
                            <p className="text-xs text-slate-500">Hệ thống thông minh</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 bg-white/50 px-3 py-2 rounded-lg">
                            <Clock className="w-4 h-4" />
                            <span>
                                {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}{" "}
                                {new Date().toLocaleDateString("vi-VN")}
                            </span>
                        </div>

                        <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
                            <Bell className="w-5 h-5 text-slate-500" />
                        </button>

                        <div className="flex items-center space-x-3 bg-white/50 rounded-full pl-1 pr-4 py-1">
                            <img
                                src={user?.avatar || "https://i.pravatar.cc/40"}
                                alt="avatar"
                                className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm"
                            />
                            <div className="hidden md:block">
                                <div className="text-sm font-semibold text-slate-800">{user?.name}</div>
                                <div className="text-xs text-slate-500">
                                    {user?.role === "lecturer" ? "Giảng viên" : "Sinh viên"}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 text-sm text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all duration-200 hover:shadow-sm"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span className="hidden md:inline">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2/3 */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold mb-2">
                                    Xin chào, {user?.name || "Người dùng"}! 👋
                                </h2>
                                <p className="text-blue-100 text-lg">
                                    Chào mừng bạn đến với hệ thống quản lý cơ sở vật chất OU
                                </p>
                                <div className="flex items-center mt-4 space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-5 h-5 text-blue-200" />
                                        <span className="text-blue-100">{bookings.length} đặt lịch</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-blue-200" />
                                        <span className="text-blue-100">Tháng này</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:block">
                                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                                    <Calendar className="w-16 h-16 text-white/50" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                            Thao tác nhanh
                            <ChevronRight className="w-6 h-6 ml-2 text-slate-400" />
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                                        <BookOpen className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-800">{availableClassrooms}</div>
                                        <div className="text-xs text-slate-500">Phòng có sẵn</div>
                                    </div>
                                </div>
                                <h4 className="font-bold text-xl text-slate-800 mb-2">Mượn phòng học</h4>
                                <p className="text-slate-600 mb-4">
                                    Đặt lịch sử dụng phòng học một cách nhanh chóng và tiện lợi
                                </p>
                                <button
                                    onClick={() => navigate("/classroom-booking")}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                                >
                                    Bắt đầu đặt lịch
                                </button>
                            </div>

                            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                                        <Goal className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-800">{availableSportFields}</div>
                                        <div className="text-xs text-slate-500">Sân hoạt động</div>
                                    </div>
                                </div>
                                <h4 className="font-bold text-xl text-slate-800 mb-2">Thuê sân thể thao</h4>
                                <p className="text-slate-600 mb-4">
                                    Đặt sân thể thao cho các hoạt động vận động và giải trí
                                </p>
                                <button onClick={() => navigate("/sportfield-booking")} className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                                    Bắt đầu đặt lịch
                                </button>
                            </div>

                            {user?.role === "lecturer" && (
                                <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-200 md:col-span-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                                            <Laptop className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-slate-800">{availableEquipments}</div>
                                            <div className="text-xs text-slate-500">Thiết bị sẵn sàng</div>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-xl text-slate-800 mb-2">Mượn thiết bị</h4>
                                    <p className="text-slate-600 mb-4">
                                        Đặt mượn các thiết bị giảng dạy và hỗ trợ học tập
                                    </p>
                                    <button
                                        onClick={() => navigate("/equipment-booking")}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        Bắt đầu đặt lịch
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent bookings with pagination */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                            <h4 className="font-bold text-xl text-slate-800">Đặt lịch gần đây</h4>
                            <p className="text-slate-600 text-sm">Quản lý và theo dõi các đơn đặt lịch của bạn</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Dịch vụ</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Ngày</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Thời gian</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Trạng thái</th>
                                        <th className="text-left py-4 px-6 font-semibold text-slate-700">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentBookings.map((b, i) => {
                                        const { date, time } = formatDateTime(b.startTime, b.endTime);

                                        let serviceName = "";
                                        let serviceType = "";
                                        let serviceIcon = null;

                                        if (b.resourceType === "CLASSROOM") {
                                            const classroom = classrooms.find(c => c.id === b.resourceId);
                                            serviceName = classroom ? classroom.roomNumber : "Phòng học";
                                            serviceType = "Phòng học";
                                            serviceIcon = <BookOpen className="w-4 h-4 text-blue-500" />;
                                        } else if (b.resourceType === "SPORT_FIELD") {
                                            const field = sportFields.find(s => s.id === b.resourceId);
                                            serviceName = field ? field.name : "Sân thể thao";
                                            serviceType = "Sân bóng";
                                            serviceIcon = <Goal className="w-4 h-4 text-emerald-500" />;
                                        } else if (b.resourceType === "EQUIPMENT") {
                                            const eq = equipments.find(e => e.id === b.resourceId);
                                            serviceName = eq ? eq.name : "Thiết bị";
                                            serviceType = "Thiết bị";
                                            serviceIcon = <Laptop className="w-4 h-4 text-purple-500" />;
                                        }

                                        return (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-slate-100 rounded-lg">
                                                            {serviceIcon}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-800">{serviceName}</div>
                                                            <div className="text-slate-500 text-sm">{serviceType}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-700 font-medium">{date}</td>
                                                <td className="py-4 px-6 text-slate-700 font-medium">{time}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(b.status)}`}>
                                                        {getStatusText(b.status)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline">
                                                        Xem chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                            <div className="flex justify-center items-center space-x-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === 1
                                        ? "text-slate-400 bg-slate-200 cursor-not-allowed"
                                        : "text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 shadow-sm"
                                        }`}
                                >
                                    Trước
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === i + 1
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 shadow-sm"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === totalPages
                                        ? "text-slate-400 bg-slate-200 cursor-not-allowed"
                                        : "text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 shadow-sm"
                                        }`}
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right 1/3 */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                            <h4 className="font-bold text-lg">Lịch trình sắp tới</h4>
                            <p className="text-indigo-100 text-sm">Các cuộc hẹn và đặt lịch</p>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {bookings.slice(0, 5).map((b, i) => {
                                    const { date, time } = formatDateTime(b.startTime, b.endTime);

                                    let serviceName = "";
                                    let serviceIcon = null;
                                    let bgColor = "";

                                    if (b.resourceType === "CLASSROOM") {
                                        const classroom = classrooms.find(c => c.id === b.resourceId);
                                        serviceName = classroom ? classroom.roomNumber : "Phòng học";
                                        serviceIcon = <BookOpen className="w-4 h-4 text-blue-600" />;
                                        bgColor = "bg-blue-50 border-blue-100";
                                    } else if (b.resourceType === "SPORT_FIELD") {
                                        const field = sportFields.find(f => f.id === b.resourceId);
                                        serviceName = field ? field.name : "Sân thể thao";
                                        serviceIcon = <Goal className="w-4 h-4 text-emerald-600" />;
                                        bgColor = "bg-emerald-50 border-emerald-100";
                                    } else if (b.resourceType === "EQUIPMENT") {
                                        const eq = equipments.find(e => e.id === b.resourceId);
                                        serviceName = eq ? eq.name : "Thiết bị";
                                        serviceIcon = <Laptop className="w-4 h-4 text-purple-600" />;
                                        bgColor = "bg-purple-50 border-purple-100";
                                    }

                                    return (
                                        <div key={i} className={`p-4 rounded-xl border-2 ${bgColor} hover:shadow-md transition-all cursor-pointer`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    {serviceIcon}
                                                    <div className="font-bold text-slate-800">{serviceName}</div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(b.status)}`}>
                                                    {getStatusText(b.status)}
                                                </span>
                                            </div>
                                            <div className="text-slate-600 text-sm mb-2 italic">{b.purpose}</div>
                                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{time}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {bookings.length === 0 && (
                                    <div className="text-center py-8 text-slate-400">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p>Chưa có lịch trình nào</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
                        <h4 className="font-bold text-lg mb-4">Thống kê nhanh</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-orange-100">Tổng đặt lịch</span>
                                <span className="font-bold text-2xl">{bookings.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-orange-100">Đã duyệt</span>
                                <span className="font-bold text-xl">
                                    {bookings.filter(b => b.status === "APPROVED").length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-orange-100">Chờ duyệt</span>
                                <span className="font-bold text-xl">
                                    {bookings.filter(b => b.status === "PENDING").length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;