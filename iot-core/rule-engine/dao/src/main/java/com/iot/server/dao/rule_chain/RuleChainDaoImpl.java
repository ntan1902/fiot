package com.iot.server.dao.rule_chain;

import com.iot.server.common.dao.JpaAbstractDao;
import com.iot.server.common.model.BaseReadQuery;
import com.iot.server.dao.entity.rule_chain.RuleChainEntity;
import com.iot.server.dao.repository.RuleChainRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class RuleChainDaoImpl extends JpaAbstractDao<RuleChainEntity, UUID> implements RuleChainDao {

    private final RuleChainRepository ruleChainRepository;

    @Override
    protected JpaRepository<RuleChainEntity, UUID> getJpaRepository() {
        return ruleChainRepository;
    }

    @Override
    public List<RuleChainEntity> findAllByTenantId(UUID tenantId, BaseReadQuery query) {
        log.debug("{}, {}", tenantId, query);

        Pageable pageable = PageRequest.of(
                query.getPage(),
                query.getSize(),
                Sort.by(Sort.Direction.fromString(query.getOrder()), query.getProperty())
        );

        return ruleChainRepository.findAllByTenantId(tenantId, pageable);
    }
}
