package com.iot.server.dao.repository;

import com.iot.server.dao.entity.rule_node.RuleNodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RuleNodeRepository extends JpaRepository<RuleNodeEntity, UUID> {
    List<RuleNodeEntity> findAllByRuleChainId(UUID ruleChainId);
}
