package com.iot.server.common.request;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetOrCreateDeviceRequest {
    private String name;
    private String label;
    private UUID tenantId;
    private UUID firstTenantId;
    private UUID gatewayId;
}
