package com.iot.server.application.controller.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email(message = "Email is not valid")
    private String email;

    @NotEmpty(message = "First name must be not empty")
    private String firstName;

    @NotEmpty(message = "Last name must be not empty")
    private String lastName;

    @NotEmpty(message = "Password must be not empty")
    private String password;
}
