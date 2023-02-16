package com.iot.server.rest.client;

import com.iot.server.common.request.GetHealthCheckRequest;
import com.iot.server.common.request.GetOrCreateDeviceRequest;
import com.iot.server.common.request.TenantRequest;
import com.iot.server.common.request.ValidateDeviceRequest;
import com.iot.server.common.response.DeviceResponse;

public interface EntityServiceClient {
    String registerTenant(TenantRequest tenantRequest);

    DeviceResponse validateDevice(ValidateDeviceRequest validateDeviceRequest);

    DeviceResponse getOrCreateDevice(GetOrCreateDeviceRequest getOrCreateDeviceRequest);

    boolean getHealthCheck(GetHealthCheckRequest getHealthCheckRequest);

    DeviceResponse getDeviceById(String deviceId);
}
