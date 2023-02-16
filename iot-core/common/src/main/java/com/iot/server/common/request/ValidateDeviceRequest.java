package com.iot.server.common.request;

import com.iot.server.common.enums.DeviceCredentialsType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidateDeviceRequest {
    private Object token;
    private DeviceCredentialsType type;
}
