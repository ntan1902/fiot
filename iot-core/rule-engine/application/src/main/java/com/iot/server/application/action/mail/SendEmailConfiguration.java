package com.iot.server.application.action.mail;

import com.iot.server.application.action.ActionConfiguration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendEmailConfiguration implements ActionConfiguration<SendEmailConfiguration> {

    private String smtpHost;
    private int smtpPort;
    private String username;
    private String password;

    private int connectionTimeout;
    private int timeout;
    private int writeTimeout;

    private boolean enableTls;

    private String fromTemplate;
    private String toTemplate;
    private String ccTemplate;
    private String bccTemplate;
    private String subjectTemplate;
    private String bodyTemplate;
    private Boolean isHtmlTemplate;

    @Override
    public SendEmailConfiguration getDefaultConfiguration() {
        SendEmailConfiguration configuration = new SendEmailConfiguration();
        configuration.setSmtpHost("localhost");
        configuration.setSmtpPort(1025);
        configuration.setUsername("dev");
        configuration.setPassword("dev");

        configuration.setConnectionTimeout(5000);
        configuration.setTimeout(10000);
        configuration.setWriteTimeout(5000);

        configuration.setEnableTls(true);

        configuration.setFromTemplate("info@testmail.org");
        configuration.setToTemplate("${userEmail}");
        configuration.setCcTemplate("");
        configuration.setBccTemplate("");
        configuration.setSubjectTemplate("Device ${deviceLabel} temperature high");
        configuration.setBodyTemplate("Device ${deviceName} has high temperature ${temperature}°C");
        configuration.setIsHtmlTemplate(false);

        return configuration;
    }
}
