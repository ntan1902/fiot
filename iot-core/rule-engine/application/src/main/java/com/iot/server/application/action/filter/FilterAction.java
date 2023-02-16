package com.iot.server.application.action.filter;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.service.RuleNodeJsEngine;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "filter",
        configClazz = FilterConfiguration.class,
        relationNames = {"True", "False", "Success", "Failure"}
)
public class FilterAction extends AbstractRuleNodeAction {

  private FilterConfiguration config;
  private RuleNodeJsEngine jsEngine;

  @Override
  protected void initConfig(String config) {
    this.config = GsonUtils.fromJson(config, FilterConfiguration.class);
    this.jsEngine = this.ctx.createJsEngine(this.config.getScript());
  }

  @Override
  public void onMsg(RuleNodeMsg msg) {
    try {
      Boolean result = jsEngine.executeFilterAsync(msg).get();

      if (Boolean.TRUE.equals(result)) {
        this.ctx.tellTrue(msg);
      } else {
        this.ctx.tellFalse(msg);
      }

      this.ctx.tellSuccess(msg);
    } catch (Exception ex) {
      log.error("Error occurred when execute js: ", ex);
      this.ctx.tellFailure(msg);
    }
  }

  @Override
  public void stop() {
    if (jsEngine != null) {
      jsEngine.stop();
    }
  }
}