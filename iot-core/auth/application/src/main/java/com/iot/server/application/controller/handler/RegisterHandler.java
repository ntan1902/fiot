package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.RegisterRequest;
import com.iot.server.application.controller.response.RegisterResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.UserDto;
import org.springframework.stereotype.Component;

@Component
public class RegisterHandler extends BaseHandler<RegisterRequest, RegisterResponse> {
    @Override
    protected void validate(final RegisterRequest request) throws IoTException {
        validateNotEmpty("email", request.getEmail());
        validateNotEmpty("firstName", request.getFirstName());
        validateNotEmpty("lastName", request.getLastName());
        validateNotEmpty("password", request.getPassword());
    }

    @Override
    protected RegisterResponse processRequest(final RegisterRequest request) {
        final UserDto user = userService.registerUser(getUserFromRequest(request), request.getPassword());

        final RegisterResponse response = new RegisterResponse();
        response.setUserId(user.getId());
        return response;
    }

    private UserDto getUserFromRequest(RegisterRequest request) {
        return UserDto.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
    }
}
