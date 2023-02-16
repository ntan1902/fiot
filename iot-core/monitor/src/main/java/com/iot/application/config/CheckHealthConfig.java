package com.iot.application.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Data
@ConfigurationProperties(prefix = "check-health")
@Configuration
@Component
@Slf4j
public class CheckHealthConfig {

   private boolean runForever;
   private long repeatIntervalMs;
   private long initialOffsetMs;
}
