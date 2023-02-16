package com.iot.server.application.model;

import com.iot.server.common.model.MetaData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeviceRpcRequest {
    private String id;
    private UUID deviceId;
    private UUID ruleChainId;
    private DeviceRpcRequestData data;
    private MetaData metaData;
    private String type;
    private Set<UUID> userIds;
    private int timeout;
}
