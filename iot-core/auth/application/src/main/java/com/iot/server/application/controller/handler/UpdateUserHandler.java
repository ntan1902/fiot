package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.UpdateUserRequest;
import com.iot.server.application.controller.response.UpdateUserResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class UpdateUserHandler extends BaseHandler<UpdateUserRequest, UpdateUserResponse> {
    @Override
    protected void validate(final UpdateUserRequest request) throws IoTException {

    }

    @Override
    protected UpdateUserResponse processRequest(final UpdateUserRequest request) {
        final UpdateUserResponse response = new UpdateUserResponse();

        final UserDto user = getUserFromRequest(request);
        response.setSuccess(
                userService.updateUser(user)
        );

        return response;
    }

    private UserDto getUserFromRequest(final UpdateUserRequest request) {
        return UserDto.builder()
                .id(toUUID(request.getId()))
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .deleted(request.getDeleted())
                .build();
    }
}
