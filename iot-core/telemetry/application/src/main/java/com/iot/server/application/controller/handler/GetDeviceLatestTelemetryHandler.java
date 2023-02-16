package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetDeviceLatestTelemetryRequest;
import com.iot.server.application.controller.response.GetDeviceLatestTelemetryResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.dao.dto.TsKvDto;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class GetDeviceLatestTelemetryHandler extends BaseHandler<GetDeviceLatestTelemetryRequest, GetDeviceLatestTelemetryResponse> {
    @Override
    protected void validate(GetDeviceLatestTelemetryRequest request) throws IoTException {
        validateNotEmpty("deviceId", request.getDeviceId());
    }

    @Override
    protected GetDeviceLatestTelemetryResponse processRequest(GetDeviceLatestTelemetryRequest request) {
        GetDeviceLatestTelemetryResponse response = new GetDeviceLatestTelemetryResponse();

        List<TsKvDto> kvs = tsKvService.findTsKvLatestByEntityId(toUUID(request.getDeviceId()));

        response.setKvs(kvs);
        return response;
    }
}