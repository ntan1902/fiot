package com.iot.server.application.actor.rule_chain;

import akka.actor.typed.Behavior;
import akka.actor.typed.javadsl.ActorContext;
import akka.actor.typed.javadsl.Behaviors;
import com.iot.server.application.actor.AbstractRuleActor;
import com.iot.server.application.actor.ctx.SystemContext;
import com.iot.server.application.message.*;

import java.util.UUID;

public class RuleChainActor extends AbstractRuleActor {

    private final RuleChainActorProcessor processor;

    public static Behavior<ActorMsg> create(SystemContext systemContext, UUID ruleChainId) {
        return Behaviors.setup(ctx -> new RuleChainActor(ctx, systemContext, ruleChainId));
    }

    public RuleChainActor(ActorContext<ActorMsg> context, SystemContext systemContext, UUID ruleChainId) {
        super(context);
        this.processor = new RuleChainActorProcessor(context, systemContext, ruleChainId);

        context.getLog().info("Rule chain actor {} started", ruleChainId);
    }

    @Override
    protected boolean process(ActorMsg msg) {
        switch (msg.getType()) {
            case RULE_ENGINE_TO_RULE_CHAIN_MSG:
                processor.onRuleEngineToRuleChainMsg((RuleEngineToRuleChainMsg) msg);
                break;

            case RULE_NODE_TO_RULE_CHAIN_MSG:
                processor.onRuleNodeToRuleChainMsg((RuleNodeToRuleChainMsg) msg);
                break;

            case RULE_CHAIN_TO_RULE_CHAIN_MSG:
                break;

            case RULE_ENGINE_TO_RULE_CHAIN_UPDATE_MSG:
                processor.onRuleEngineToRuleChainUpdateMsg((RuleEngineToRuleChainUpdateMsg) msg);
                break;

            case DELETE_ACTOR_MSG:
                processor.onDeleteActorMsg((DeleteActorMsg) msg);
                break;

            default:
                return false;
        }
        return true;
    }
}

