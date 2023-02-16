package com.iot.server.application.nashorn;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Data
@ConfigurationProperties(prefix = "js.nashorn")
@Configuration
@Component
@Slf4j
public class NashornConfig {
    private int monitorThreadPoolSize;
    private int maxCpuTime;
    private boolean allowNoBraces;
    private boolean allowLoadFunctions;
    private int maxPreparedStatements;
    private int maxErrors;

    @PostConstruct
    void printConfig() {
        log.info("Nashorn Config: {}", this);
    }
}
