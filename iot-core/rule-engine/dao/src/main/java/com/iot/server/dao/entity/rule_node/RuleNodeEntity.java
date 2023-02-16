package com.iot.server.dao.entity.rule_node;

import com.iot.server.common.entity.BaseEntity;
import com.iot.server.common.entity.EntityConstants;
import com.iot.server.dao.dto.RuleNodeDto;
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
@Table(name = EntityConstants.RULE_NODE_TABLE_NAME)
public class RuleNodeEntity extends BaseEntity<UUID> {

    @Column(name = EntityConstants.RULE_NODE_CHAIN_ID_PROPERTY)
    private UUID ruleChainId;

    @Column(name = EntityConstants.RULE_NODE_CLAZZ_PROPERTY)
    private String clazz;

    @Column(name = EntityConstants.RULE_NODE_NAME_PROPERTY)
    private String name;

    @Column(name = EntityConstants.RULE_NODE_CONFIG_PROPERTY, length = 10_000)
    private String config;

    @Column(name = EntityConstants.RULE_NODE_ADDITIONAL_INFO_PROPERTY)
    private String additionalInfo;

    @Column(name = EntityConstants.RULE_NODE_CONFIG_CLAZZ_PROPERTY)
    private String configClazz;

    public RuleNodeEntity(RuleNodeDto ruleNodeDto) {
        super(ruleNodeDto);
        this.ruleChainId = ruleNodeDto.getRuleChainId();
        this.clazz = ruleNodeDto.getClazz();
        this.name = ruleNodeDto.getName();
        this.config = ruleNodeDto.getConfig();
        this.additionalInfo = ruleNodeDto.getAdditionalInfo();
        this.configClazz = ruleNodeDto.getConfigClazz();
    }
}
