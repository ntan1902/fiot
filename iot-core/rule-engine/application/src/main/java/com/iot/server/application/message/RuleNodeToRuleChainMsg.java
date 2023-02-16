package com.iot.server.application.message;

import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class RuleNodeToRuleChainMsg extends RuleEngineActorMsg {

    private Set<String> relationNames;
    private UUID prevRuleNodeId;

    public RuleNodeToRuleChainMsg(RuleNodeMsg msg, UUID prevRuleNodeId, Set<String> relationNames) {
        super(msg);
        this.relationNames = relationNames;
        this.prevRuleNodeId = prevRuleNodeId;
    }

    @Override
    public ActorMsgType getType() {
        return ActorMsgType.RULE_NODE_TO_RULE_CHAIN_MSG;
    }
}
