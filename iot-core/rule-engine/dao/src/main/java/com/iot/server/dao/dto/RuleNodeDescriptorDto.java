package com.iot.server.dao.dto;

import com.iot.server.common.dto.BaseDto;
import com.iot.server.dao.entity.rule_node_descriptor.RuleNodeDescriptorEntity;
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
public class RuleNodeDescriptorDto extends BaseDto<UUID> {
    private String type;
    private String name;
    private String configClazz;
    private String defaultConfig;
    private String clazz;
    private String relationNames;

    public RuleNodeDescriptorDto(RuleNodeDescriptorEntity ruleNodeDescriptorEntity) {
        super(ruleNodeDescriptorEntity);
        this.type = ruleNodeDescriptorEntity.getType();
        this.name = ruleNodeDescriptorEntity.getName();
        this.configClazz = ruleNodeDescriptorEntity.getConfigClazz();
        this.defaultConfig = ruleNodeDescriptorEntity.getDefaultConfig();
        this.clazz = ruleNodeDescriptorEntity.getClazz();
        this.relationNames = ruleNodeDescriptorEntity.getRelationNames();
    }
}
