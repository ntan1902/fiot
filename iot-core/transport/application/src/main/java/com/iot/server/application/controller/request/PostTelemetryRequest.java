package com.iot.server.application.controller.request;

import lombok.Data;

@Data
public class PostTelemetryRequest {
    private Object token;
    private Object json;
}
