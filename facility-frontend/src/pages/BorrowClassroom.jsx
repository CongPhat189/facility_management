import { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { useAuth } from "../context/AuthProvider";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BorrowClassroom = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [room, setRoom] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [purpose, setPurpose] = useState("");

    const timeSlots = [
        "07:00-08:30",
        "08:30-10:00",
        "10:00-11:30",
        "13:00-14:30",
        "14:30-16:00",
        "16:00-17:30",
    ];

    // Lấy danh sách phòng học
    useEffect(() => {
        const loadClassrooms = async () => {
            let res = await authAPIs().get(endpoints["classrooms"]);
            setClassrooms(res.data);
        };
        loadClassrooms();
    }, []);

    // Lấy danh sách booking của user (khi có user)
    useEffect(() => {
        if (user) {
            const loadBookings = async () => {
                let res = await authAPIs().get(endpoints.bookings(user?.id));
                setBookings(res.data);
            };
            loadBookings();
        }
    }, [user]);

    useEffect(() => {
        if (!date) return;

        const loadBookings = async () => {
            try {
                let res = await authAPIs().get(
                    `${endpoints["getAllBookings"]}/by-date?date=${date}&resourceType=CLASSROOM`
                );
                setBookings(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Không tải được lịch đặt!");
            }
        };
        loadBookings();
    }, [date]);

    // Check khung giờ đã đặt
    const formatSlot = (startTime, endTime) => {
        const start = new Date(startTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        const end = new Date(endTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
        return `${start}-${end}`;
    };

    const isSlotBooked = (classroomId, slot) => {
        return bookings.some(
            (b) =>
                b.resourceId === classroomId &&
                formatSlot(b.startTime, b.endTime) === slot &&
                b.status !== "CANCELED"
        );
    };


    // Ngày hôm nay (chặn ngày quá khứ)
    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Bạn chưa đăng nhập!");
            return;
        }
        if (!date || !room || !timeSlot || !purpose) {
            toast.warn("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const [start, end] = timeSlot.split("-");

            const bookingRequest = {
                userId: user.id,
                resourceType: "CLASSROOM",
                resourceId: parseInt(room),
                startTime: `${date}T${start}:00`,
                endTime: `${date}T${end}:00`,
                purpose: purpose,
            };

            let res = await authAPIs().post(endpoints["create-booking"], bookingRequest);

            toast.success("Đặt phòng thành công! Hãy đợi quản trị viên phê duyệt.");
            console.log(res.data);


            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Đặt phòng thất bại!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-3">
                            Đặt phòng học
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Chọn thời gian và phòng học phù hợp cho hoạt động của bạn
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Main Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20">
                        <div className="space-y-8">
                            {/* Date Selection */}
                            <div className="group">
                                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Ngày mượn phòng *
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={today}
                                />
                            </div>

                            {/* Classroom Selection */}
                            <div className="group">
                                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Chọn phòng học *
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {classrooms.map((c) => (
                                            <label
                                                key={c.id}
                                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${room === c.id.toString()
                                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-blue-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="room"
                                                    value={c.id}
                                                    onChange={(e) => setRoom(e.target.value)}
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-900">
                                                            {c.roomNumber} ({c.description})
                                                        </span>
                                                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                            Sức chứa {c.capacity} chỗ
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600 text-sm">
                                                        📍 {c.address}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Time Slot Selection */}
                            <div className="group">
                                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Chọn khung giờ *
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {timeSlots.map((slot) => {
                                        const isBooked = isSlotBooked(parseInt(room), slot);
                                        const isSelected = timeSlot === slot;

                                        return (
                                            <button
                                                key={slot}
                                                className={`p-4 rounded-lg font-medium transition-all duration-200 border-2 ${isBooked
                                                    ? "bg-red-50 border-red-300 text-red-600 cursor-not-allowed opacity-70"
                                                    : isSelected
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-105"
                                                        : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:scale-105 hover:shadow-md"
                                                    }`}
                                                onClick={() => !isBooked && setTimeSlot(slot)}
                                                disabled={isBooked}
                                            >
                                                <div className="text-center">
                                                    <div className="text-lg font-semibold">{slot}</div>
                                                    {isBooked && (
                                                        <div className="text-xs mt-1 font-medium">
                                                            ❌ Đã đặt
                                                        </div>
                                                    )}
                                                    {!isBooked && !isSelected && (
                                                        <div className="text-xs mt-1 text-green-600">
                                                            ✅ Có sẵn
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Purpose */}
                            <div className="group">
                                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Mục đích sử dụng *
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows="4"
                                    maxLength="500"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="Vui lòng mô tả chi tiết mục đích sử dụng phòng học (tối đa 500 ký tự)..."
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {purpose.length}/500 ký tự
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:scale-105"
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Đặt phòng học
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-start space-x-4">
                            <div className="bg-white/20 rounded-lg p-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Lưu ý quan trọng</h3>
                                <ul className="space-y-1 text-blue-100">
                                    <li>• Đặt phòng cần được phê duyệt bởi quản trị viên</li>
                                    <li>• Vui lòng đặt phòng trước ít nhất 24 giờ</li>
                                    <li>• Mọi thắc mắc xin liên hệ phòng quản lý học vụ</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowClassroom;