package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetUsersRequest;
import com.iot.server.application.controller.response.GetUsersResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.UserDto;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetUsersHandler extends BaseHandler<GetUsersRequest, GetUsersResponse> {
    @Override
    protected void validate(final GetUsersRequest request) throws IoTException {
        validateNotEmpty("userId", request.getUserId());
    }

    @Override
    protected GetUsersResponse processRequest(final GetUsersRequest request) {
        final GetUsersResponse response = new GetUsersResponse();

        final List<UserDto> users = userService.findUsers(toUUID(request.getUserId()));
        response.setUsers(users);

        return response;
    }
}
