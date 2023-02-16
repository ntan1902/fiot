package com.iot.server.application.action.firebase;

import com.iot.server.application.action.AbstractRuleNodeAction;
import com.iot.server.application.action.RuleNode;
import com.iot.server.application.action.function.FunctionConfiguration;
import com.iot.server.application.message.RuleNodeMsg;
import com.iot.server.application.service.RuleNodeJsEngine;
import com.iot.server.common.utils.GsonUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

@Slf4j
@RuleNode(
        type = "ACTION",
        name = "firebase",
        configClazz = FirebaseConfiguration.class
)
public class FirebaseAction extends AbstractRuleNodeAction {

  private FirebaseConfiguration config;
  private RestTemplate restTemplate;

  @Override
  protected void initConfig(String config) {
    this.config = GsonUtils.fromJson(config, FirebaseConfiguration.class);
    this.restTemplate = new RestTemplate();
  }

  @Override
  public void onMsg(RuleNodeMsg msg) {
    try {
      String url = config.getFirebaseUrl() + config.getChildPath() + ".json";

      if (config.getFirebaseMethod() == FirebaseMethod.GET) {

        String resp = restTemplate.getForObject(url, String.class);
        msg.setData(resp);

        ctx.tellSuccess(msg);

      } else if (config.getFirebaseMethod() == FirebaseMethod.SET) {
        restTemplate.put(url, config.getValue().isEmpty() ? msg.getData() : config.getValue());

        ctx.tellSuccess(msg);
      } else if (config.getFirebaseMethod() == FirebaseMethod.PUSH) {
        restTemplate.postForLocation(url, config.getValue().isEmpty() ? msg.getData() : config.getValue());

        ctx.tellSuccess(msg);
      } else if (config.getFirebaseMethod() == FirebaseMethod.UPDATE) {
        restTemplate.patchForObject(url, config.getValue().isEmpty() ? msg.getData() : config.getValue(), String.class);

        ctx.tellSuccess(msg);
      } else if (config.getFirebaseMethod() == FirebaseMethod.REMOVE) {
        restTemplate.delete(config.getFirebaseUrl() + config.getChildPath());

        ctx.tellSuccess(msg);
      }
    } catch (Exception ex) {
      log.error("Error occurred when call api to Firebase: ", ex);
      this.ctx.tellFailure(msg);
    }

  }

  @Override
  public void stop() {
  }
}
