package com.iot.server.domain.model;

import lombok.Data;

@Data
public class BasicMqttCredentials {

    private String clientId;
    private String username;
    private String password;

}
