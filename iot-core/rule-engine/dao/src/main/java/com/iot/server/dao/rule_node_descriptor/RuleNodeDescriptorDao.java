package com.iot.server.dao.rule_node_descriptor;

import com.iot.server.common.dao.Dao;
import com.iot.server.dao.entity.rule_node_descriptor.RuleNodeDescriptorEntity;

import java.util.List;
import java.util.UUID;

public interface RuleNodeDescriptorDao extends Dao<RuleNodeDescriptorEntity, UUID> {
    void saveAll(List<RuleNodeDescriptorEntity> ruleNodeDescriptorEntities);

    void deleteAll();
}
