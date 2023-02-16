package com.iot.server.application.action.create_alarm;


import com.iot.server.application.action.ActionConfiguration;
import com.iot.server.common.enums.AlarmSeverity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateAlarmConfiguration implements ActionConfiguration<CreateAlarmConfiguration> {
    private String severity;
    private String alarmName;
    private String detail;

    @Override
    public CreateAlarmConfiguration getDefaultConfiguration() {
        return CreateAlarmConfiguration.builder()
                .detail(
                        "Device ${deviceName} has high temperature ${temperature}°C"
                )
                .severity(AlarmSeverity.CRITICAL.name())
                .alarmName("Critical Temperature")
                .build();
    }
}