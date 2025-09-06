import React, { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const InvoicePage = () => {
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const bookingId = location.state?.booking?.bookingId;
    const navigate = useNavigate();
    const { user } = useAuth();

    // Lấy chi tiết hóa đơn từ backend
    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                let res = await authAPIs().get(endpoints.invoiceByBooking(bookingId));
                setInvoice(res.data);
            } catch (err) {
                toast.error("Không tải được hóa đơn!");
            }
        };
        fetchInvoice();
    }, [bookingId]);

    // Thanh toán tiền mặt
    const handlePayCash = async () => {
        setLoading(true);
        try {
            let res = await authAPIs().post("/payments/cash", {
                invoiceId: invoice.invoiceId,
                method: "CASH",
                payerInfo: "Thanh toán trực tiếp tại quầy",
            });
            setInvoice(res.data);
            toast.success("Thanh toán tiền mặt thành công!");
        } catch (err) {
            toast.error("Không thể thanh toán tiền mặt!");
        } finally {
            setLoading(false);
        }
    };

    // Thanh toán MoMo
    const handlePayMomo = async () => {
        setLoading(true);
        try {
            let res = await authAPIs().post(endpoints.momoInit(invoice.invoiceId));
            const payUrl = res.data;
            window.location.href = payUrl; // chuyển hướng sang MoMo
        } catch (err) {
            toast.error("Không thể khởi tạo thanh toán MoMo!");
        } finally {
            setLoading(false);
        }
    };

    if (!invoice) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 font-medium">Đang tải hóa đơn...</p>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const getStatusBadge = (status) => {
        if (status === "PAID") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Đã thanh toán
                </span>
            );
        } else if (status === "PENDING") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Chờ thanh toán
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Hóa Đơn Thanh Toán</h1>
                    <p className="text-gray-600">Chi tiết thông tin và phương thức thanh toán</p>
                </div>

                {/* Invoice Card */}
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-1">
                                    HÓA ĐƠN #OUBKSP{invoice.invoiceId}
                                </h2>
                            </div>
                            <div className="text-right">
                                {getStatusBadge(invoice.status)}
                            </div>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        Thông tin khách hàng
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700">
                                            <span className="font-medium">Khách hàng:</span> {user?.name}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        Thông tin thanh toán
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <p className="text-gray-700">
                                            <span className="font-medium">Phương thức:</span> {invoice.method || "Chưa thanh toán"}
                                        </p>
                                        {invoice.paidAt && (
                                            <p className="text-gray-700">
                                                <span className="font-medium">Ngày thanh toán:</span> {new Date(invoice.paidAt).toLocaleString('vi-VN')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Financial Summary */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                    Chi tiết tài chính
                                </h3>

                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Tổng tiền:</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(invoice.totalAmount)} VND</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Giảm giá:</span>
                                        <span className="font-medium text-red-600">-{formatCurrency(invoice.discount || 0)} VND</span>
                                    </div>



                                    <div className="flex justify-between items-center pt-4 border-t-2 border-indigo-200">
                                        <span className="text-xl font-bold text-gray-900">Thành tiền:</span>
                                        <span className="text-2xl font-bold text-indigo-600">{formatCurrency(invoice.finalAmount)} VND</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Actions */}
                        {invoice.status === "PENDING" && (
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                                    Chọn phương thức thanh toán
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                    <button
                                        onClick={handlePayCash}
                                        disabled={loading}
                                        className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                            </svg>
                                            <span>{loading ? "Đang xử lý..." : "Thanh toán tiền mặt"}</span>
                                        </div>
                                        {loading && (
                                            <div className="absolute inset-0 bg-green-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        onClick={handlePayMomo}
                                        disabled={loading}
                                        className="group relative bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center justify-center space-x-3">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                                                alt="MoMo Logo"
                                                className="w-8 h-8"
                                            />
                                            <span>{loading ? "Đang xử lý..." : "Thanh toán MoMo"}</span>
                                        </div>
                                        {loading && (
                                            <div className="absolute inset-0 bg-pink-600 bg-opacity-20 rounded-xl flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Paid Status */}
                        {invoice.status === "PAID" && (
                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h3>
                                    <p className="text-gray-600">Hóa đơn đã được thanh toán hoàn tất</p>
                                    {/* Nút về trang chủ */}
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
                                    >
                                        Về Trang Chủ
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;