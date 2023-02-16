package com.iot.server.dao.rule_node_descriptor;

import com.iot.server.common.dao.JpaAbstractDao;
import com.iot.server.dao.entity.rule_node_descriptor.RuleNodeDescriptorEntity;
import com.iot.server.dao.repository.RuleNodeDescriptorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class RuleNodeDescriptorDaoImpl extends JpaAbstractDao<RuleNodeDescriptorEntity, UUID> implements RuleNodeDescriptorDao {

    private final RuleNodeDescriptorRepository ruleNodeDescriptorRepository;

    @Override
    protected JpaRepository<RuleNodeDescriptorEntity, UUID> getJpaRepository() {
        return ruleNodeDescriptorRepository;
    }

    @Override
    public void saveAll(List<RuleNodeDescriptorEntity> ruleNodeDescriptorEntities) {
        log.debug("{}", ruleNodeDescriptorEntities);
        ruleNodeDescriptorRepository.saveAll(ruleNodeDescriptorEntities);
    }

    @Override
    public void deleteAll() {
        log.debug("");
        ruleNodeDescriptorRepository.deleteAll();
    }
}
