package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.DeleteRuleChainRequest;
import com.iot.server.application.controller.response.DeleteRuleChainResponse;
import com.iot.server.common.exception.IoTException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class DeleteRuleChainHandler extends BaseHandler<DeleteRuleChainRequest, DeleteRuleChainResponse> {
    @Override
    protected void validate(DeleteRuleChainRequest request) throws IoTException {
    }

    @Override
    protected DeleteRuleChainResponse processRequest(DeleteRuleChainRequest request) {
        DeleteRuleChainResponse response = new DeleteRuleChainResponse();

        UUID ruleChainId = UUID.fromString(request.getRuleChainId());
        ruleChainService.deleteRuleChainById(ruleChainId);
        ruleEngineService.deleteRuleChainActor(ruleChainId);

        return response;
    }
}
