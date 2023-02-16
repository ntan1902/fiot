package com.iot.application.entity;

import com.iot.application.dto.DeviceDto;
import com.iot.server.common.entity.BaseEntity;
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
public class DeviceEntity extends BaseEntity<UUID> {

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

    public DeviceEntity(DeviceDto deviceDto) {
        super(deviceDto);
        this.tenantId = deviceDto.getTenantId();
        this.firstTenantId = deviceDto.getFirstTenantId();
        this.ruleChainId = deviceDto.getRuleChainId();
        this.deviceData = deviceDto.getDeviceData();
        this.type = deviceDto.getType();
        this.name = deviceDto.getName();
        this.label = deviceDto.getLabel();

        this.lastActiveTime = deviceDto.getLastActiveTime();
        this.idleTime = deviceDto.getIdleTime();
        this.isLive = deviceDto.getIsLive();
        this.isHeadCheck = deviceDto.getIsHeadCheck();
        this.headDomain = deviceDto.getHeadDomain();
    }

}
