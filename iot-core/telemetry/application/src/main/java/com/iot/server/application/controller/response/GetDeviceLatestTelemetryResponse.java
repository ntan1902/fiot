package com.iot.server.application.controller.response;

import com.iot.server.dao.dto.TsKvDto;
import java.util.List;
import lombok.Data;

@Data
public class GetDeviceLatestTelemetryResponse {
    private List<TsKvDto> kvs;
}
