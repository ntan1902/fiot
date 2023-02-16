package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.RuleChainDto;
import lombok.Data;

import java.util.List;

@Data
public class GetRuleChainsResponse {
    private List<RuleChainDto> ruleChains;
}
