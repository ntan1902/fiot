package com.iot.server.common.model;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlarmModel {
    private UUID deviceId;
    private String name;
    private String severity;
    private String detail;
}
