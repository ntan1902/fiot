package com.iot.server.application.actor.rule_node;

import akka.actor.typed.ActorRef;
import akka.actor.typed.javadsl.ActorContext;
import com.iot.server.application.action.RuleNodeAction;
import com.iot.server.application.actor.ctx.RuleNodeContext;
import com.iot.server.application.actor.ctx.ActionContext;
import com.iot.server.application.actor.ctx.ActionContextImpl;
import com.iot.server.application.actor.ctx.SystemContext;
import com.iot.server.application.message.*;
import com.iot.server.dao.dto.RuleNodeDto;

import java.lang.reflect.InvocationTargetException;

public class RuleNodeActorProcessor {
  private final RuleNodeAction ruleNodeAction;
  private final ActionContext actionContext;

  public RuleNodeActorProcessor(ActorContext<ActorMsg> context, SystemContext systemContext, RuleNodeDto ruleNodeDto, ActorRef<ActorMsg> ruleChainActor) throws ClassNotFoundException, NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
    Class<?> componentClazz = Class.forName(ruleNodeDto.getClazz());
    this.ruleNodeAction = (RuleNodeAction) componentClazz.getDeclaredConstructor().newInstance();
    this.actionContext = new ActionContextImpl(
            systemContext,
            RuleNodeContext.builder()
                    .self(ruleNodeDto)
                    .selfActor(context.getSelf())
                    .ruleChainActor(ruleChainActor)
                    .build()
    );
    this.ruleNodeAction.init(actionContext, ruleNodeDto.getConfig());
  }

  public void onRuleChainToRuleNodeMsg(RuleChainToRuleNodeMsg envelope) {
    RuleNodeMsg msg = envelope.getMsg();
    try {
      ruleNodeAction.onMsg(msg);
    } catch (Exception ex) {
      this.actionContext.tellFailure(msg);
    }
  }

  public void onRuleChainToRuleNodeUpdateMsg(RuleChainToRuleNodeUpdateMsg envelope) {
    RuleNodeDto ruleNodeDto = envelope.getRuleNodeDto();
    this.actionContext.getRuleNodeContext().setSelf(ruleNodeDto);
    this.ruleNodeAction.init(actionContext, ruleNodeDto.getConfig());
  }

  public void onRuleChainToRuleNodeDeleteMsg(DeleteActorMsg envelope) {
    if (ruleNodeAction != null) {
      ruleNodeAction.stop();
    }
  }
}
