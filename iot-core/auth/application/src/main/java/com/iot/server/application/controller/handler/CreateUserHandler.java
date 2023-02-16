package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.CreateUserRequest;
import com.iot.server.application.controller.response.CreateUserResponse;
import com.iot.server.application.service.EmailService;
import com.iot.server.common.enums.ReasonEnum;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import static com.iot.server.domain.user.UserServiceImpl.ACTIVATE_TOKEN;

@Slf4j
@Component
@RequiredArgsConstructor
public class CreateUserHandler extends BaseHandler<CreateUserRequest, CreateUserResponse> {

  private final EmailService emailService;

  private static final String ACTIVATE_URL_PATTERN = "%s/login/create-password?activateToken=%s";

  @Value("${spring.mail.base-url}")
  private String baseUrl;

  @Override
  protected void validate(CreateUserRequest request) throws IoTException {
    validateNotNull("authorities", request.getAuthorities());
    validateAuthorities("authorities", request.getAuthorities());
  }

  @Override
  protected CreateUserResponse processRequest(final CreateUserRequest request) {
    final CreateUserResponse response = new CreateUserResponse();

    final UserDto user = getUserFromRequest(request);
    final UserDto savedUser = userService.createUserWithAuthorities(user, request.getAuthorities());
    response.setUserId(savedUser.getId());

    String activateUrl = String.format(ACTIVATE_URL_PATTERN, baseUrl, savedUser.getExtraInfo().get(ACTIVATE_TOKEN));
    String email = savedUser.getEmail();
    try {
      emailService.sendActivationEmail(activateUrl, email);
    } catch (Exception exception) {
      log.warn("Unable to send mail: activateLink={}, email={}", activateUrl, email);
      userService.deleteUser(savedUser.getId());
      throw new IoTException(ReasonEnum.SEND_EMAIL_FAILED, String.format("Unable to send activation mail: %s", email));
    }

    return response;
  }

  private UserDto getUserFromRequest(CreateUserRequest request) {
    UserDto userDto = UserDto.builder()
            .email(request.getEmail())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .build();

    if (request.getTenantId() != null && !request.getTenantId().isEmpty())
      userDto.setTenantId(toUUID(request.getTenantId()));

    if (request.getCustomerId() != null && !request.getCustomerId().isEmpty())
      userDto.setCustomerId(toUUID(request.getCustomerId()));

    return userDto;
  }
}
