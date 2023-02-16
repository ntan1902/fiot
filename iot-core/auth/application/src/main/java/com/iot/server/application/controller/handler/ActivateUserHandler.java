package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.ActivateUserRequest;
import com.iot.server.application.controller.response.ActivateUserResponse;
import com.iot.server.application.security.jwt.JwtFactory;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.UserCredentialsDto;
import com.iot.server.dao.dto.UserDto;
import com.iot.server.domain.model.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collection;

import static com.iot.server.domain.user.UserServiceImpl.ROLES;

@Component
@RequiredArgsConstructor
public class ActivateUserHandler extends BaseHandler<ActivateUserRequest, ActivateUserResponse> {

  private final JwtFactory jwtFactory;

  @Override
  protected void validate(ActivateUserRequest request) throws IoTException {
    validateNotEmpty("activateToken", request.getActivateToken());
    validateNotEmpty("password", request.getPassword());
  }

  @Override
  protected ActivateUserResponse processRequest(ActivateUserRequest request) {
    ActivateUserResponse response = new ActivateUserResponse();

    String activateToken = request.getActivateToken();
    String password = request.getPassword();

    UserCredentialsDto userCredentialsDto = userService.activateUser(activateToken, password);

    UserDto userDto = userService.findUserWithExtraInfoById(userCredentialsDto.getUserId());

    SecurityUser securityUser = new SecurityUser(userDto, userCredentialsDto.isEnabled(), (Collection<String>) userDto.getExtraInfo().get(ROLES));

    response.setUser(securityUser);
    response.setAccessToken(jwtFactory.createAccessToken(securityUser));
    response.setRefreshToken(jwtFactory.createRefreshToken(securityUser));
    response.setTokenType("Bearer");

    return response;
  }
}
