package com.trancongphat.facility_management.controller;
import com.trancongphat.facility_management.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/chatbot")
public class ChatBotController {
    @Autowired
    private ChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String answer = chatbotService.askChatbot(userMessage);
        return ResponseEntity.ok(answer);
    }

}
