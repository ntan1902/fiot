package com.iot.server.application.message;

public class RuleEngineToRuleChainMsg extends RuleEngineActorMsg {

    public RuleEngineToRuleChainMsg(RuleNodeMsg msg) {
        super(msg);
    }

    @Override
    public ActorMsgType getType() {
        return ActorMsgType.RULE_ENGINE_TO_RULE_CHAIN_MSG;
    }
}
