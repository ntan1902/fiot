package com.iot.server.application.action.save_ts;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.common.enums.MsgType;
import com.iot.server.common.queue.QueueMsg;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;

import java.util.UUID;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "save timeseries",
        configClazz = SaveTsConfiguration.class
)
public class SaveTsAction extends AbstractRuleNodeAction {

    private SaveTsConfiguration config;

    @Override
    protected void initConfig(String config) {
        this.config = GsonUtils.fromJson(config, SaveTsConfiguration.class);
    }

    @Override
    public void onMsg(RuleNodeMsg msg) {
        String type = "";
        if (config.isSkipLatestPersistence()) {
            type = MsgType.SAVE_TELEMETRY.name();
        } else {
            type = MsgType.SAVE_LATEST_TELEMETRY.name();
        }

        try {
            ctx.getTelemetryTemplate().convertAndSend(
                    GsonUtils.toJson(new QueueMsg(UUID.randomUUID().toString(), msg.getEntityId(), msg.getRuleChainId(), msg.getData(), msg.getMetaData(), type, msg.getUserIds()))
            );

            this.ctx.tellSuccess(msg);
        } catch (AmqpException ex) {
            this.ctx.tellFailure(msg);
        }
    }

    @Override
    public void stop() {

    }
}
