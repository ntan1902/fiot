package com.iot.server.application.controller.request;

import lombok.Data;

@Data
public class ActivateUserRequest {
  private String activateToken;
  private String password;
}
