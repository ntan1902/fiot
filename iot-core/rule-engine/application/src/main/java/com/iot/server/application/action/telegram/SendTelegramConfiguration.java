package com.iot.server.application.action.telegram;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendTelegramConfiguration implements ActionConfiguration<SendTelegramConfiguration> {
    private String token;
    private String chatIds;
    private String messageTemplate;

    @Override
    public SendTelegramConfiguration getDefaultConfiguration() {
        return SendTelegramConfiguration.builder()
                .token("")
                .chatIds("")
                .messageTemplate("Device ${deviceName} has high temperature: ${temperature}°C")
                .build();
    }
}
