package com.iot.server.dao.rule_chain;

import com.iot.server.common.dao.Dao;
import com.iot.server.common.model.BaseReadQuery;
import com.iot.server.dao.entity.rule_chain.RuleChainEntity;

import java.util.List;
import java.util.UUID;

public interface RuleChainDao extends Dao<RuleChainEntity, UUID> {
    List<RuleChainEntity> findAllByTenantId(UUID tenantId, BaseReadQuery query);
}
