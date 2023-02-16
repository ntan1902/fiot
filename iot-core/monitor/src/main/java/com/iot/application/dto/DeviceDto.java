package com.iot.application.dto;

import com.iot.application.entity.DeviceEntity;
import com.iot.server.common.dto.BaseDto;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DeviceDto extends BaseDto<UUID> {

    private UUID tenantId;
    private UUID firstTenantId;
    private UUID ruleChainId;
    private String deviceData;
    private String type;
    private String name;
    private String label;

    private Long lastActiveTime;
    private Long idleTime;
    private Boolean isLive;
    private Boolean isHeadCheck;
    private String headDomain;

    public DeviceDto(DeviceEntity deviceEntity) {
        super(deviceEntity);
        this.tenantId = deviceEntity.getTenantId();
        this.firstTenantId = deviceEntity.getFirstTenantId();
        this.ruleChainId = deviceEntity.getRuleChainId();
        this.deviceData = deviceEntity.getDeviceData();
        this.type = deviceEntity.getType();
        this.name = deviceEntity.getName();
        this.label = deviceEntity.getLabel();

        this.lastActiveTime = deviceEntity.getLastActiveTime();
        this.idleTime = deviceEntity.getIdleTime();
        this.isLive = deviceEntity.getIsLive();
        this.isHeadCheck = deviceEntity.getIsHeadCheck();
        this.headDomain = deviceEntity.getHeadDomain();
    }
}
