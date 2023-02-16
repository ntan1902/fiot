package com.iot.application.service;

import com.iot.server.common.request.GetHealthCheckRequest;

public interface DeviceServiceClient {
  boolean getHealthCheck(GetHealthCheckRequest getHealthCheckRequest);
}
