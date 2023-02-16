package com.iot.server.domain.model;

import lombok.Data;

@Data
public class GatewayPostTelemetry {
    private String deviceName;
    private String deviceLabel;
    private Object telemetry;
}
