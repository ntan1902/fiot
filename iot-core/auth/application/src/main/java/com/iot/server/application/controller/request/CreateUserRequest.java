package com.iot.server.application.controller.request;

import java.util.List;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserRequest {
    @Email(message = "Email is not valid")
    private String email;

    @NotEmpty(message = "First name must be not empty")
    private String firstName;

    @NotEmpty(message = "Last name must be not empty")
    private String lastName;

    private String tenantId;
    private String customerId;

    @NotEmpty(message = "Authorities must be not empty")
    @Size(min = 1)
    private List<String> authorities;
}
