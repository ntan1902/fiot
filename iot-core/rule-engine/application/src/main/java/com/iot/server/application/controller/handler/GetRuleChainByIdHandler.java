package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetRuleChainByIdRequest;
import com.iot.server.application.controller.response.GetRuleChainByIdResponse;
import com.iot.server.common.exception.IoTException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GetRuleChainByIdHandler extends BaseHandler<GetRuleChainByIdRequest, GetRuleChainByIdResponse> {
    @Override
    protected void validate(GetRuleChainByIdRequest request) throws IoTException {
        validateNotNull("ruleChainId", request.getRuleChainId());
        validateNotEmpty("ruleChainId", request.getRuleChainId());
    }

    @Override
    protected GetRuleChainByIdResponse processRequest(GetRuleChainByIdRequest request) {
        GetRuleChainByIdResponse response = new GetRuleChainByIdResponse();

        response.setRuleChain(
                ruleChainService.findRuleChainById(
                        toUUID(request.getRuleChainId())
                )
        );

        return response;
    }
}
