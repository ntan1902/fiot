package com.iot.server.dao.dto;

import com.iot.server.common.dto.BaseDto;
import com.iot.server.dao.entity.rule_chain.RuleChainEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class RuleChainDto extends BaseDto<UUID> {
    private UUID tenantId;
    private String name;
    private UUID firstRuleNodeId;
    private Boolean root;

    public RuleChainDto(RuleChainEntity ruleChainEntity) {
        super(ruleChainEntity);
        this.tenantId = ruleChainEntity.getTenantId();
        this.name = ruleChainEntity.getName();
        this.firstRuleNodeId = ruleChainEntity.getFirstRuleNodeId();
        this.root = ruleChainEntity.getRoot();
    }
}
