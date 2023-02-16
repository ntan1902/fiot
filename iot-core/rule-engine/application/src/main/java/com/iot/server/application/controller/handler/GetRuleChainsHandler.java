package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetRuleChainsRequest;
import com.iot.server.application.controller.response.GetRuleChainsResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.common.model.BaseReadQuery;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class GetRuleChainsHandler extends BaseHandler<GetRuleChainsRequest, GetRuleChainsResponse> {
    @Override
    protected void validate(GetRuleChainsRequest request) throws IoTException {
    }

    @Override
    protected GetRuleChainsResponse processRequest(GetRuleChainsRequest request) {
        GetRuleChainsResponse response = new GetRuleChainsResponse();

        UUID tenantId = getCurrentUser().getId();
        response.setRuleChains(
                ruleChainService.findAllByTenantId(tenantId, BaseReadQuery.builder()
                        .page(request.getPage())
                        .size(request.getSize())
                        .order(request.getOrder())
                        .property(request.getProperty())
                        .build()));

        return response;
    }

}
