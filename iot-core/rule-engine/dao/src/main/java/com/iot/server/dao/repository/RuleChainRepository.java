package com.iot.server.dao.repository;

import com.iot.server.dao.entity.rule_chain.RuleChainEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RuleChainRepository extends JpaRepository<RuleChainEntity, UUID> {
    List<RuleChainEntity> findAllByTenantId(UUID tenantId, Pageable pageable);
}
