import React, { useState } from "react";
import {
    Users,
    Calendar,
    BarChart2,
    Database,
    Menu,
    X,
    Bell,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import UserManagement from "./UserManagement";
import LecturerRequests from "./LecturerRequests";
import ResourceManagement from "./ResourceManagement";
import AdminBookingManagement from "./AdminBookingManagement";
import Reports from "./Reports"

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeNav, setActiveNav] = useState("users");
    const { user, logout } = useAuth();

    const navigationItems = [
        { id: "users", icon: Users, label: "Quản lý người dùng", badge: null },
        { id: "lecturers", icon: Users, label: "Yêu cầu từ giảng viên", badge: null },
        { id: "resources", icon: Database, label: "Quản lý tài nguyên", badge: null },
        { id: "bookings", icon: Calendar, label: "Quản lý đặt lịch", badge: null },
        { id: "reports", icon: BarChart2, label: "Báo cáo thống kê", badge: null },
    ];

    const NavItem = ({ item, isActive, onClick }) => (
        <button
            onClick={() => onClick(item.id)}
            className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-white shadow-lg shadow-emerald-500/30 transform scale-105"
                : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 hover:text-slate-900 hover:shadow-md"
                }`}
        >
            <div className="flex items-center">
                <item.icon
                    className={`w-5 h-5 mr-3 transition-all duration-300 ${isActive
                        ? "text-white drop-shadow-sm"
                        : "text-slate-600 group-hover:text-emerald-600 group-hover:scale-110"
                        }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.badge && (
                <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-300 ${isActive
                        ? "bg-white/25 text-white backdrop-blur-sm shadow-sm"
                        : "bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 group-hover:from-emerald-200 group-hover:to-cyan-200"
                        }`}
                >
                    {item.badge}
                </span>
            )}
        </button>
    );

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gradient-to-br from-slate-900/60 to-slate-800/60 backdrop-blur-md z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/70 backdrop-blur-2xl border-r border-white/40
                transform transition-all duration-500 ease-out flex flex-col shadow-2xl shadow-slate-200/50
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/30 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-cyan-400/20 to-blue-500/20 backdrop-blur-3xl"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-sm">
                                OU Admin
                            </h1>
                            <p className="text-sm text-white/90 mt-1 font-medium">
                                Quản lý hệ thống
                            </p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-4 border-b border-white/30">
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50/50 to-white/50 backdrop-blur-sm border border-white/40 hover:shadow-lg transition-all duration-300">
                        <img
                            src={
                                user?.avatar ||
                                "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff"
                            }
                            alt="User avatar"
                            className="w-12 h-12 rounded-full ring-3 ring-emerald-200/60 shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">
                                {user?.name || "Admin"}
                            </p>
                            <p className="text-xs text-slate-600 truncate font-medium">
                                {user?.email || "admin@ou.edu.vn"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigationItems.map((item) => (
                        <NavItem
                            key={item.id}
                            item={item}
                            isActive={activeNav === item.id}
                            onClick={setActiveNav}
                        />
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/30">
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 group hover:shadow-md border border-transparent hover:border-red-200/50"
                    >
                        <LogOut className="w-5 h-5 mr-3 text-slate-600 group-hover:text-red-600 transition-all duration-300 group-hover:scale-110" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="bg-white/60 backdrop-blur-2xl border-b border-white/40 px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-50 transition-all duration-200 hover:shadow-md"
                            >
                                <Menu className="w-5 h-5 text-slate-700" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-cyan-600 bg-clip-text text-transparent">
                                    OU Facility Management
                                </h2>
                                <p className="text-sm text-slate-600 font-medium">
                                    Chào mừng trở lại, {user?.name || "Admin"}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {activeNav === "users" && <UserManagement />}
                        {activeNav === "lecturers" && <LecturerRequests />}
                        {activeNav === "resources" && <ResourceManagement />}
                        {activeNav === "bookings" && <AdminBookingManagement />}
                        {activeNav === "reports" && <Reports />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
