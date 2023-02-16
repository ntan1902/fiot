package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.CreateRuleChainRequest;
import com.iot.server.application.controller.response.CreateRuleChainResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.RuleChainDto;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class CreateRuleChainHandler extends BaseHandler<CreateRuleChainRequest, CreateRuleChainResponse> {
  @Override
  protected void validate(CreateRuleChainRequest request) throws IoTException {
  }

  @Override
  protected CreateRuleChainResponse processRequest(CreateRuleChainRequest request) {
    CreateRuleChainResponse response = new CreateRuleChainResponse();

    UUID tenantId = getCurrentUser().getId();
    final RuleChainDto savedRuleChain = ruleChainService.createRuleChain(getRuleChainFromRequest(request, tenantId));

    if (savedRuleChain != null) {
      response.setRuleChain(savedRuleChain);
      CompletableFuture.runAsync(() -> ruleEngineService.initRuleChainActor(savedRuleChain.getId()));

    }
    return response;
  }

  private RuleChainDto getRuleChainFromRequest(CreateRuleChainRequest request, UUID tenantId) {
    return RuleChainDto.builder()
            .name(request.getName())
            .root(request.getRoot())
            .tenantId(tenantId)
            .createUid(tenantId)
            .build();
  }
}
