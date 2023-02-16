package com.iot.server.application.security.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "spring.mvc.cors")
public class MvcCorsConfig {

    private Map<String, CorsConfiguration> mappings = new HashMap<>();

    public MvcCorsConfig() {
        super();
    }

    public Map<String, CorsConfiguration> getMappings() {
        return mappings;
    }

    public void setMappings(Map<String, CorsConfiguration> mappings) {
        this.mappings = mappings;
    }
}
