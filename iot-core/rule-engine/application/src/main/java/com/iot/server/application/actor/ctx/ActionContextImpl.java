package com.iot.server.application.actor.ctx;

import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.message.RuleNodeToRuleChainMsg;
import com.iot.server.application.service.EmailService;
import com.iot.server.application.service.RpcService;
import com.iot.server.application.service.RuleNodeJsEngine;
import com.iot.server.domain.relation.RelationService;
import com.iot.server.domain.rule_chain.RuleChainService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
@AllArgsConstructor
public class ActionContextImpl implements ActionContext {

    private SystemContext systemContext;
    private RuleNodeContext ruleNodeContext;

    @Override
    public RabbitTemplate getTelemetryTemplate() {
        return systemContext.getTelemetryTemplate();
    }

    @Override
    public RabbitTemplate getDebugTemplate() {
        return systemContext.getDebugTemplate();
    }

    @Override
    public RabbitTemplate getAlarmTemplate() {
        return systemContext.getAlarmTemplate();
    }

    @Override
    public RuleNodeJsEngine createJsEngine(String script, String... args) {
        return systemContext.createJsEngine(script, args);
    }

    @Override
    public EmailService getEmailService() {
        return systemContext.getEmailService();
    }

    @Override
    public RuleChainService getRuleChainService() {
        return systemContext.getRuleChainService();
    }

    @Override
    public RelationService getRelationService() {
        return systemContext.getRelationService();
    }

    @Override
    public RpcService getRpcService() {
        return systemContext.getRpcService();
    }

    @Override
    public void tellNext(RuleNodeMsg msg, String relationName) {
        tellNext(msg, Collections.singleton(relationName));
    }

    @Override
    public void tellSuccess(RuleNodeMsg msg) {
        tellNext(msg, Collections.singleton("Success"));
    }

    @Override
    public void tellFailure(RuleNodeMsg msg) {
        tellNext(msg, Collections.singleton("Failure"));
    }

    @Override
    public void tellTrue(RuleNodeMsg msg) {
        tellNext(msg, new HashSet<>(Arrays.asList("True", "Success")));
    }

    @Override
    public void tellFalse(RuleNodeMsg msg) {
        tellNext(msg, new HashSet<>(Arrays.asList("False", "Success")));
    }

    @Override
    public RuleNodeContext getRuleNodeContext() {
        return this.ruleNodeContext;
    }

    @Override
    public void setRuleNodeContext(RuleNodeContext ruleNodeContext) {
        this.ruleNodeContext = ruleNodeContext;
    }

    private void tellNext(RuleNodeMsg msg, Set<String> relationNames) {
        ruleNodeContext.getRuleChainActor()
                .tell(new RuleNodeToRuleChainMsg(msg, ruleNodeContext.getSelf().getId(), relationNames));
    }
}
