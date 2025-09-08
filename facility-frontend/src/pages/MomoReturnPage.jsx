import { useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../configs/APIs";
import { toast } from "react-toastify";

export default function MomoReturnPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmMomo = async () => {
            try {
                const orderId = params.get("orderId");   // Ví dụ: INV-12-123456
                const resultCode = params.get("resultCode"); // 0 = thành công
                const momoTransId = params.get("transId") || "TEST123"; // fallback khi local test

                if (!orderId) {
                    toast.error("Thiếu orderId từ MoMo!");
                    navigate("/dashboard");
                    return;
                }

                // Nếu MoMo trả về lỗi
                if (resultCode !== "0") {
                    toast.error("Thanh toán MoMo thất bại!");
                    navigate("/dashboard");
                    return;
                }

                // Tách invoiceId từ orderId (định dạng: INV-{invoiceId}-{timestamp})
                const parts = orderId.split("-");
                if (parts.length < 2) {
                    toast.error("orderId không hợp lệ!");
                    navigate("/dashboard");
                    return;
                }
                const invoiceId = parts[1];

                // Gửi request xác nhận local
                const res = await axios.post(`${BASE_URL}payments/momo/confirm-local/${invoiceId}?momoTransId=${momoTransId}`);



                if (res.status === 200) {
                    toast.success("Thanh toán MoMo thành công!");
                } else {
                    toast.warn("MoMo xác nhận nhưng hệ thống chưa cập nhật!");
                }
                navigate("/dashboard");

            } catch (err) {
                console.error("Lỗi confirm MoMo:", err);
                toast.error("Xác nhận MoMo thất bại!");
                navigate("/dashboard");
            }
        };

        confirmMomo();
    }, [params, navigate]);

    return <p className="text-center mt-10">Đang xử lý thanh toán MoMo...</p>;
}
