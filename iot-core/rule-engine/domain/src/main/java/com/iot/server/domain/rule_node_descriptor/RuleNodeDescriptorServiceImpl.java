package com.iot.server.domain.rule_node_descriptor;

import com.iot.server.dao.dto.RuleNodeDescriptorDto;
import com.iot.server.dao.entity.rule_node_descriptor.RuleNodeDescriptorEntity;
import com.iot.server.dao.rule_node_descriptor.RuleNodeDescriptorDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RuleNodeDescriptorServiceImpl implements RuleNodeDescriptorService {

    private final RuleNodeDescriptorDao ruleNodeDescriptorDao;

    @Override
    @CacheEvict(cacheNames = "ruleNodeDescriptors", allEntries = true)
    public void saveAll(List<RuleNodeDescriptorDto> ruleNodeDescriptorDtos) {
        log.trace("{}", ruleNodeDescriptorDtos);
        ruleNodeDescriptorDao.saveAll(
                ruleNodeDescriptorDtos.stream()
                        .map(ruleNodeDescriptorDto -> new RuleNodeDescriptorEntity(ruleNodeDescriptorDto))
                        .collect(Collectors.toList())
        );
    }

    @Override
    @Cacheable(cacheNames = "ruleNodeDescriptors", key = "'ruleNodeDescriptors'")
    public List<RuleNodeDescriptorDto> findAll() {
        log.trace("");
        return ruleNodeDescriptorDao.findAll()
                .stream()
                .map(ruleNodeDescriptorEntity -> new RuleNodeDescriptorDto(ruleNodeDescriptorEntity))
                .collect(Collectors.toList());
    }

    @Override
    @CacheEvict(cacheNames = "ruleNodeDescriptors", key = "'ruleNodeDescriptors'", allEntries = true)
    public void deleteAll() {
        log.trace("");
        ruleNodeDescriptorDao.deleteAll();
    }
}
