package com.iot.server.application.message;

public class RuleChainToRuleNodeMsg extends RuleEngineActorMsg {
    public RuleChainToRuleNodeMsg(RuleNodeMsg msg) {
        super(msg);
    }

    @Override
    public ActorMsgType getType() {
        return ActorMsgType.RULE_CHAIN_TO_RULE_NODE_MSG;
    }
}
