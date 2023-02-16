package com.iot.server.application.action;

public interface ActionConfiguration<T extends ActionConfiguration> {
    T getDefaultConfiguration();
}
