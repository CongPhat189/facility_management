package com.trancongphat.facility_management.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix khi client gửi message đến server (ví dụ: /app/approveBooking)
        registry.setApplicationDestinationPrefixes("/app");

        // Prefix khi server gửi message ra client
        registry.enableSimpleBroker("/topic", "/queue");

        // Định nghĩa prefix cho queue riêng từng user
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint cho FE connect qua ws://localhost:8080/ws
        // Không dùng SockJS vì FE của bạn dùng STOMP client thuần
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*"); // Cho phép tất cả FE kết nối
    }
}
