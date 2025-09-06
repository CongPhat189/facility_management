import { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { useAuth } from "../context/AuthProvider";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Calendar,
    MapPin,
    Package,
    Filter,
    Check,
    Search,
    Clock,
    ArrowLeft,
    DollarSign
} from "lucide-react";

const timeSlots = [
    "06:00-08:00",
    "08:00-10:00",
    "10:00-12:00",
    "12:00-14:00",
    "14:00-16:00",
    "16:00-18:00",
    "18:00-20:00",
    "20:00-22:00"
];

// Map fieldType → Tiếng Việt
const fieldTypeLabels = {
    football: "Bóng đá",
    basketball: "Bóng rổ",
    volleyball: "Bóng chuyền",
    tennis: "Tennis",
    badminton: "Cầu lông",
};

const BookSportField = () => {
    const [fields, setFields] = useState([]);
    const [selected, setSelected] = useState(null);
    const [bookings, setBookings] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [purpose, setPurpose] = useState("");
    const [filterAddress, setFilterAddress] = useState("");
    const [filterType, setFilterType] = useState("");
    const [selectedSlots, setSelectedSlots] = useState({}); // lưu slot đã chọn theo fieldId

    // Lấy danh sách sân
    useEffect(() => {
        const loadFields = async () => {
            try {
                let res = await authAPIs().get(endpoints["sport_fields"]);
                setFields(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Không tải được danh sách sân bóng!");
            }
        };
        loadFields();
    }, []);

    // Lấy booking theo ngày
    useEffect(() => {
        if (!date) return;

        const loadBookings = async () => {
            try {
                let res = await authAPIs().get(
                    `${endpoints["getAllBookings"]}/by-date?date=${date}&resourceType=SPORT_FIELD`
                );
                setBookings(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Không tải được lịch đặt!");
            }
        };
        loadBookings();
    }, [date]);

    const handleSelect = (id) => {
        setSelected((prev) => (prev === id ? null : id));
    };

    const isSlotBooked = (fieldId, slot) => {
        return bookings.some(
            (b) =>
                b.resourceId === fieldId &&
                formatSlot(b.startTime, b.endTime) === slot &&
                b.status !== "CANCELLED"
        );
    };

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
    const today = new Date().toISOString().split("T")[0];


    const handleSubmit = async () => {
        if (!user) {
            toast.error("Bạn chưa đăng nhập!");
            return;
        }
        if (!date || !selected || !purpose || !selectedSlots[selected]) {
            toast.warn("Vui lòng nhập đầy đủ thông tin!");
            return;
        }


        const slot = selectedSlots[selected];
        const [start, end] = slot.split("-");
        try {


            const bookingRequest = {
                userId: user.id,
                resourceType: "SPORT_FIELD",
                resourceId: selected,
                startTime: `${date}T${start}:00`,
                endTime: `${date}T${end}:00`,
                purpose: purpose,
            };
            let resBooking = await authAPIs().post(endpoints["create-booking"], bookingRequest);
            let bookingId = resBooking.data.bookingId || resBooking.data;
            let resInvoice = await authAPIs().get(endpoints.invoiceByBooking(bookingId));
            let invoice = resInvoice.data;

            toast.success("Đặt sân thành công! Hãy tiến hành thanh toán.");
            navigate(`/invoice/${invoice.invoiceId}`, { state: { booking: resBooking.data } });
        } catch (err) {
            console.error(err);
            toast.error("Đặt sân thất bại!");
        }
    };

    const fieldAddresses = [...new Set(fields.map(f => f.address))];
    const fieldTypes = [...new Set(fields.map(f => f.fieldType))];

    const filteredFields = fields.filter(f => {
        const addressMatch = filterAddress ? f.address === filterAddress : true;
        const typeMatch = filterType ? f.fieldType === filterType : true;
        return addressMatch && typeMatch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Đặt sân bóng</h1>
                                <p className="text-slate-600">Chọn ngày và khung giờ để đặt sân</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Quay lại
                        </button>
                    </div>

                    {/* Form chọn ngày & mục đích */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                                <Calendar className="w-6 h-6 mr-2 text-green-600" />
                                Ngày đặt sân
                            </h3>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={today}
                            />
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                                <Clock className="w-6 h-6 mr-2 text-emerald-600" />
                                Mục đích
                            </h3>
                            <textarea
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                                rows="4"
                                placeholder="Nhập mục đích sử dụng sân..."
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Bộ lọc */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                        <Filter className="w-6 h-6 mr-2 text-green-600" />
                        Bộ lọc sân
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <select
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                            value={filterAddress}
                            onChange={(e) => setFilterAddress(e.target.value)}
                        >
                            <option value="">Tất cả địa chỉ</option>
                            {fieldAddresses.map((addr, idx) => (
                                <option key={`addr-${idx}`} value={addr}>{addr}</option>
                            ))}
                        </select>
                        <select
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">Tất cả loại sân</option>
                            {fieldTypes.map((type, idx) => (
                                <option key={`type-${idx}`} value={type}>
                                    {fieldTypeLabels[type] || type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Danh sách sân */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredFields.map((field, idx) => (
                        <div
                            key={field.id || `field-${idx}`}
                            className={`group bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all ${selected === field.id
                                ? "border-green-500 shadow-lg ring-4 ring-green-100"
                                : "border-slate-200 hover:border-green-300"
                                }`}
                            onClick={() => handleSelect(field.id)}
                        >
                            <div className="relative mb-4">
                                <img
                                    src={field.imageUrl}
                                    alt={field.fieldName}
                                    className="w-full h-40 object-cover rounded-xl"
                                />
                                {selected === field.id && (
                                    <div className="absolute top-2 right-2 p-2 bg-green-500 rounded-full">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                            <h5 className="font-bold text-lg text-slate-800">
                                {field.fieldName}{" "}
                                <span className="text-sm text-slate-500">
                                    ({fieldTypeLabels[field.fieldType] || field.fieldType})
                                </span>
                            </h5>
                            <p className="text-sm text-slate-600 mt-1">{field.description}</p>
                            <div className="flex items-center text-slate-600 mt-2">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{field.address}</span>
                            </div>
                            <div className="flex items-center text-emerald-600 font-semibold mt-2">
                                <DollarSign className="w-4 h-4 mr-1" />
                                <span>{Number(field.pricePerHour).toLocaleString()} VND / giờ</span>
                            </div>

                            {/* Chọn khung giờ */}
                            {selected === field.id && (
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {timeSlots.map((slot) => {
                                        const disabled = isSlotBooked(field.id, slot);
                                        return (
                                            <button
                                                key={`${field.id}-${slot}`}
                                                disabled={disabled}
                                                className={`px-2 py-2 rounded-lg text-sm font-medium ${disabled
                                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                    : selectedSlots[field.id] === slot
                                                        ? "bg-green-600 text-white"
                                                        : "bg-slate-100 hover:bg-green-100"
                                                    }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedSlots((prev) => ({
                                                        ...prev,
                                                        [field.id]: slot
                                                    }));
                                                }}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Nút hành động */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-600 rounded-xl"
                        >
                            Hủy bỏ
                        </button>
                        <div className="flex items-center space-x-4">
                            {selected && (
                                <span className="text-sm text-slate-600">
                                    Đã chọn:{" "}
                                    <strong>{fields.find(f => f.id === selected)?.fieldName}</strong>{" "}
                                    | Slot:{" "}
                                    <strong>{selectedSlots[selected] || "Chưa chọn"}</strong>
                                </span>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg"
                            >
                                Xác nhận đặt sân
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookSportField;
