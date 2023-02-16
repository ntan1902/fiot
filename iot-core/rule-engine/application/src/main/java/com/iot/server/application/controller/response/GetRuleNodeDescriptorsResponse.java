package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.RuleNodeDescriptorDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetRuleNodeDescriptorsResponse {
    private List<RuleNodeDescriptorDto> ruleNodeDescriptors;
}
