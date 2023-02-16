package com.iot.server.domain.rule_node_descriptor;

import com.iot.server.dao.dto.RuleNodeDescriptorDto;

import java.util.List;

public interface RuleNodeDescriptorService {

    void saveAll(List<RuleNodeDescriptorDto> ruleNodeDescriptorDtos);

    List<RuleNodeDescriptorDto> findAll();

    void deleteAll();
}
