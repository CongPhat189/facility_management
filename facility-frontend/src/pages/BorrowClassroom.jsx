import { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { useAuth } from "../context/AuthProvider";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";   // 👈 import toast

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

    // Check khung giờ đã đặt
    const isSlotBooked = (slot) => {
        return bookings.some(
            (b) =>
                b.classroomId === parseInt(room) &&
                b.date === date &&
                b.timeSlot === slot &&
                b.status !== "CANCELLED"
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

            // reload danh sách booking
            let updated = await authAPIs().get(endpoints.bookings(user?.id));
            setBookings(updated.data);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Đặt phòng thất bại!");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-xl">
            <Header />
            <h2 className="text-xl font-bold mb-4">Thông tin đặt phòng</h2>

            {/* Ngày mượn phòng */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Ngày mượn phòng *</label>
                <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}   // chặn chọn ngày quá khứ
                />
            </div>

            {/* Chọn phòng học */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Chọn phòng học *</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2">
                    {classrooms.map((c) => (
                        <label
                            key={c.id}
                            className="flex items-center space-x-2 border p-2 rounded cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="room"
                                value={c.id}
                                onChange={(e) => setRoom(e.target.value)}
                            />
                            <span>
                                {c.roomNumber} - {c.address} (Sức chứa: {c.capacity})
                            </span>
                        </label>
                    ))}
                </div>
            </div>


            {/* Chọn khung giờ */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Chọn khung giờ *</label>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot}
                            className={`p-2 border rounded ${isSlotBooked(slot)
                                ? "bg-red-300 cursor-not-allowed"
                                : timeSlot === slot
                                    ? "bg-blue-500 text-white"
                                    : "bg-white-100 hover:bg-gray-200"
                                }`}
                            onClick={() => !isSlotBooked(slot) && setTimeSlot(slot)}
                            disabled={isSlotBooked(slot)}
                        >
                            {slot} {isSlotBooked(slot) && "(Đã đặt)"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mục đích sử dụng */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Mục đích sử dụng *</label>
                <textarea
                    className="border p-2 rounded w-full"
                    rows="3"
                    maxLength="500"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Nhập mục đích sử dụng..."
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}

                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Đặt phòng học
                </button>
            </div>
        </div>
    );
};

export default BorrowClassroom;
