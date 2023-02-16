package com.iot.server.dao.entity.rule_node_descriptor;

import com.iot.server.common.entity.BaseEntity;
import com.iot.server.common.entity.EntityConstants;
import com.iot.server.dao.dto.RuleNodeDescriptorDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.UUID;

@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = EntityConstants.RULE_NODE_DESCRIPTOR_TABLE_NAME)
public class RuleNodeDescriptorEntity extends BaseEntity<UUID> {

    @Column(name = EntityConstants.RULE_NODE_DESCRIPTOR_TYPE_PROPERTY)
    private String type;

    @Column(name = EntityConstants.RULE_NODE_DESCRIPTOR_NAME_PROPERTY)
    private String name;

    @Column(name = EntityConstants.RULE_NODE_DESCRIPTOR_CONFIG_CLAZZ_PROPERTY)
    private String configClazz;

    @Column(name = EntityConstants.RULE_NODE_DESCRIPTOR_DEFAULT_CONFIG_PROPERTY, length = 10_000)
    private String defaultConfig;

    @Column(name = EntityConstants.RULE_NODE_DESCRIPTOR_CLAZZ_PROPERTY)
    private String clazz;

    @Column(name = EntityConstants.RULE_NODE_RELATION_NAMES_PROPERTY, length = 10_000)
    private String relationNames;

    public RuleNodeDescriptorEntity(RuleNodeDescriptorDto ruleNodeDescriptorDto) {
        this.type = ruleNodeDescriptorDto.getType();
        this.name = ruleNodeDescriptorDto.getName();
        this.configClazz = ruleNodeDescriptorDto.getConfigClazz();
        this.defaultConfig = ruleNodeDescriptorDto.getDefaultConfig();
        this.clazz = ruleNodeDescriptorDto.getClazz();
        this.relationNames = ruleNodeDescriptorDto.getRelationNames();
    }
}
