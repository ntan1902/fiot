package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetUserByIdRequest;
import com.iot.server.application.controller.response.GetUserByIdResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class GetUserByIdHandler extends BaseHandler<GetUserByIdRequest, GetUserByIdResponse> {
    @Override
    protected void validate(final GetUserByIdRequest request) throws IoTException {
        validateNotEmpty("userId", request.getUserId());
    }

    @Override
    protected GetUserByIdResponse processRequest(final GetUserByIdRequest request) {
        final GetUserByIdResponse response = new GetUserByIdResponse();

        final UserDto user = userService.findUserWithExtraInfoById(toUUID(request.getUserId()));
        response.setUser(user);

        return response;
    }
}
