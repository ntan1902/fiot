package com.iot.server.common.response;

import com.google.gson.JsonElement;
import java.util.Set;
import java.util.UUID;
import lombok.Data;

@Data
public class DeviceResponse {
    private UUID id;
    private UUID tenantId;
    private UUID firstTenantId;
    private JsonElement deviceData;
    private String type;
    private String name;
    private String label;
    private UUID firmwareId;
    private UUID softwareId;
    private Set<UUID> userIds;
    private UUID ruleChainId;
}
