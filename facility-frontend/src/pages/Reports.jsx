// src/pages/Reports.jsx
import { useEffect, useMemo, useState } from "react";
import { authAPIs, endpoints } from "../configs/APIs";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {
    Calendar,
    BarChart3,
    PieChart as PieIcon,
    LineChart as LineIcon,
    Brain,
    RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import clsx from "clsx";

const STATUS_LABELS = {
    APPROVED: "Đã duyệt",
    PENDING: "Chờ duyệt",
    REJECTED: "Từ chối",
    CANCELED: "Đã hủy",
};

const TYPE_LABELS = {
    CLASSROOM: "Phòng học",
    SPORT_FIELD: "Sân thể thao",
    EQUIPMENT: "Thiết bị",
};

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export default function Reports() {
    const today = new Date();
    const [tab, setTab] = useState("monthly"); // 'monthly' | 'range'

    // MONTHLY states
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [monthlyData, setMonthlyData] = useState(null);
    const [loadingMonthly, setLoadingMonthly] = useState(false);
    const [aiMonthly, setAiMonthly] = useState("");
    const [loadingAiMonthly, setLoadingAiMonthly] = useState(false);

    // RANGE states
    const iso = (d) => d.toISOString().slice(0, 10);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const [fromDate, setFromDate] = useState(iso(startOfMonth));
    const [toDate, setToDate] = useState(iso(endOfMonth));
    const [rangeData, setRangeData] = useState(null);
    const [loadingRange, setLoadingRange] = useState(false);
    const [aiRange, setAiRange] = useState("");
    const [loadingAiRange, setLoadingAiRange] = useState(false);

    // Fetch monthly raw
    const fetchMonthly = async () => {
        setLoadingMonthly(true);
        setAiMonthly("");
        try {
            const res = await authAPIs().get(endpoints.report_monthly_raw(month, year));
            setMonthlyData(res.data);
        } catch (e) {
            console.error(e);
            toast.error("Không tải được báo cáo theo tháng!");
        } finally {
            setLoadingMonthly(false);
        }
    };

    // Fetch range raw
    const fetchRange = async () => {
        if (!fromDate || !toDate || toDate < fromDate) {
            toast.warn("Ngày không hợp lệ!");
            return;
        }
        setLoadingRange(true);
        setAiRange("");
        try {
            const res = await authAPIs().get(endpoints.report_range_raw(fromDate, toDate));
            setRangeData(res.data);
        } catch (e) {
            console.error(e);
            toast.error("Không tải được báo cáo theo khoảng ngày!");
        } finally {
            setLoadingRange(false);
        }
    };

    useEffect(() => {
        if (tab === "monthly") fetchMonthly();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    // AI analysis
    const runAiMonthly = async () => {
        setLoadingAiMonthly(true);
        try {
            const res = await authAPIs().get(endpoints.report_analysis_monthly(month, year, true));
            setAiMonthly(res.data?.analysis || "Chưa có phân tích.");
        } catch (e) {
            console.error(e);
            toast.error("AI phân tích thất bại!");
        } finally {
            setLoadingAiMonthly(false);
        }
    };

    const runAiRange = async () => {
        if (!fromDate || !toDate || toDate < fromDate) {
            toast.warn("Ngày không hợp lệ!");
            return;
        }
        setLoadingAiRange(true);
        try {
            const res = await authAPIs().get(endpoints.report_analysis_range(fromDate, toDate));
            setAiRange(res.data?.analysis || "Chưa có phân tích.");
        } catch (e) {
            console.error(e);
            toast.error("AI phân tích thất bại!");
        } finally {
            setLoadingAiRange(false);
        }
    };

    // mapping helpers
    const mapTypeData = (arr = []) =>
        arr.map((it) => ({
            name: TYPE_LABELS[it.type] || it.type,
            value: Number(it.total || 0),
        }));

    const mapStatusData = (arr = []) =>
        arr.map((it) => ({
            status: STATUS_LABELS[it.status] || it.status,
            total: Number(it.total || 0),
        }));

    const mapPeakHours = (arr = []) =>
        arr.map((it) => ({
            hour: Number(it.hour),
            total: Number(it.total || 0),
        }));

    const monthlyCharts = useMemo(() => {
        if (!monthlyData) return null;
        return {
            types: mapTypeData(monthlyData.bookingsByType),
            statuses: mapStatusData(monthlyData.bookingsByStatus),
            hours: mapPeakHours(monthlyData.peakHours),
            revenue: Number(monthlyData.sportFieldRevenue || 0),
            period: `${String(month).padStart(2, "0")}/${year}`,
        };
    }, [monthlyData, month, year]);

    const rangeCharts = useMemo(() => {
        if (!rangeData) return null;
        return {
            types: mapTypeData(rangeData.bookingsByType),
            statuses: mapStatusData(rangeData.bookingsByStatus),
            hours: mapPeakHours(rangeData.peakHours),
            revenue: Number(rangeData.sportFieldRevenue || 0),
            period: `${fromDate} → ${toDate}`,
        };
    }, [rangeData, fromDate, toDate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-800">Báo cáo & Thống kê</h1>
                    <div className="flex gap-2">
                        <button
                            className={clsx(
                                "px-4 py-2 rounded-xl font-semibold border transition-all",
                                tab === "monthly"
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            )}
                            onClick={() => setTab("monthly")}
                        >
                            Theo tháng
                        </button>
                        <button
                            className={clsx(
                                "px-4 py-2 rounded-xl font-semibold border transition-all",
                                tab === "range"
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            )}
                            onClick={() => setTab("range")}
                        >
                            Theo khoảng ngày
                        </button>
                    </div>
                </div>

                {/* Monthly filter */}
                {tab === "monthly" && (
                    <div className="mt-6 bg-white rounded-2xl p-6 shadow border border-slate-100">
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600">Tháng</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={12}
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className="mt-1 w-28 px-3 py-2 rounded-lg border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600">Năm</label>
                                <input
                                    type="number"
                                    min={2000}
                                    max={2100}
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="mt-1 w-32 px-3 py-2 rounded-lg border"
                                />
                            </div>
                            <button
                                onClick={fetchMonthly}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-slate-800 text-white hover:bg-slate-900"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Tải dữ liệu
                            </button>
                            <button
                                onClick={runAiMonthly}
                                disabled={loadingAiMonthly}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                            >
                                <Brain className="w-4 h-4" />
                                {loadingAiMonthly ? "Đang phân tích..." : "Phân tích AI"}
                            </button>
                        </div>

                        {loadingMonthly && <p className="mt-4 text-slate-500">Đang tải dữ liệu...</p>}

                        {monthlyCharts && !loadingMonthly && (
                            <>
                                <HeaderKPI period={monthlyCharts.period} revenue={monthlyCharts.revenue} />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                    <Card title="Đặt lịch theo loại" icon={<PieIcon className="w-5 h-5" />}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <PieChart>
                                                <Tooltip />
                                                <Legend />
                                                <Pie
                                                    data={monthlyCharts.types}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={95}
                                                    label
                                                >
                                                    {monthlyCharts.types.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>

                                    <Card title="Trạng thái đặt lịch" icon={<BarChart3 className="w-5 h-5" />}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <BarChart data={monthlyCharts.statuses}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="status" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="total" name="Số lượt">
                                                    {monthlyCharts.statuses.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card>

                                    <Card title="Khung giờ cao điểm" icon={<LineIcon className="w-5 h-5" />}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <LineChart data={monthlyCharts.hours}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="hour" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="total" name="Số lượt" dot />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </div>

                                {aiMonthly && <AnalysisCard title="Phân tích AI (tháng)" content={aiMonthly} />}
                            </>
                        )}
                    </div>
                )}

                {/* Range filter */}
                {tab === "range" && (
                    <div className="mt-6 bg-white rounded-2xl p-6 shadow border border-slate-100">
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Từ ngày
                                </label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="mt-1 px-3 py-2 rounded-lg border"
                                />
                            </div>
                            <div>
                                <label className=" text-sm font-medium text-slate-600 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Đến ngày
                                </label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="mt-1 px-3 py-2 rounded-lg border"
                                />
                            </div>
                            <button
                                onClick={fetchRange}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-slate-800 text-white hover:bg-slate-900"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Tải dữ liệu
                            </button>
                            <button
                                onClick={runAiRange}
                                disabled={loadingAiRange}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                            >
                                <Brain className="w-4 h-4" />
                                {loadingAiRange ? "Đang phân tích..." : "Phân tích AI"}
                            </button>
                        </div>

                        {loadingRange && <p className="mt-4 text-slate-500">Đang tải dữ liệu...</p>}

                        {rangeCharts && !loadingRange && (
                            <>
                                <HeaderKPI period={rangeCharts.period} revenue={rangeCharts.revenue} />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                    <Card title="Đặt lịch theo loại" icon={<PieIcon className="w-5 h-5" />}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <PieChart>
                                                <Tooltip />
                                                <Legend />
                                                <Pie
                                                    data={rangeCharts.types}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={95}
                                                    label
                                                >
                                                    {rangeCharts.types.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>

                                    <Card title="Trạng thái đặt lịch" icon={<BarChart3 className="w-5 h-5" />}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <BarChart data={rangeCharts.statuses}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="status" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="total" name="Số lượt">
                                                    {rangeCharts.statuses.map((_, i) => (
                                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card>

                                    <Card title="Khung giờ cao điểm" icon={<LineIcon className="w-5 h-5" />}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <LineChart data={rangeCharts.hours}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="hour" />
                                                <YAxis allowDecimals={false} />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="total" name="Số lượt" dot />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </div>

                                {aiRange && <AnalysisCard title="Phân tích AI (khoảng ngày)" content={aiRange} />}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Card({ title, icon, children }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700">{icon}</div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function HeaderKPI({ period, revenue }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-2xl p-5 shadow border border-slate-100">
                <div className="text-slate-500 text-sm">Kỳ báo cáo</div>
                <div className="text-xl font-bold text-slate-800 mt-1">{period}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border border-slate-100">
                <div className="text-slate-500 text-sm">Doanh thu sân thể thao</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">
                    {Number(revenue || 0).toLocaleString("vi-VN")} đ
                </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border border-slate-100">
                <div className="text-slate-500 text-sm">Gợi ý</div>
                <div className="text-sm text-slate-700 mt-1">
                    Dùng “Phân tích AI” để sinh nhận định & khuyến nghị nhanh.
                </div>
            </div>
        </div>
    );
}

function AnalysisCard({ title, content }) {
    const lines = (content || "").split("\n").filter(Boolean);
    return (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-700">
                    <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>
            <div className="prose prose-slate max-w-none">
                {lines.length ? (
                    <ul className="list-disc ml-5">
                        {lines.map((l, i) => (
                            <li key={i} className="leading-relaxed">{l.replace(/^-+\s?/, "")}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-600">Chưa có nội dung.</p>
                )}
            </div>
        </div>
    );
}
