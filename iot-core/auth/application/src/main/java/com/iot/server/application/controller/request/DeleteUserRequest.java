package com.iot.server.application.controller.request;

import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class DeleteUserRequest {
    @NotEmpty(message = "User id must not be empty")
    private String userId;
}
