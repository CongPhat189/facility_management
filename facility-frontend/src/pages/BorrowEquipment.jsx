import { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { useAuth } from "../context/AuthProvider";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Calendar,
    Package,
    Target,
    Filter,
    MapPin,
    Plus,
    Minus,
    ArrowLeft,
    Check,
    Search,
    Laptop,
    Monitor,
    Cpu,
} from "lucide-react";

const BorrowEquipment = () => {
    const [equipments, setEquipments] = useState([]);
    const [selected, setSelected] = useState(null); // id thiết bị đã chọn
    const [quantities, setQuantities] = useState({}); // lưu số lượng từng thiết bị
    const [bookings, setBookings] = useState([]); // lưu các booking để tính available

    const { user } = useAuth();
    const navigate = useNavigate();

    const [borrowDate, setBorrowDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [purpose, setPurpose] = useState("");

    // Bộ lọc
    const [filterType, setFilterType] = useState("");
    const [filterAddress, setFilterAddress] = useState("");

    // ===== Helper tính số lượng còn lại =====
    const overlaps = (bStart, bEnd, sDate, eDate) => {
        const start = new Date(`${sDate}T00:00:00`);
        const end = new Date(`${eDate}T23:59:59`);
        return new Date(bStart) <= end && new Date(bEnd) >= start;
    };

    const calcAvailable = (eqId) => {
        const eq = equipments.find((x) => x.id === eqId);
        if (!eq || !borrowDate || !returnDate) return eq ? eq.quantity : 0;

        // chỉ tính booking PENDING hoặc APPROVED
        const COUNT_STATUSES = new Set(["PENDING", "APPROVED"]);

        const bookedQty = bookings
            .filter(
                (b) =>
                    b.resourceType === "EQUIPMENT" &&
                    b.resourceId === eqId &&
                    COUNT_STATUSES.has(b.status) &&
                    overlaps(b.startTime, b.endTime, borrowDate, returnDate)
            )
            .reduce((sum, b) => sum + (b.equipmentQuantity || 1), 0);

        return Math.max(0, (eq.quantity || 0) - bookedQty);
    };

    // ===== API call =====
    // Lấy danh sách thiết bị
    useEffect(() => {
        const loadEquipments = async () => {
            try {
                let res = await authAPIs().get(endpoints["equipments"]);
                setEquipments(res.data);

                const initialQuantities = {};
                res.data.forEach((eq) => {
                    initialQuantities[eq.id] = 1;
                });
                setQuantities(initialQuantities);
            } catch (err) {
                console.error(err);
                toast.error("Không tải được danh sách thiết bị!");
            }
        };
        loadEquipments();
    }, []);

    // Lấy booking trong khoảng borrowDate–returnDate
    useEffect(() => {
        if (!borrowDate || !returnDate) {
            setBookings([]);
            return;
        }

        const loadBookings = async () => {
            try {
                // backend của bạn có thể cần endpoint theo khoảng ngày
                // tạm gọi theo từng ngày nếu chỉ có by-date
                const dates = getDatesBetween(borrowDate, returnDate);
                const reqs = dates.map((d) =>
                    authAPIs().get(
                        `${endpoints["getAllBookings"]}/by-date?date=${d}&resourceType=EQUIPMENT`
                    )
                );
                const res = await Promise.all(reqs);
                const merged = res.flatMap((r) => r.data || []);
                setBookings(merged);
            } catch (err) {
                console.error(err);
                toast.error("Không tải được lịch mượn thiết bị!");
            }
        };
        loadBookings();
    }, [borrowDate, returnDate]);

    const getDatesBetween = (start, end) => {
        if (!start || !end) return [];
        const out = [];
        const d = new Date(start);
        const e = new Date(end);
        while (d <= e) {
            out.push(d.toISOString().split("T")[0]);
            d.setDate(d.getDate() + 1);
        }
        return out;
    };

    // ===== Actions =====
    const handleSelect = (id) => {
        setSelected((prev) => (prev === id ? null : id));
    };

    const updateQuantity = (id, delta) => {
        const maxQuantity = calcAvailable(id);
        setQuantities((prev) => {
            const newQty = Math.max(
                1,
                Math.min((prev[id] || 1) + delta, maxQuantity)
            );
            return { ...prev, [id]: newQty };
        });
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Bạn chưa đăng nhập!");
            return;
        }
        if (!borrowDate || !returnDate || !selected || !purpose) {
            toast.warn("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const selectedEq = equipments.find((eq) => eq.id === selected);
        if (!selectedEq) {
            toast.error("Thiết bị không hợp lệ!");
            return;
        }

        const quantity = quantities[selected] || 1;
        const available = calcAvailable(selected);
        if (quantity > available) {
            toast.warn(`Số lượng vượt quá số còn lại (${available})!`);
            return;
        }

        try {
            const bookingRequest = {
                userId: user.id,
                resourceType: "EQUIPMENT",
                resourceId: selected,
                startTime: `${borrowDate}T00:00:00`,
                endTime: `${returnDate}T23:59:59`,
                equipmentQuantity: quantity,
                purpose: purpose,
            };

            let res = await authAPIs().post(
                endpoints["create-booking"],
                bookingRequest
            );

            toast.success(
                "Yêu cầu mượn thiết bị đã được gửi! Hãy đợi quản trị viên phê duyệt."
            );
            console.log(res.data);

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Đặt mượn thiết bị thất bại!");
        }
    };

    // ===== UI =====
    const equipmentTypes = [...new Set(equipments.map((eq) => eq.equipmentType))];
    const equipmentAddresses = [...new Set(equipments.map((eq) => eq.address))];

    const filteredEquipments = equipments.filter((eq) => {
        const typeMatch = filterType ? eq.equipmentType === filterType : true;
        const addressMatch = filterAddress ? eq.address === filterAddress : true;
        return typeMatch && addressMatch;
    });

    const groupedEquipments = filteredEquipments.reduce((acc, eq) => {
        if (!acc[eq.equipmentType]) acc[eq.equipmentType] = [];
        acc[eq.equipmentType].push(eq);
        return acc;
    }, {});

    const equipmentTypeLabels = {
        projector: "Máy chiếu",
        laptop: "Laptop",
        biological_model: "Mô hình sinh học",
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "projector":
                return <Monitor className="w-6 h-6 text-purple-600" />;
            case "laptop":
                return <Laptop className="w-6 h-6 text-blue-600" />;
            case "biological_model":
                return <Cpu className="w-6 h-6 text-emerald-600" />;
            default:
                return <Package className="w-6 h-6 text-slate-600" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "projector":
                return "from-purple-500 to-indigo-600";
            case "laptop":
                return "from-blue-500 to-cyan-600";
            case "biological_model":
                return "from-emerald-500 to-teal-600";
            default:
                return "from-slate-500 to-gray-600";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Header />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">
                                    Mượn thiết bị
                                </h1>
                                <p className="text-slate-600">
                                    Đặt lịch mượn thiết bị giảng dạy và học tập
                                </p>
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

                    {/* Form Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Date Selection */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                                Thời gian mượn
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block font-semibold text-slate-700">
                                        Ngày mượn *
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={borrowDate}
                                        onChange={(e) => setBorrowDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block font-semibold text-slate-700">
                                        Ngày trả *
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
                                <Target className="w-6 h-6 mr-2 text-emerald-600" />
                                Mục đích sử dụng
                            </h3>

                            <div className="space-y-2">
                                <label className="block font-semibold text-slate-700">
                                    Mô tả chi tiết *
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                    rows="4"
                                    placeholder="Nhập mục đích sử dụng thiết bị..."
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                        <Filter className="w-6 h-6 mr-2 text-indigo-600" />
                        Bộ lọc thiết bị
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block font-semibold text-slate-700">
                                Lọc theo loại
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">Tất cả loại thiết bị</option>
                                {equipmentTypes.map((type, idx) => (
                                    <option key={idx} value={type}>
                                        {equipmentTypeLabels[type] || type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-semibold text-slate-700">
                                Lọc theo địa chỉ
                            </label>
                            <select
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                                value={filterAddress}
                                onChange={(e) => setFilterAddress(e.target.value)}
                            >
                                <option value="">Tất cả địa chỉ</option>
                                {equipmentAddresses.map((addr, idx) => (
                                    <option key={idx} value={addr}>
                                        {addr}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Equipment Selection */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
                    <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                        <Search className="w-6 h-6 mr-2 text-orange-600" />
                        Chọn thiết bị cần mượn *
                    </h3>

                    {Object.keys(groupedEquipments).length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 text-lg">
                                Không có thiết bị nào phù hợp với bộ lọc
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.keys(groupedEquipments).map((equipmentType) => (
                                <div key={equipmentType}>
                                    {/* Type Header */}
                                    <div
                                        className={`bg-gradient-to-r ${getTypeColor(
                                            equipmentType
                                        )} rounded-xl p-4 mb-6 text-white`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                {getTypeIcon(equipmentType)}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold">
                                                    {equipmentTypeLabels[equipmentType] || equipmentType}
                                                </h4>
                                                <p className="text-white/80">
                                                    {groupedEquipments[equipmentType].length} thiết bị có
                                                    sẵn
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Equipment Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupedEquipments[equipmentType].map((eq) => (
                                            <div
                                                key={eq.id}
                                                className={`group bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-xl ${selected === eq.id
                                                    ? "border-blue-500 shadow-lg ring-4 ring-blue-100"
                                                    : "border-slate-200 hover:border-blue-300"
                                                    }`}
                                                onClick={() => handleSelect(eq.id)}
                                            >
                                                {/* Equipment Image */}
                                                <div className="relative mb-4">
                                                    <img
                                                        src={eq.imageUrl}
                                                        alt={eq.name}
                                                        className="w-full h-40 object-cover rounded-xl"
                                                    />
                                                    {selected === eq.id && (
                                                        <div className="absolute top-2 right-2 p-2 bg-blue-500 rounded-full shadow-lg">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-semibold">
                                                        Còn: {calcAvailable(eq.id)}
                                                    </div>
                                                </div>

                                                {/* Equipment Info */}
                                                <div className="space-y-2">
                                                    <h5 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                                                        {eq.name}
                                                    </h5>
                                                    <div className="flex items-center text-slate-600">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        <span className="text-sm">{eq.address}</span>
                                                    </div>
                                                </div>

                                                {/* Quantity Control */}
                                                {selected === eq.id && (
                                                    <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-slate-700">
                                                                Số lượng:
                                                            </span>
                                                            <div className="flex items-center space-x-3">
                                                                <button
                                                                    type="button"
                                                                    className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateQuantity(eq.id, -1);
                                                                    }}
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="font-bold text-lg w-8 text-center">
                                                                    {quantities[eq.id] || 1}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateQuantity(eq.id, 1);
                                                                    }}
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full sm:w-auto px-8 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-all"
                        >
                            Hủy bỏ
                        </button>

                        <div className="flex items-center space-x-4">
                            {selected && (
                                <div className="text-sm text-slate-600">
                                    Đã chọn:{" "}
                                    <span className="font-semibold">
                                        {equipments.find((eq) => eq.id === selected)?.name}
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                            >
                                Xác nhận mượn thiết bị
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowEquipment;
