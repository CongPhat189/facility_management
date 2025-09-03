import { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { useAuth } from "../context/AuthProvider";
import Header from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BorrowEquipment = () => {
    const [equipments, setEquipments] = useState([]);
    const [selected, setSelected] = useState(null); // chỉ 1 thiết bị
    const { user } = useAuth();
    const navigate = useNavigate();

    const [borrowDate, setBorrowDate] = useState("");
    const [returnDate, setReturnDate] = useState("");

    // Lấy danh sách thiết bị
    useEffect(() => {
        const loadEquipments = async () => {
            try {
                let res = await authAPIs().get(endpoints["equipments"]);
                setEquipments(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Không tải được danh sách thiết bị!");
            }
        };
        loadEquipments();
    }, []);

    const handleSelect = (id) => {
        setSelected((prev) => (prev === id ? null : id));
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.error("Bạn chưa đăng nhập!");
            return;
        }
        if (!borrowDate || !returnDate || !selected) {
            toast.warn("Vui lòng chọn ngày và thiết bị!");
            return;
        }

        try {
            const bookingRequest = {
                userId: user.id,
                resourceType: "EQUIPMENT",
                resourceId: selected[0],
                startTime: `${borrowDate}T00:00:00`,
                endTime: `${returnDate}T23:59:59`,
                equipmentQuantity: 1,
                purpose: "Mượn dụng cụ học tập",
            };

            let res = await authAPIs().post(
                endpoints["create-equipment-booking"],
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

    // Nhóm theo category
    const groupedEquipments = equipments.reduce((acc, eq) => {
        if (!acc[eq.equipmentType]) acc[eq.equipmentType] = [];
        acc[eq.equipmentType].push(eq);
        return acc;
    }, {});

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-xl">
            <Header />
            <h2 className="text-xl font-bold mb-4">Thông tin mượn dụng cụ</h2>

            {/* Ngày mượn / trả */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block font-medium mb-1">Ngày mượn *</label>
                    <input
                        type="date"
                        className="border p-2 rounded w-full"
                        value={borrowDate}
                        onChange={(e) => setBorrowDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Ngày trả *</label>
                    <input
                        type="date"
                        className="border p-2 rounded w-full"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Danh sách thiết bị */}
            <h3 className="font-semibold mb-2">Chọn dụng cụ cần mượn *</h3>
            {Object.keys(groupedEquipments).map((equipmentType) => (
                <div key={equipmentType} className="mb-6">
                    <h4 className="text-lg font-bold mb-3">{equipmentType}</h4>
                    <div className="grid grid-cols-3 gap-4">
                        {groupedEquipments[equipmentType].map((eq) => (
                            <div
                                key={eq.id}
                                className={`border rounded-lg p-3 cursor-pointer shadow hover:shadow-lg transition ${selected === eq.id ? "ring-2 ring-blue-500" : ""
                                    }`}
                                onClick={() => handleSelect(eq.id)}
                            >
                                <img
                                    src={eq.imageUrl}
                                    alt={eq.name}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <h5 className="font-semibold">{eq.name}</h5>
                                <p className="text-sm text-green-600">
                                    Còn sẵn: {eq.available}/{eq.total}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
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
                    Xác nhận mượn
                </button>
            </div>
        </div>
    );
};

export default BorrowEquipment;
