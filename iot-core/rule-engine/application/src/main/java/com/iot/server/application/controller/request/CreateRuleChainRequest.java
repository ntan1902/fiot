package com.iot.server.application.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRuleChainRequest {
    @NotEmpty(message = "name must not be empty")
    private String name;

    @NotNull(message = "root must not be null")
    private Boolean root;
}
