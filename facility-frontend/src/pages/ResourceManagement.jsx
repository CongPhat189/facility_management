import React, { useEffect, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import { toast } from "react-toastify";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    BuildingOfficeIcon,
    CubeIcon,
    WrenchScrewdriverIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

const ResourceManagement = () => {
    const [tab, setTab] = useState("classrooms");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [form, setForm] = useState({});

    const loadData = async () => {
        setLoading(true);
        try {
            let url =
                tab === "classrooms"
                    ? endpoints.getClassrooms
                    : tab === "sport_fields"
                        ? endpoints.getSportFields
                        : endpoints.getEquipments;
            let res = await authAPIs().get(url);
            setData(res.data);
        } catch (err) {
            toast.error("Không thể tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setForm({});
        setEditingId(null);
        setShowForm(false);
        loadData();
    }, [tab]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            let url =
                tab === "classrooms"
                    ? endpoints.createClassroom
                    : tab === "sport_fields"
                        ? endpoints.createSportField
                        : endpoints.createEquipment;

            if (editingId) {
                url =
                    tab === "classrooms"
                        ? endpoints.updateClassroom(editingId)
                        : tab === "sport_fields"
                            ? endpoints.updateSportField(editingId)
                            : endpoints.updateEquipment(editingId);
            }

            // Nếu là sport_fields hoặc equipments → dùng FormData (có ảnh)
            if (tab === "sport_fields" || tab === "equipments") {
                const fd = new FormData();
                Object.keys(form).forEach((key) => {
                    if (form[key] !== null && form[key] !== undefined) {
                        fd.append(key, form[key]);
                    }
                });
                fd.append("status", "available"); // set mặc định

                if (editingId) {
                    await authAPIs().patch(url, fd, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    toast.success("Cập nhật thành công!");
                } else {
                    await authAPIs().post(url, fd, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    toast.success("Thêm mới thành công!");
                }
            } else {
                // classrooms → gửi JSON
                const newForm = { ...form, status: "available" };
                if (editingId) {
                    await authAPIs().patch(url, newForm);
                    toast.success("Cập nhật thành công!");
                } else {
                    await authAPIs().post(url, newForm);
                    toast.success("Thêm mới thành công!");
                }
            }

            setForm({});
            setEditingId(null);
            setShowForm(false);
            loadData();
        } catch (err) {
            console.error(err);
            toast.error("Lưu thất bại!");
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setForm({
            ...item, imageUrl: null,

        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
        try {
            let url =
                tab === "classrooms"
                    ? endpoints.deleteClassroom(id)
                    : tab === "sport_fields"
                        ? endpoints.deleteSportField(id)
                        : endpoints.deleteEquipment(id);

            await authAPIs().delete(url);
            toast.success("Xóa thành công!");
            loadData();
        } catch (err) {
            toast.error("Xóa thất bại!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <CubeIcon className="w-6 h-6 text-white" />
                        </div>
                        Quản lý tài nguyên
                    </h1>
                    <p className="text-gray-600">
                        Quản lý lớp học, sân thể thao và thiết bị một cách hiệu quả
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 bg-gray-50/50">
                        <div className="flex">
                            <button
                                onClick={() => setTab("classrooms")}
                                className={`flex-1 px-6 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${tab === "classrooms"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-white hover:text-blue-600"
                                    }`}
                            >
                                <BuildingOfficeIcon className="w-5 h-5" />
                                Lớp học
                            </button>
                            <button
                                onClick={() => setTab("sport_fields")}
                                className={`flex-1 px-6 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${tab === "sport_fields"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-white hover:text-blue-600"
                                    }`}
                            >
                                <CubeIcon className="w-5 h-5" />
                                Sân thể thao
                            </button>
                            <button
                                onClick={() => setTab("equipments")}
                                className={`flex-1 px-6 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${tab === "equipments"
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-white hover:text-blue-600"
                                    }`}
                            >
                                <WrenchScrewdriverIcon className="w-5 h-5" />
                                Thiết bị
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Nút thêm mới */}
                        {!showForm && (
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Thêm mới
                                </button>
                            </div>
                        )}

                        {/* Form thêm/sửa */}
                        {showForm && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {editingId ? (
                                            <>
                                                <PencilIcon className="w-6 h-6 text-blue-600" />
                                                Chỉnh sửa thông tin
                                            </>
                                        ) : (
                                            <>
                                                <PlusIcon className="w-6 h-6 text-green-600" />
                                                Thêm mới
                                            </>
                                        )}
                                    </h3>
                                </div>

                                {/* Form cho classrooms */}
                                {tab === "classrooms" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Số phòng
                                            </label>
                                            <input
                                                name="roomNumber"
                                                value={form.roomNumber || ""}
                                                onChange={handleChange}
                                                placeholder="VD: A101"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Tòa nhà
                                            </label>
                                            <input
                                                name="building"
                                                value={form.building || ""}
                                                onChange={handleChange}
                                                placeholder="VD: Tòa A"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Sức chứa
                                            </label>
                                            <input
                                                name="capacity"
                                                type="number"
                                                value={form.capacity || ""}
                                                onChange={handleChange}
                                                placeholder="VD: 50"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                            <label className="text-sm font-medium text-gray-700">
                                                Địa chỉ
                                            </label>
                                            <input
                                                name="address"
                                                value={form.address || ""}
                                                onChange={handleChange}
                                                placeholder="Nhập địa chỉ chi tiết"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                            <label className="text-sm font-medium text-gray-700">
                                                Mô tả
                                            </label>
                                            <textarea
                                                name="description"
                                                value={form.description || ""}
                                                onChange={handleChange}
                                                placeholder="Nhập mô tả về lớp học"
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Form cho sport_fields */}
                                {tab === "sport_fields" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Tên sân
                                            </label>
                                            <input
                                                name="fieldName"
                                                value={form.fieldName || ""}
                                                onChange={handleChange}
                                                placeholder="VD: Sân bóng đá 1"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Loại sân
                                            </label>
                                            <select
                                                name="fieldType"
                                                value={form.fieldType || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">-- Chọn loại sân --</option>
                                                <option value="football">🏈 Bóng đá</option>
                                                <option value="basketball">🏀 Bóng rổ</option>
                                                <option value="badminton">🏸 Cầu lông</option>
                                                <option value="tennis">🎾 Tennis</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Giá/giờ (VND)
                                            </label>
                                            <input
                                                name="pricePerHour"
                                                type="number"
                                                value={form.pricePerHour || ""}
                                                onChange={handleChange}
                                                placeholder="VD: 100000"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Hình ảnh
                                            </label>
                                            <input
                                                type="file"
                                                name="imageUrl"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setForm({ ...form, imageUrl: e.target.files[0] })
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Địa chỉ
                                            </label>
                                            <input
                                                name="address"
                                                value={form.address || ""}
                                                onChange={handleChange}
                                                placeholder="Nhập địa chỉ chi tiết"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Mô tả
                                            </label>
                                            <textarea
                                                name="description"
                                                value={form.description || ""}
                                                onChange={handleChange}
                                                placeholder="Nhập mô tả về sân thể thao"
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Form cho equipments */}
                                {tab === "equipments" && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Tên thiết bị
                                            </label>
                                            <input
                                                name="name"
                                                value={form.name || ""}
                                                onChange={handleChange}
                                                placeholder="VD: Máy chiếu Epson"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Loại thiết bị
                                            </label>
                                            <select
                                                name="equipmentType"
                                                value={form.equipmentType || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">-- Chọn loại thiết bị --</option>
                                                <option value="projector">📽️ Máy chiếu</option>
                                                <option value="laptop">💻 Laptop</option>
                                                <option value="biological_model">🧬 Mô hình sinh học</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Model
                                            </label>
                                            <input
                                                name="model"
                                                value={form.model || ""}
                                                onChange={handleChange}
                                                placeholder="VD: EB-X41"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Số serial
                                            </label>
                                            <input
                                                name="serialNumber"
                                                value={form.serialNumber || ""}
                                                onChange={handleChange}
                                                placeholder="VD: SN123456789"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Số lượng
                                            </label>
                                            <input
                                                name="quantity"
                                                type="number"
                                                value={form.quantity || ""}
                                                onChange={handleChange}
                                                placeholder="VD: 5"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Hình ảnh
                                            </label>
                                            <input
                                                type="file"
                                                name="imageUrl"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setForm({ ...form, imageUrl: e.target.files[0] })
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                Địa chỉ
                                            </label>
                                            <input
                                                name="address"
                                                value={form.address || ""}
                                                onChange={handleChange}
                                                placeholder="Nhập địa chỉ nơi đặt thiết bị"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleSave}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                    >
                                        <CheckIcon className="w-5 h-5" />
                                        {editingId ? "Cập nhật" : "Thêm mới"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setForm({});
                                            setShowForm(false);
                                        }}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold rounded-xl hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bảng lớp học */}
                        {tab === "classrooms" && (
                            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                Phòng
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                Tòa nhà
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                Địa chỉ
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                Sức chứa
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                Trạng thái
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                Mô tả
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                                                Hành động
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {data.map((c) => (
                                            <tr
                                                key={c.id}
                                                className="hover:bg-gray-50 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {c.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {c.roomNumber}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {c.building}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {c.address}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {c.capacity}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${c.status === "available"
                                                            ? "bg-green-100 text-green-800"
                                                            : c.status === "occupied"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                    {c.description}
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(c)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                    >
                                                        <PencilIcon className="w-3 h-3" />
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                    >
                                                        <TrashIcon className="w-3 h-3" />
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Card sân thể thao */}
                        {tab === "sport_fields" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.map((f) => (
                                    <div
                                        key={f.id}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={f.imageUrl}
                                                alt={f.fieldName}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${f.status === "available"
                                                        ? "bg-green-500 text-white"
                                                        : f.status === "occupied"
                                                            ? "bg-red-500 text-white"
                                                            : "bg-yellow-500 text-white"
                                                        }`}
                                                >
                                                    {f.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {f.fieldName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">{f.address}</p>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-lg font-bold text-blue-600">
                                                    {f.pricePerHour?.toLocaleString()} VND/giờ
                                                </span>
                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                    {f.fieldType}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(f)}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(f.id)}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Card thiết bị */}
                        {tab === "equipments" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.map((e) => (
                                    <div
                                        key={e.id}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={e.imageUrl}
                                                alt={e.name}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${e.status === "available"
                                                        ? "bg-green-500 text-white"
                                                        : e.status === "occupied"
                                                            ? "bg-red-500 text-white"
                                                            : "bg-yellow-500 text-white"
                                                        }`}
                                                >
                                                    {e.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                                {e.name}
                                            </h3>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Model:</span>
                                                    <span className="font-medium">{e.model}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Serial:</span>
                                                    <span className="font-medium">{e.serialNumber}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Số lượng:</span>
                                                    <span className="font-bold text-blue-600">
                                                        {e.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(e)}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(e.id)}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ResourceManagement;
