package com.iot.server.application.actor.rule_node;

import akka.actor.typed.ActorRef;
import akka.actor.typed.Behavior;
import akka.actor.typed.javadsl.ActorContext;
import akka.actor.typed.javadsl.Behaviors;
import com.iot.server.application.actor.AbstractRuleActor;
import com.iot.server.application.actor.ctx.SystemContext;
import com.iot.server.application.message.ActorMsg;
import com.iot.server.application.message.DeleteActorMsg;
import com.iot.server.application.message.RuleChainToRuleNodeMsg;
import com.iot.server.application.message.RuleChainToRuleNodeUpdateMsg;
import com.iot.server.dao.dto.RuleNodeDto;

import java.lang.reflect.InvocationTargetException;

public class RuleNodeActor extends AbstractRuleActor {

    private final RuleNodeActorProcessor processor;

    public static Behavior<ActorMsg> create(SystemContext systemContext, RuleNodeDto ruleNodeDto, ActorRef<ActorMsg> ruleChainActor) {
        return Behaviors.setup(ctx -> new RuleNodeActor(ctx, systemContext, ruleNodeDto, ruleChainActor));
    }

    public RuleNodeActor(ActorContext<ActorMsg> context, SystemContext systemContext, RuleNodeDto ruleNodeDto, ActorRef<ActorMsg> ruleChainActor) throws ClassNotFoundException, NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        super(context);
        this.processor = new RuleNodeActorProcessor(context, systemContext, ruleNodeDto, ruleChainActor);
        context.getLog().info("Rule node actor {}-{} started", ruleNodeDto.getRuleChainId(), ruleNodeDto.getId());
    }


    @Override
    protected boolean process(ActorMsg msg) {
        switch (msg.getType()) {
            case RULE_CHAIN_TO_RULE_NODE_MSG:
                processor.onRuleChainToRuleNodeMsg((RuleChainToRuleNodeMsg) msg);
                break;

            case RULE_CHAIN_TO_RULE_NODE_UPDATE_MSG:
                processor.onRuleChainToRuleNodeUpdateMsg((RuleChainToRuleNodeUpdateMsg) msg);
                break;

            case DELETE_ACTOR_MSG:
                processor.onRuleChainToRuleNodeDeleteMsg((DeleteActorMsg) msg);
                break;

            default:
                return false;
        }
        return true;
    }

}
