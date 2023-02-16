package com.iot.server.application.actor.ctx;

import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.service.EmailService;
import com.iot.server.application.service.RpcService;
import com.iot.server.application.service.RuleNodeJsEngine;
import com.iot.server.domain.relation.RelationService;
import com.iot.server.domain.rule_chain.RuleChainService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

public interface ActionContext {
    RabbitTemplate getTelemetryTemplate();

    RabbitTemplate getDebugTemplate();

    RabbitTemplate getAlarmTemplate();

    RuleNodeJsEngine createJsEngine(String script, String... args);

    EmailService getEmailService();

    RuleChainService getRuleChainService();

    RelationService getRelationService();

    RpcService getRpcService();

    void tellNext(RuleNodeMsg msg, String relationName);

    void tellSuccess(RuleNodeMsg msg);

    void tellFailure(RuleNodeMsg msg);

    void tellTrue(RuleNodeMsg msg);

    void tellFalse(RuleNodeMsg msg);

    RuleNodeContext getRuleNodeContext();

    void setRuleNodeContext(RuleNodeContext ruleNodeContext);
}
