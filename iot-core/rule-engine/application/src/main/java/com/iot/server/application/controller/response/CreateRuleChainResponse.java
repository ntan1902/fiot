package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.RuleChainDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRuleChainResponse {
    private RuleChainDto ruleChain;
}
