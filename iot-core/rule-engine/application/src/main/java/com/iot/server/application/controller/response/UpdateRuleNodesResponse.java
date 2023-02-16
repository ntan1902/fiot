package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.RuleNodeDto;
import com.iot.server.dao.dto.RuleNodeRelation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRuleNodesResponse {
    private List<RuleNodeRelation> relations;
    private List<RuleNodeDto> ruleNodes;
}
