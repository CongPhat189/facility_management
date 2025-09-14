import React, { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    X,
    CalendarDays,
    Filter,
    Clock,
    Users,
    MapPin,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";

const PAGE_SIZE = 10;

const AdminBookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [page, setPage] = useState(1);
    const { user } = useAuth();

    const loadBookings = async () => {
        setLoading(true);
        try {
            const res = await authAPIs().get(endpoints.getAllBookings);
            setBookings(res.data);
            setFilteredBookings(res.data);
        } catch (err) {
            toast.error("Không thể tải danh sách booking!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    // Lọc theo ngày (so sánh startTime)
    useEffect(() => {
        if (!selectedDate) {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(
                bookings.filter(
                    (b) => b.startTime && b.startTime.startsWith(selectedDate)
                )
            );
            setPage(1);
        }
    }, [selectedDate, bookings]);

    const handleApprove = async (id) => {
        try {
            await authAPIs().post(
                `${endpoints.approveBooking(id)}?adminId=${user.id}`
            );
            toast.success("Phê duyệt thành công!");
            loadBookings();
        } catch (err) {
            toast.error("Phê duyệt thất bại!");
        }
    };

    const handleReject = async (id) => {
        const reason = prompt("Nhập lý do từ chối:");
        if (!reason) return;

        try {
            await authAPIs().post(
                `${endpoints.rejectBooking(id)}?reason=${encodeURIComponent(reason)}&adminId=${user.id}`
            );
            toast.success("Từ chối thành công!");
            loadBookings();
        } catch (err) {
            toast.error("Từ chối thất bại!");
        }
    };

    // Phân trang
    const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
    const currentBookings = filteredBookings.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <AlertCircle className="w-4 h-4" />;
            case 'approved':
                return <CheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getResourceTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'classroom':
                return '🏫';
            case 'sport_field':
                return '⚽';
            case 'equipment':
                return '🔧';
            default:
                return '📦';
        }
    };

    // Stats
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
        approved: bookings.filter(b => b.status?.toLowerCase() === 'approved').length,
        rejected: bookings.filter(b => b.status?.toLowerCase() === 'rejected').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        Quản lý Booking
                    </h1>
                    <p className="text-gray-600">Quản lý và phê duyệt các yêu cầu đặt chỗ</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Tổng booking</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Chờ duyệt</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Đã duyệt</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Đã từ chối</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Filter Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 p-6">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <label className="font-semibold text-gray-700">Lọc theo ngày:</label>
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            {selectedDate && (
                                <button
                                    onClick={() => setSelectedDate("")}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
                                >
                                    <X className="w-4 h-4" />
                                    Xóa lọc
                                </button>
                            )}
                            <div className="ml-auto text-sm text-gray-600">
                                Hiển thị {currentBookings.length} / {filteredBookings.length} booking
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Booking ID
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Thông tin người dùng
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Loại tài nguyên
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Thời gian
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Mục đích</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Trạng thái</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-gray-600">Đang tải dữ liệu...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <CalendarDays className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-600 text-lg">Không có booking nào</p>
                                                <p className="text-gray-400 text-sm">Dữ liệu sẽ hiển thị ở đây khi có booking mới</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    currentBookings.map((b) => (
                                        <tr key={b.bookingId} className="hover:bg-gray-50 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-blue-600">#{b.bookingId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Users className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span className="font-medium">{b.fullName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{getResourceTypeIcon(b.resourceType)}</span>
                                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                                        {b.resourceType?.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="text-sm space-y-1">
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        {new Date(b.startTime).toLocaleString('vi-VN')}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-red-600">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                        {new Date(b.endTime).toLocaleString('vi-VN')}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-gray-600 truncate" title={b.purpose}>
                                                        {b.purpose}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(b.status)}`}>
                                                    {getStatusIcon(b.status)}
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {b.status === "PENDING" ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(b.bookingId)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            Duyệt
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(b.bookingId)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <X className="w-3 h-3" />
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Đã xử lý</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Hiển thị <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> đến{' '}
                                    <span className="font-medium">
                                        {Math.min(page * PAGE_SIZE, filteredBookings.length)}
                                    </span>{' '}
                                    trong tổng số <span className="font-medium">{filteredBookings.length}</span> booking
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Trước
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            if (pageNum === page) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className="w-10 h-10 bg-blue-600 text-white text-sm font-medium rounded-lg"
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (
                                                pageNum === 1 ||
                                                pageNum === totalPages ||
                                                (pageNum >= page - 1 && pageNum <= page + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className="w-10 h-10 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (pageNum === page - 2 || pageNum === page + 2) {
                                                return <span key={pageNum} className="text-gray-400">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Sau
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookingManagement;