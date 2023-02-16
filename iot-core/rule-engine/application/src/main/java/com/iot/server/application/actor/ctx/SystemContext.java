package com.iot.server.application.actor.ctx;

import com.iot.server.application.service.EmailService;
import com.iot.server.application.service.RpcService;
import com.iot.server.application.service.RuleNodeJsEngine;
import com.iot.server.domain.relation.RelationService;
import com.iot.server.domain.rule_chain.RuleChainService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

public interface SystemContext {
    RabbitTemplate getTelemetryTemplate();

    RabbitTemplate getDebugTemplate();

    RabbitTemplate getAlarmTemplate();

    RuleNodeJsEngine createJsEngine(String script, String... args);

    EmailService getEmailService();

    RuleChainService getRuleChainService();

    RelationService getRelationService();

    RpcService getRpcService();
}
