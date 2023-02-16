package com.iot.server.application.message;

import com.iot.server.dao.dto.RuleNodeDto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RuleChainToRuleNodeUpdateMsg implements ActorMsg {

  private RuleNodeDto ruleNodeDto;

  @Override
  public ActorMsgType getType() {
    return ActorMsgType.RULE_CHAIN_TO_RULE_NODE_UPDATE_MSG;
  }
}
