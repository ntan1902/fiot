package com.iot.server.domain.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ValidateDeviceToken {
    private String token;
    private BasicMqttCredentials basicMqttCredentials;
}
