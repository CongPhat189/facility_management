package com.trancongphat.facility_management.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String askChatbot(String userMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // URL phải kèm query param key
        String url = apiUrl + "?key=" + apiKey;

        // Body đúng chuẩn Gemini
        Map<String, Object> userPart = Map.of("text", "Bạn là trợ lý ảo của hệ thống Quản lý Cơ Sở Vật Chất Trường Đại Học OU. " +
                "Nhiệm vụ của bạn: giải thích cách sử dụng hệ thống (đặt phòng, mượn thiết bị, thuê sân thể thao, thanh toán bằng MoMo) và địa chỉ của các cơ sở Trường Đại Học Mở Thành phố Hồ Chí Minh). " +
                "Nếu câu hỏi không liên quan đến hệ thống, hãy trả lời lịch sự rằng bạn chỉ hỗ trợ các chức năng của hệ thống. " +
                "Câu hỏi của người dùng: " + userMessage);
        Map<String, Object> userContent = Map.of(
                "role", "user",
                "parts", List.of(userPart)
        );

        Map<String, Object> body = Map.of("contents", List.of(userContent));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, Map.class
            );

            // In log để debug
            System.out.println("Gemini response: " + response.getBody());

            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.getBody().get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "Không nhận được phản hồi từ Gemini.";
            }

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            if (parts != null && !parts.isEmpty()) {
                return (String) parts.get(0).get("text");
            }

            return "Không có nội dung trả lời từ Gemini.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Xin lỗi, chatbot hiện không khả dụng. Vui lòng thử lại sau.";
        }
    }
}
