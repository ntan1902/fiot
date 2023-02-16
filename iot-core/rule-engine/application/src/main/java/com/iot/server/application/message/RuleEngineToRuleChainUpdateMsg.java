package com.iot.server.application.message;

import com.iot.server.dao.dto.RelationDto;
import com.iot.server.dao.dto.RuleNodeDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RuleEngineToRuleChainUpdateMsg implements ActorMsg {

  private List<RuleNodeDto> ruleNodeDtos;
  private List<RelationDto> relationDtos;

  @Override
  public ActorMsgType getType() {
    return ActorMsgType.RULE_ENGINE_TO_RULE_CHAIN_UPDATE_MSG;
  }
}
