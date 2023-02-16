package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.RuleChainDto;
import lombok.Data;

@Data
public class GetRuleChainByIdResponse {
    private RuleChainDto ruleChain;
}
