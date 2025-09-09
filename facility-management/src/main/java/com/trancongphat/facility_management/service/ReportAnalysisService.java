package com.trancongphat.facility_management.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
public class ReportAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ReportAnalysisService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;
    @Value("${gemini.api.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Nhận reportData (JSON dạng Map) -> Gọi Gemini -> trả về đoạn văn phân tích.
     *
     * @param reportData: chứa số liệu tổng hợp (bookingsByType, bookingsByStatus, sportFieldRevenue, previousMonth...)
     */
    public String analyzeReport(Map<String, Object> reportData) {
        String prompt = buildPrompt(reportData);

        // Gemini nhận key qua query param
        String url = String.format("%s/models/%s:generateContent?key=%s", apiUrl, model, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Kiểm tra trường hợp bị chặn bởi safety filters
                Object promptFeedback = response.getBody().get("promptFeedback");
                if (promptFeedback instanceof Map) {
                    Object block = ((Map<?, ?>) promptFeedback).get("blockReason");
                    if (block != null) {
                        log.warn("Gemini trả blockReason: {}", block);
                        return fallbackMessage("Nội dung bị chặn bởi hệ thống an toàn. Vui lòng thử lại với dữ liệu khác.");
                    }
                }

                // Bóc tách text từ candidates[0].content.parts[0].text
                Object candidatesObj = response.getBody().get("candidates");
                if (candidatesObj instanceof List<?> candidates && !candidates.isEmpty()) {
                    Object first = candidates.get(0);
                    if (first instanceof Map<?, ?> cand) {
                        Object content = cand.get("content");
                        if (content instanceof Map<?, ?> cont) {
                            Object partsObj = cont.get("parts");
                            if (partsObj instanceof List<?> parts && !parts.isEmpty()) {
                                Object p0 = parts.get(0);
                                if (p0 instanceof Map<?, ?> p0map) {
                                    Object text = p0map.get("text");
                                    if (text instanceof String s && !s.isBlank()) {
                                        return s;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            log.warn("Phản hồi Gemini không hợp lệ hoặc rỗng: {}", response);
            return fallbackMessage("Không nhận được phân tích từ AI. Vui lòng kiểm tra lại dữ liệu hoặc cấu hình.");
        } catch (Exception e) {
            log.error("Lỗi gọi Gemini API: {}", e.getMessage(), e);
            return fallbackMessage("AI tạm thời không khả dụng. Bạn vẫn có thể xem biểu đồ và số liệu thô.");
        }
    }

    private String buildPrompt(Map<String, Object> reportData) {
        // (Optional) dựng nhãn thời gian đẹp nếu có period.from/to
        String periodLabel = "";
        try {
            Object periodObj = reportData.get("period");
            if (periodObj instanceof Map<?, ?> period) {
                Object from = period.get("from");
                Object to = period.get("to");
                Object label = period.get("label");
                if (label instanceof String l && !l.isBlank()) {
                    periodLabel = "Khoảng thời gian: " + l;
                } else if (from instanceof String f && to instanceof String t) {
                    periodLabel = "Khoảng thời gian: " + f + " → " + t;
                }
            }
        } catch (Exception ignored) {
        }

        // In JSON “thô” để AI bám vào số liệu, tránh bịa
        String jsonData = safeToPrettyJson(reportData);

        return String.format("""
        Bạn là trợ lý phân tích dữ liệu cho hệ thống quản lý cơ sở vật chất của trường đại học.
        Nhiệm vụ: viết một bản tóm tắt (5–10 gạch đầu dòng) bằng tiếng Việt, dựa trên JSON số liệu bên dưới.

        YÊU CẦU:
        - Trình bày rõ ràng, có số liệu cụ thể (%%, số lượt, số tiền).
        - Phân tích:
          1) Xu hướng sử dụng theo loại tài nguyên (phòng học, sân thể thao, thiết bị)
          2) Doanh thu (chỉ sân thể thao, nếu có)
          3) Thiết bị/nguồn lực nổi bật (nếu có thông tin)
          4) Tỷ lệ trạng thái (đã duyệt/chờ duyệt/từ chối/hủy)
          5) Nhận định nhanh & 1–2 khuyến nghị hành động
        - Nếu có dữ liệu tháng trước (previousMonth), hãy nêu so sánh tăng/giảm (MoM).
        - Không bịa số liệu ngoài JSON, nếu thiếu hãy nói "không có dữ liệu".

        %s

        DỮ LIỆU JSON:
        %s
        """, periodLabel, jsonData);

    }

    /**
     * Fallback message để UI hiển thị vẫn lịch sự.
     */
    private String fallbackMessage(String reason) {
        return "- " + reason + "\n"
                + "- Vui lòng thử lại sau, hoặc xem biểu đồ/số liệu thô đã có.";
    }

    /**
     * Convert Map -> pretty “JSON-like” string an toàn để hiển thị trong prompt.
     * (Tránh phụ thuộc thư viện JSON nếu bạn muốn gọn nhẹ; nếu đã dùng Jackson thì thay bằng ObjectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(reportData))
     */
    private String safeToPrettyJson(Object obj) {
        try {
            // Nếu bạn đã dùng Jackson trong dự án, dùng đoạn dưới sẽ đẹp hơn:
            // return new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(obj);
            return prettyPrint(obj, 0);
        } catch (Exception e) {
            return String.valueOf(obj);
        }
    }

    private String prettyPrint(Object obj, int indent) {
        String pad = "  ".repeat(indent);
        if (obj instanceof Map<?, ?> map) {
            StringBuilder sb = new StringBuilder("{\n");
            Iterator<? extends Map.Entry<?, ?>> it = map.entrySet().iterator();
            while (it.hasNext()) {
                var e = it.next();
                sb.append(pad).append("  \"").append(String.valueOf(e.getKey())).append("\": ");
                sb.append(prettyPrint(e.getValue(), indent + 1));
                if (it.hasNext()) sb.append(",");
                sb.append("\n");
            }
            sb.append(pad).append("}");
            return sb.toString();
        } else if (obj instanceof List<?> list) {
            StringBuilder sb = new StringBuilder("[\n");
            for (int i = 0; i < list.size(); i++) {
                sb.append(pad).append("  ").append(prettyPrint(list.get(i), indent + 1));
                if (i < list.size() - 1) sb.append(",");
                sb.append("\n");
            }
            sb.append(pad).append("]");
            return sb.toString();
        } else if (obj instanceof String s) {
            return "\"" + s.replace("\"", "\\\"") + "\"";
        } else {
            return String.valueOf(obj);
        }
    }
}
