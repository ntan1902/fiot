package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetRuleNodeDescriptorsRequest;
import com.iot.server.application.controller.response.GetRuleNodeDescriptorsResponse;
import com.iot.server.common.exception.IoTException;
import org.springframework.stereotype.Component;

@Component
public class GetRuleNodeDescriptorsHandler extends BaseHandler<GetRuleNodeDescriptorsRequest, GetRuleNodeDescriptorsResponse> {
    @Override
    protected void validate(GetRuleNodeDescriptorsRequest request) throws IoTException {

    }

    @Override
    protected GetRuleNodeDescriptorsResponse processRequest(GetRuleNodeDescriptorsRequest request) {
        GetRuleNodeDescriptorsResponse response = new GetRuleNodeDescriptorsResponse();

        response.setRuleNodeDescriptors(ruleNodeDescriptorService.findAll());

        return response;
    }
}
