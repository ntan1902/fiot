package com.iot.server.application.action.debug;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.service.RuleNodeJsEngine;
import com.iot.server.common.queue.QueueMsg;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;
import java.util.concurrent.CompletionException;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "debug",
        configClazz = DebugConfiguration.class
)
public class DebugAction extends AbstractRuleNodeAction {

  private DebugConfiguration config;
  private RuleNodeJsEngine jsEngine;

  @Override
  protected void initConfig(String config) {
    this.config = GsonUtils.fromJson(config, DebugConfiguration.class);
    this.jsEngine = this.ctx.createJsEngine(this.config.getScript());
  }

  @Override
  public void onMsg(RuleNodeMsg msg) {
    jsEngine.executeToStringAsync(msg)
            .thenAccept(result -> {
              log.info("{}", result);
              ctx.getDebugTemplate().convertAndSend(
                      GsonUtils.toJson(new QueueMsg(UUID.randomUUID().toString(), msg.getEntityId(), msg.getRuleChainId(), result, msg.getMetaData(), msg.getType(), msg.getUserIds()))
              );

              this.ctx.tellSuccess(msg);
            })
            .exceptionally(t -> {
              log.error("Error occurred when execute js: ", t);
              ctx.getDebugTemplate().convertAndSend(
                      GsonUtils.toJson(new QueueMsg(UUID.randomUUID().toString(), msg.getEntityId(), msg.getRuleChainId(), t.getMessage(), msg.getMetaData(), msg.getType(), msg.getUserIds()))
              );

              this.ctx.tellFailure(msg);
              throw new CompletionException(t);
            });
  }

  @Override
  public void stop() {
    if (jsEngine != null) {
      jsEngine.stop();
    }
  }
}
