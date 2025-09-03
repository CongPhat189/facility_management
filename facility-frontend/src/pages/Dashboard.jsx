import React, { useEffect, useState } from "react";
import { Calendar, BookOpen, Goal, Laptop, LogOut } from "lucide-react";
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
            case "APPROVED": return "text-green-600";
            case "PENDING": return "text-yellow-600";
            case "REJECTED": return "text-red-600";
            case "CANCELLED": return "text-gray-500";
            default: return "text-gray-600";
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(bookings.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentBookings = bookings.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-2">
                        <img src="/ou.svg" alt="logo" className="h-8" />
                        <h1 className="font-semibold text-gray-800">
                            Quản lý cơ sở vật chất OU
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {new Date().toLocaleTimeString("vi-VN")}{" "}
                            {new Date().toLocaleDateString("vi-VN")}
                        </span>
                        <button>
                            <Calendar className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <img
                                src={user?.avatar || "https://i.pravatar.cc/40"}
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm font-medium">
                                {user?.name} ({user?.role === "lecturer" ? "Giảng viên" : "Sinh viên"})
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-1" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Xin chào, {user?.name || "Người dùng"}!
                        </h2>
                        <p className="text-gray-600">
                            Chào mừng bạn đến với hệ thống quản lý cơ sở vật chất OU
                        </p>
                    </div>

                    {/* Quick actions */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="p-6 bg-white border rounded-lg shadow-sm flex flex-col items-center">
                            <BookOpen className="w-10 h-10 text-blue-500 mb-2" />
                            <h4 className="font-semibold text-lg">Mượn phòng học</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                {availableClassrooms} phòng có sẵn
                            </p>
                            <button onClick={() => navigate("/classroom-booking")} className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                                Bắt đầu
                            </button>
                        </div>
                        <div className="p-6 bg-white border rounded-lg shadow-sm flex flex-col items-center">
                            <Goal className="w-10 h-10 text-green-500 mb-2" />
                            <h4 className="font-semibold text-lg">Thuê sân thể thao</h4>
                            <p className="text-sm text-gray-500 mb-4">
                                {availableSportFields} sân hoạt động
                            </p>
                            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                                Bắt đầu
                            </button>
                        </div>
                        {user?.role === "lecturer" && (
                            <div className="p-6 bg-white border rounded-lg shadow-sm flex flex-col items-center">
                                <Laptop className="w-10 h-10 text-purple-500 mb-2" />
                                <h4 className="font-semibold text-lg">Mượn thiết bị</h4>
                                <p className="text-sm text-gray-500 mb-4">
                                    {availableEquipments} thiết bị sẵn sàng
                                </p>
                                <button onClick={() => navigate("/equipment-booking")} className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                                    Bắt đầu
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Recent bookings with pagination */}
                    <div className="bg-white border rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold">Đặt lịch gần đây</h4>
                        </div>
                        <table className="w-full text-sm">
                            <thead className="text-gray-600 border-b">
                                <tr>
                                    <th className="text-left py-2">Dịch vụ</th>
                                    <th className="text-left py-2">Ngày</th>
                                    <th className="text-left py-2">Thời gian</th>
                                    <th className="text-left py-2">Trạng thái</th>
                                    <th className="text-left py-2">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBookings.map((b, i) => {
                                    const { date, time } = formatDateTime(b.startTime, b.endTime);

                                    let serviceName = "";
                                    let serviceType = "";

                                    if (b.resourceType === "CLASSROOM") {
                                        const classroom = classrooms.find(c => c.id === b.resourceId);
                                        serviceName = classroom ? classroom.roomNumber : "Phòng học";
                                        serviceType = "Phòng học";
                                    } else if (b.resourceType === "SPORT_FIELD") {
                                        const field = sportFields.find(s => s.id === b.resourceId);
                                        serviceName = field ? field.name : "Sân thể thao";
                                        serviceType = "Sân bóng";
                                    } else if (b.resourceType === "EQUIPMENT") {
                                        const eq = equipments.find(e => e.id === b.resourceId);
                                        serviceName = eq ? eq.name : "Thiết bị";
                                        serviceType = "Dụng cụ";
                                    }

                                    return (
                                        <tr key={i} className="border-b">
                                            <td className="py-2">
                                                <div className="font-medium">{serviceName}</div>
                                                <div className="text-gray-500 text-sm">{serviceType}</div>
                                            </td>
                                            <td className="py-2">{date}</td>
                                            <td className="py-2">{time}</td>
                                            <td className={`py-2 ${getStatusColor(b.status)}`}>
                                                {getStatusText(b.status)}
                                            </td>
                                            <td className="py-2 text-blue-600 hover:underline cursor-pointer">
                                                Xem chi tiết
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="flex justify-center items-center mt-4 space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-600 hover:bg-blue-50"}`}
                            >
                                Trước
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "text-blue-600 border-blue-600 hover:bg-blue-50"}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400 border-gray-300" : "text-blue-600 border-blue-600 hover:bg-blue-50"}`}
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right 1/3 */}
                <div className="space-y-4">
                    <div className="bg-white border rounded-lg shadow-sm p-4">
                        <h4 className="font-semibold mb-4">Lịch trình sắp tới</h4>
                        <ul className="space-y-3 text-sm">
                            {bookings.slice(0, 5).map((b, i) => {
                                const { date, time } = formatDateTime(b.startTime, b.endTime);
                                return (
                                    <li key={i}>
                                        <div className="font-medium">{b.serviceName || "Lịch đặt"}</div>
                                        <div className="text-gray-500">
                                            {time} • {date}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
