package com.iot.server.application.controller.response;

import com.iot.server.domain.model.SecurityUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivateUserResponse {
    private SecurityUser user;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
}
