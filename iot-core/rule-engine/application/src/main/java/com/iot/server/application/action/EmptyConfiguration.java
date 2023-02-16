package com.iot.server.application.action;

import lombok.Data;

@Data
public class EmptyConfiguration implements ActionConfiguration<EmptyConfiguration> {
    @Override
    public EmptyConfiguration getDefaultConfiguration() {
        return new EmptyConfiguration();
    }
}
