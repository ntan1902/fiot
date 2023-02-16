package com.iot.server.application.action.rpc;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendRpcRequestConfiguration implements ActionConfiguration<SendRpcRequestConfiguration> {
    private int timeout;
    private UUID deviceId;

    @Override
    public SendRpcRequestConfiguration getDefaultConfiguration() {
        return SendRpcRequestConfiguration.builder()
                .timeout(60000)
                .deviceId(UUID.fromString("5a57b756-955b-4754-b4d7-67349d50ba06"))
                .build();
    }
}
