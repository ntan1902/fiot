package com.iot.server.dao.rule_node;

import com.iot.server.common.dao.Dao;
import com.iot.server.dao.entity.rule_node.RuleNodeEntity;

import java.util.List;
import java.util.UUID;

public interface RuleNodeDao extends Dao<RuleNodeEntity, UUID> {
    List<RuleNodeEntity> saveAllAndFlush(List<RuleNodeEntity> ruleNodeEntities);

    List<RuleNodeEntity> findAllByRuleChainId(UUID ruleChainId);
}
