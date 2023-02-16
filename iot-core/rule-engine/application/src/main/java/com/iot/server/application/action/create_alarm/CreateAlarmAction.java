package com.iot.server.application.action.create_alarm;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.common.model.AlarmModel;
import com.iot.server.common.queue.QueueMsg;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;

import java.util.UUID;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "create alarm",
        configClazz = CreateAlarmConfiguration.class
)
public class CreateAlarmAction extends AbstractRuleNodeAction {

  private CreateAlarmConfiguration config;

  @Override
  protected void initConfig(String config) {
    this.config = GsonUtils.fromJson(config, CreateAlarmConfiguration.class);
  }

  @Override
  public void onMsg(RuleNodeMsg msg) {
    AlarmModel alarmModel = getAlarmModel(msg);

    try {
      ctx.getAlarmTemplate().convertAndSend(
              GsonUtils.toJson(new QueueMsg(UUID.randomUUID().toString(), msg.getEntityId(), msg.getRuleChainId(), GsonUtils.toJson(alarmModel), msg.getMetaData(), msg.getType(), msg.getUserIds()))
      );

      this.ctx.tellSuccess(msg);
    } catch (AmqpException ex) {
      this.ctx.tellFailure(msg);
    }
  }

  @Override
  public void stop() {

  }

  private AlarmModel getAlarmModel(RuleNodeMsg msg) {
    return AlarmModel.builder()
            .deviceId(msg.getEntityId())
            .name(config.getAlarmName())
            .severity(config.getSeverity())
            .detail(processTemplate(config.getDetail(), msg))
            .build();
  }
}
