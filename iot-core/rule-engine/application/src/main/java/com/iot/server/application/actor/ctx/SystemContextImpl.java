package com.iot.server.application.actor.ctx;

import com.iot.server.application.service.*;
import com.iot.server.domain.relation.RelationService;
import com.iot.server.domain.rule_chain.RuleChainService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SystemContextImpl implements SystemContext {

    private final RabbitTemplate telemetryRabbitTemplate;
    private final RabbitTemplate debugRabbitTemplate;
    private final RabbitTemplate alarmRabbitTemplate;
    private final NashornService nashornService;
    private final EmailService emailService;
    private final RuleChainService ruleChainService;
    private final RelationService relationService;
    private final RpcService rpcService;

    @Override
    public RabbitTemplate getTelemetryTemplate() {
        return telemetryRabbitTemplate;
    }

    @Override
    public RabbitTemplate getDebugTemplate() {
        return debugRabbitTemplate;
    }

    @Override
    public RabbitTemplate getAlarmTemplate() {
        return alarmRabbitTemplate;
    }


    @Override
    public RuleNodeJsEngine createJsEngine(String script, String... args) {
        return new RuleNodeJsEngineImpl(nashornService, script, args);
    }

    @Override
    public EmailService getEmailService() {
        return emailService;
    }

    @Override
    public RuleChainService getRuleChainService() {
        return ruleChainService;
    }

    @Override
    public RelationService getRelationService() {
        return relationService;
    }

    @Override
    public RpcService getRpcService() {
        return rpcService;
    }
}
