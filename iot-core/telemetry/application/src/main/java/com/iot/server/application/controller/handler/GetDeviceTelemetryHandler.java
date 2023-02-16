package com.iot.server.application.controller.handler;

import com.iot.server.application.controller.request.GetDeviceTelemetryRequest;
import com.iot.server.application.controller.response.GetDeviceTelemetryResponse;
import com.iot.server.common.exception.IoTException;
import com.iot.server.common.model.BaseReadQuery;
import com.iot.server.dao.dto.TsKvDto;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class GetDeviceTelemetryHandler extends BaseHandler<GetDeviceTelemetryRequest, GetDeviceTelemetryResponse> {
    @Override
    protected void validate(GetDeviceTelemetryRequest request) throws IoTException {
        validateNotEmpty("deviceId", request.getDeviceId());
    }

    @Override
    protected GetDeviceTelemetryResponse processRequest(GetDeviceTelemetryRequest request) {
        GetDeviceTelemetryResponse response = new GetDeviceTelemetryResponse();

        List<TsKvDto> kvs = tsKvService.findTsKvByEntityId(toUUID(request.getDeviceId()),
                BaseReadQuery.builder()
                        .page(request.getPage())
                        .size(request.getSize())
                        .order(request.getOrder())
                        .property(request.getProperty())
                        .build());

        response.setKvs(kvs);
        return response;
    }
}
